let story = null;
let started = false;
let bootTimer = null;

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
    "Support: " + getVariable("Support"),
    "Resistance: " + getVariable("Resistance"),
    "Knowledge: " + getVariable("Knowledge"),
    "Trust: " + getVariable("Trust"),
    "Participation: " + getVariable("Participation"),
    "Pressure: " + getVariable("SystemPressure")
  ].join(" · ");
}

function continueStory(shouldScroll) {
  choicesContainer.innerHTML = "";

  let linesAdded = 0;

  while (story.canContinue) {
    const text = story.Continue();
    if (text && text.trim()) {
      const p = document.createElement("p");
      p.className = "story-line";
      p.textContent = text;
      storyContainer.appendChild(p);
      linesAdded += 1;
    }
  }

  story.currentChoices.forEach(function (choice) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.textContent = choice.text;
    button.addEventListener("click", function () {
      choicesContainer.querySelectorAll("button").forEach(function (b) {
        b.disabled = true;
      });
      try {
        story.ChooseChoiceIndex(choice.index);
        continueStory(true);
      } catch (error) {
        fail("The story could not continue. " + (error && error.message ? error.message : String(error)));
        console.error(error);
      }
    });
    choicesContainer.appendChild(button);
  });

  updateStats();

  const choiceCount = story.currentChoices.length;
  if (linesAdded === 0 && choiceCount === 0) {
    fail("The Ink story loaded, but returned no story text or choices. The browser runtime is working; the compiled story state needs inspection.");
    console.warn("Yellow Door reached an empty Ink state.", {
      canContinue: story.canContinue,
      choiceCount: choiceCount
    });
    return;
  }

  errorContainer.hidden = true;

  if (shouldScroll) {
    const target = choicesContainer.lastElementChild || storyContainer.lastElementChild;
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

function startYellowDoor() {
  if (!window.inkjs || typeof window.inkjs.Story !== "function") {
    fail("Runtime error: The local Ink runtime did not expose inkjs.Story.");
    return;
  }

  if (bootTimer) window.clearTimeout(bootTimer);
  bootTimer = window.setTimeout(function () {
    if (!started) {
      fail("The Yellow Door is taking too long to start. Try Reload, or open this page with ?debug=1.");
    }
  }, 8000);

  errorContainer.hidden = false;
  errorContainer.textContent = "Ink runtime ready. Loading the compiled story…";

  fetch("../story/yellow-door-alpha.json?v=20260923-6", {cache: "no-store"})
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Compiled story returned HTTP " + response.status);
      }
      return response.text();
    })
    .then(function (raw) {
      errorContainer.textContent = "Compiled story loaded. Creating the story…";
      const storyJson = raw.replace(/^\uFEFF/, "");
      story = new window.inkjs.Story(storyJson);
      storyContainer.innerHTML = "";
      continueStory(false);
      started = true;
      window.clearTimeout(bootTimer);
    })
    .catch(function (error) {
      window.clearTimeout(bootTimer);
      fail("The alpha could not start. " + (error && error.message ? error.message : String(error)));
      console.error(error);
    });
}

window.startYellowDoor = startYellowDoor;

try {
  startYellowDoor();
} catch (error) {
  fail("The alpha could not start. " + (error && error.message ? error.message : String(error)));
  console.error(error);
}