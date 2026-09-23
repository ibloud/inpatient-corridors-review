let story = null;\nlet started = false;\nconst bootTimer = window.setTimeout(() => {\n  if (!started) fail("The Yellow Door is still waiting for its browser runtime. Try Reload, or open this page with ?debug=1.");\n}, 5000);
const storyContainer = document.getElementById("story");
const choicesContainer = document.getElementById("choices");
const errorContainer = document.getElementById("error");
const stats = document.getElementById("stats");
const debug = new URLSearchParams(location.search).get("debug") === "1";

function fail(message) {
  errorContainer.hidden = false;
  errorContainer.textContent = message;
}

function getVariable(name) {
  if (!story) return "";
  const state = story.variablesState;
  return typeof state.$ === "function" ? state.$(name) : state[name];
}

function updateStats() {
  if (!story || !debug) return;
  stats.hidden = false;
  stats.textContent = [
    `Support: ${getVariable("Support")}`,
    `Resistance: ${getVariable("Resistance")}`,
    `Knowledge: ${getVariable("Knowledge")}`,
    `Trust: ${getVariable("Trust")}`,
    `Participation: ${getVariable("Participation")}`,
    `Pressure: ${getVariable("SystemPressure")}`
  ].join(" · ");
}

function continueStory() {
  choicesContainer.innerHTML = "";

  while (story.canContinue) {
    const text = story.Continue();
    if (text.trim()) {
      const p = document.createElement("p");
      p.className = "story-line";
      p.textContent = text;
      storyContainer.appendChild(p);
    }
  }

  story.currentChoices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.textContent = choice.text;
    button.addEventListener("click", () => {
      choicesContainer.querySelectorAll("button").forEach(b => b.disabled = true);
      try {
        story.ChooseChoiceIndex(choice.index);
        continueStory();
      } catch (error) {
        fail(`The story could not continue: ${error.message}`);
      }
    });
    choicesContainer.appendChild(button);
  });

  updateStats();
  window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
}

function start() {
  if (!window.inkjs || typeof window.inkjs.Story !== "function") {
    throw new Error("The local Ink runtime did not load.");
  }

  fetch("../story/yellow-door-alpha.json", {cache: "no-store"})
    .then(response => {
      if (!response.ok) {
        throw new Error(`Compiled story returned HTTP ${response.status}`);
      }
      return response.text();
    })
    .then(raw => {
      const storyJson = raw.replace(/^\uFEFF/, "");
      story = new window.inkjs.Story(storyJson);
      errorContainer.hidden = true;
      storyContainer.innerHTML = "";
      continueStory();
    })
    .catch(error => {
      fail(`The alpha could not start. ${error.message}`);
      console.error(error);
    });
}

try {
  start();
} catch (error) {
  fail(`The alpha could not start. ${error.message}`);
  console.error(error);
}