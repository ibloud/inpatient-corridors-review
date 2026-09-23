import { Compiler } from "https://esm.sh/inkjs@2.4.0/full";

let story = null;
const storyContainer = document.getElementById("story");
const choicesContainer = document.getElementById("choices");
const errorContainer = document.getElementById("error");
const stats = document.getElementById("stats");
const debug = new URLSearchParams(location.search).get("debug") === "1";
if (debug) stats.hidden = false;

function fail(message) {
  errorContainer.hidden = false;
  errorContainer.textContent = message;
}

function updateStats() {
  if (!story || !debug) return;
  const v = story.variablesState;
  stats.textContent = [
    `Support: ${v.Support}`,
    `Resistance: ${v.Resistance}`,
    `Knowledge: ${v.Knowledge}`,
    `Trust: ${v.Trust}`,
    `Participation: ${v.Participation}`,
    `Pressure: ${v.SystemPressure}`
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
  window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
}

fetch("../story/yellow-door-alpha.ink")
  .then(response => {
    if (!response.ok) throw new Error(`Ink source returned HTTP ${response.status}`);
    return response.text();
  })
  .then(source => {
    story = new Compiler(source).Compile();
    continueStory();
  })
  .catch(error => {
    fail(`The alpha could not load or compile. ${error.message}`);
    console.error(error);
  });