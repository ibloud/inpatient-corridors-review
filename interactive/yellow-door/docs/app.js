let story = null;
let started = false;
let bootTimer = null;
let musicIndex = 0;

const musicEncounters = [
  {title:"So The Story Goes...", id:"u1qtyMPokZM", prompt:"The first image opens the door. Stay with it."},
  {title:"CTRL ALT DELETE", id:"X--PXyB1Zw0", prompt:"The corridor changes when the frame changes. What do you follow?"},
  {title:"Truth or Dare", id:"FmaBhsRfhIw", prompt:"A question arrives before an answer. Keep watching."},
  {title:"Dream Life", id:"0HhRNbZ0wRY", prompt:"The room turns inward. Notice what the story makes visible."},
  {title:"Two's On A Cigarette", id:"1WCfWxgEY8E", prompt:"Two voices share the frame. Listen for the handoff."},
  {title:"Pink Heineken", id:"Ra8gSw7Djvo", prompt:"The final room in this thread. Nothing here tells you what to believe."}
];

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

function renderMusicEncounter() {
  const encounter = musicEncounters[musicIndex];
  storyContainer.innerHTML = "";
  choicesContainer.innerHTML = "";
  errorContainer.hidden = true;

  const wrap = document.createElement("section");
  wrap.className = "video-encounter";
  wrap.setAttribute("aria-labelledby", "video-encounter-title");

  const kicker = document.createElement("p");
  kicker.className = "music-kicker";
  kicker.textContent = "YELLOW DOOR · VIDEO ENCOUNTER " + (musicIndex + 1) + " OF " + musicEncounters.length;

  const heading = document.createElement("h2");
  heading.id = "video-encounter-title";
  heading.textContent = encounter.title;

  const note = document.createElement("p");
  note.className = "encounter-note";
  note.textContent = encounter.prompt;

  const frame = document.createElement("div");
  frame.className = "video-frame";
  frame.innerHTML =
    '<iframe title="' + encounter.title.replace(/"/g, "&quot;") +
    '" src="https://www.youtube-nocookie.com/embed/' + encounter.id +
    '?rel=0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';

  const source = document.createElement("p");
  source.className = "encounter-source";
  source.textContent = "Source: the public SICK SICK SOUL playlist on YouTube. The Yellow Door presents the video as an external work; it does not claim ownership or artist participation in this experience.";

  wrap.appendChild(kicker);
  wrap.appendChild(heading);
  wrap.appendChild(note);
  wrap.appendChild(frame);
  wrap.appendChild(source);
  storyContainer.appendChild(wrap);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice";
  button.textContent = musicIndex === musicEncounters.length - 1
    ? "Leave the screen and enter the corridor"
    : "Continue through the Yellow Door";
  button.addEventListener("click", function () {
    musicIndex += 1;
    if (musicIndex < musicEncounters.length) {
      renderMusicEncounter();
      window.scrollTo({top:0, behavior:"smooth"});
    } else {
      startInkStory();
    }
  });
  choicesContainer.appendChild(button);
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

function startInkStory() {
  storyContainer.innerHTML = "";
  choicesContainer.innerHTML = "";
  errorContainer.hidden = false;
  errorContainer.textContent = "The six encounters are complete. Opening the corridor…";

  fetch("../story/yellow-door-alpha.json?v=20260926-1", {cache: "no-store"})
    .then(function (response) {
      if (!response.ok) throw new Error("Compiled story returned HTTP " + response.status);
      return response.text();
    })
    .then(function (raw) {
      story = new window.inkjs.Story(raw.replace(/^\uFEFF/, ""));
      storyContainer.innerHTML = "";
      continueStory(false);
      started = true;
      errorContainer.hidden = true;
      window.scrollTo({top:0, behavior:"smooth"});
    })
    .catch(function (error) {
      fail("The corridor could not open. " + (error && error.message ? error.message : String(error)));
      console.error(error);
    });
}

function startYellowDoor() {
  if (!window.inkjs || typeof window.inkjs.Story !== "function") {
    fail("Runtime error: The local Ink runtime did not expose inkjs.Story.");
    return;
  }

  if (bootTimer) window.clearTimeout(bootTimer);
  bootTimer = window.setTimeout(function () {
    if (!started) fail("The Yellow Door is taking too long to start. Try Reload, or open this page with ?debug=1.");
  }, 8000);

  renderMusicEncounter();
}

window.startYellowDoor = startYellowDoor;

try {
  startYellowDoor();
} catch (error) {
  fail("The alpha could not start. " + (error && error.message ? error.message : String(error)));
  console.error(error);
}