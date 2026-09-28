// Explore compiled Ink with the real inkjs runtime, without modifying the story.
// Score-farming choices are once-only, so the current story has finite scores.
// Keep every raw score in the search key to cover all reachable runtime states.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Story } = require('inkjs');

const source = fs.readFileSync(path.join(__dirname, '../story/yellow-door-alpha.ink'), 'utf8');
const compiled = fs.readFileSync(process.argv[2] || path.join(__dirname, '../story/yellow-door-alpha.json'), 'utf8').replace(/^\uFEFF/, '');
const exceptions = require('./known-unreachable.json');
const variables = [...source.matchAll(/^VAR\s+(\w+)\s*=/gm)].map(match => match[1]);
const endings = [...source.matchAll(/^===\s+(ending_\w+)\s+===/gm)].map(match => match[1]);
const MAX_STATES = 30000;

assert.ok(variables.length > 0, 'No story variables found in the Ink source');
assert.ok(endings.length > 0, 'No ending knots found in the Ink source');
assert.ok(exceptions && typeof exceptions === 'object' && !Array.isArray(exceptions), 'Exceptions must be an object');
for (const [ending, entry] of Object.entries(exceptions)) {
  assert.ok(endings.includes(ending), `Exception ${ending} does not name an ending knot`);
  assert.ok(entry && typeof entry === 'object', `Exception ${ending} needs metadata`);
  for (const field of ['reason', 'owner', 'removal_condition', 'baseline_run']) {
    assert.ok(typeof entry[field] === 'string' && entry[field].trim(), `${ending} exception needs ${field}`);
  }
  assert.match(entry.baseline_run, /^https:\/\/\S+$/, `${ending} exception needs an https:// baseline run link`);
}

const story = new Story(compiled);
const counts = Object.fromEntries(endings.map(ending => [ending, 0]));
const seen = new Set();
const queue = [story.state.toJson()];
let explored = 0;
let finished = 0;

while (queue.length) {
  story.state.LoadJson(queue.shift());
  while (story.canContinue) story.Continue();

  const choices = story.currentChoices;
  const visited = endings.filter(knot => story.state.VisitCountAtPathString(knot) > 0);
  const signature = JSON.stringify({
    variables: variables.map(name => {
      return story.variablesState.$(name);
    }),
    choices: choices.map(choice => choice.pathStringOnChoice),
    visited,
  });
  if (seen.has(signature)) continue;
  seen.add(signature);
  explored++;
  assert.ok(explored <= MAX_STATES, `Exploration exceeded ${MAX_STATES} distinct states; no reachability pass can be claimed. Counts so far: ${JSON.stringify(counts)}`);

  if (!choices.length) {
    assert.ok(visited.length && story.state.VisitCountAtPathString('THE_END') > 0,
      'Dead end, or visit counting unavailable: finished run did not visit THE_END');
    for (const ending of visited) counts[ending]++;
    finished++;
    continue;
  }
  const checkpoint = story.state.toJson();
  for (let index = 0; index < choices.length; index++) {
    story.state.LoadJson(checkpoint);
    story.ChooseChoiceIndex(index);
    queue.push(story.state.toJson());
  }
}

assert.ok(finished > 0, 'No finished runs reached THE_END');
console.log(`Explored ${explored} distinct raw-score states; ${finished} finished runs.`);
for (const ending of endings) console.log(`${ending}: ${counts[ending]} finished runs`);

for (const ending of endings) {
  if (counts[ending] > 0 && exceptions[ending]) {
    throw new Error(`${ending} is now reachable. Delete its entry from known-unreachable.json.`);
  }
  if (counts[ending] === 0 && !exceptions[ending]) {
    throw new Error(`${ending} is unreachable; record a baseline failing run before adding a documented exception.`);
  }
  if (exceptions[ending]) {
    const message = `${ending} remains unreachable: ${exceptions[ending].reason} (owner: ${exceptions[ending].owner}; remove when: ${exceptions[ending].removal_condition}; baseline: ${exceptions[ending].baseline_run})`;
    console.warn(`::warning title=Known unreachable ending::${message}`);
    if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `- ⚠️ ${message}\n`);
  }
}
