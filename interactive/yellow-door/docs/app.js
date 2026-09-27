let story = null;
let started = false;
let bootTimer = null;
let musicIndex = 0;

const musicEncounters = [
  {title:"So The Story Goes...", id:"u1qtyMPokZM", photo:"1790436948050_instaPV(1).jpg", prompt:"The first image opens the door. Stay with it."},
  {title:"CTRL ALT DELETE", id:"X--PXyB1Zw0", photo:"1790436959242_instaPV(1).jpg", prompt:"The corridor changes when the frame changes. What do you follow?"},
  {title:"Truth or Dare", id:"FmaBhsRfhIw", photo:"1790436969283_instaPV(1).jpg", prompt:"A question arrives before an answer. Keep watching."},
  {title:"Dream Life", id:"0HhRNbZ0wRY", photo:"1790436978374_instaPV(1).jpg", prompt:"The room turns inward. Notice what the story makes visible."},
  {title:"Two's On A Cigarette", id:"1WCfWxgEY8E", photo:"1790436982551_instaPV(1).jpg", prompt:"Two voices share the frame. Listen for the handoff."},
  {title:"Pink Heineken", id:"Ra8gSw7Djvo", photo:"1790436986574_instaPV(1).jpg", prompt:"The final room in this thread. Nothing here tells you what to believe."}
];
const musicLinks = [
  {label:"Apple Music", url:"https://music.apple.com/us/album/sick-sick-soul-vol-1-ep/1847428336"},
  {label:"Spotify", url:"https://open.spotify.com/album/0ISO7wkMwNnepo80je1udA"},
  {label:"YouTube", url:"https://www.youtube.com/playlist?list=PLHbj3Gti2ieMLX14MIy5xvV0GPYMciUvz"}
];

const storyContainer = document.getElementById("story");
const gameContainer = document.getElementById("game");
const choicesContainer = document.getElementById("choices");
const errorContainer = document.getElementById("error");
const stats = document.getElementById("stats");
const debug = new URLSearchParams(location.search).get("debug") === "1";

function scrollStoryToTop() {
  if (window.matchMedia("(max-width: 760px)").matches) {
    gameContainer.scrollIntoView({behavior:"smooth", block:"start"});
  } else {
    gameContainer.scrollTo({top:0, behavior:"smooth"});
  }
}

function scrollStoryToLatest(target) {
  if (!target) return;
  if (window.matchMedia("(max-width: 760px)").matches) {
    target.scrollIntoView({behavior:"smooth", block:"nearest"});
  } else {
    const distance = target.getBoundingClientRect().bottom - gameContainer.getBoundingClientRect().bottom;
    if (distance > 0) gameContainer.scrollBy({top:distance + 18, behavior:"smooth"});
  }
}

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

function addMusicLinks(parent) {
  const links = document.createElement("p");
  links.className = "encounter-links";
  musicLinks.forEach(function (item, index) {
    if (index) links.appendChild(document.createTextNode(" · "));
    const a = document.createElement("a");
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = item.label;
    links.appendChild(a);
  });
  parent.appendChild(links);
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
  kicker.textContent = "YELLOW DOOR · VISUAL ENCOUNTER " + (musicIndex + 1) + " OF " + musicEncounters.length;

  const heading = document.createElement("h2");
  heading.id = "video-encounter-title";
  heading.textContent = encounter.title;

  const note = document.createElement("p");
  note.className = "encounter-note";
  note.textContent = encounter.prompt;

  const photo = document.createElement("img");
  photo.className = "encounter-photo";
  photo.src = "images/" + encodeURIComponent(encounter.photo);
  photo.alt = "Photo from Ren's Instagram post, Oh we do like to be beside the sea side";
  photo.loading = "lazy";

  const source = document.createElement("p");
  source.className = "encounter-source";
  source.textContent = "Photo source: Ren's Instagram post, ‘Oh we do like to be beside the sea side.’ Post credits: @jakewiiliams, @spaaaacey, @chloeimbach. Presented as a credited, noncommercial demonstration under the project owner's fair-use claim; individual photo credits remain unmapped. This independent story does not claim artist participation.";

  wrap.appendChild(kicker);
  wrap.appendChild(heading);
  wrap.appendChild(note);
  wrap.appendChild(photo);
  wrap.appendChild(source);
  addMusicLinks(wrap);
  const watch = document.createElement("a");
  watch.href = "https://www.youtube.com/watch?v=" + encounter.id;
  watch.target = "_blank";
  watch.rel = "noopener noreferrer";
  watch.textContent = "Open this video on YouTube ↗";
  wrap.appendChild(watch);
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
      scrollStoryToTop();
    } else {
      startInkStory();
    }
  });
  choicesContainer.appendChild(button);
  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = "choice";
  skip.textContent = "Skip the visuals and enter the Ink story";
  skip.addEventListener("click", startInkStory);
  choicesContainer.appendChild(skip);
  started = true;
  if (bootTimer) {
    window.clearTimeout(bootTimer);
    bootTimer = null;
  }
}

function renderPromo() {
  storyContainer.innerHTML = "";
  choicesContainer.innerHTML = "";
  errorContainer.hidden = true;
  const section = document.createElement("section");
  section.className = "video-encounter";
  const title = document.createElement("h2");
  title.textContent = "Beyond the Yellow Door · optional listening";
  const note = document.createElement("p");
  note.textContent = "The story is complete. Explore this independent musical breadcrumb if you wish.";
  const photo = document.createElement("img");
  photo.className = "encounter-photo";
  photo.src = "images/" + encodeURIComponent("1790436993111_instaPV(1).jpg");
  photo.alt = "Photo from Ren's Instagram post, Oh we do like to be beside the sea side";
  const credit = document.createElement("p");
  credit.className = "encounter-source";
  credit.textContent = "Photo source: Ren's Instagram post, ‘Oh we do like to be beside the sea side.’ Post credits: @jakewiiliams, @spaaaacey, @chloeimbach. Credited, noncommercial demonstration under the project owner's fair-use claim; individual photo credits remain unmapped.";
  const frame = document.createElement("div");
  frame.className = "video-frame";
  const video = document.createElement("iframe");
  video.title = "So The Story Goes... on YouTube";
  video.src = "https://www.youtube-nocookie.com/embed/u1qtyMPokZM?rel=0";
  video.loading = "lazy";
  video.allow = "encrypted-media; picture-in-picture; web-share";
  video.allowFullscreen = true;
  frame.appendChild(video);
  section.appendChild(title);
  section.appendChild(note);
  section.appendChild(photo);
  section.appendChild(credit);
  section.appendChild(frame);
  addMusicLinks(section);
  const direct = document.createElement("p");
  const watch = document.createElement("a");
  watch.href = "https://www.youtube.com/watch?v=u1qtyMPokZM";
  watch.target = "_blank";
  watch.rel = "noopener noreferrer";
  watch.textContent = "If the video cannot play here, open it on YouTube ↗";
  direct.appendChild(watch);
  section.appendChild(direct);
  storyContainer.appendChild(section);
  scrollStoryToTop();
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
    const p = document.createElement("p");
    p.className = "story-line";
    p.textContent = "The story has ended.";
    storyContainer.appendChild(p);
  }

  if (choiceCount === 0) {
    const promo = document.createElement("button");
    promo.type = "button";
    promo.className = "choice";
    promo.textContent = "Open optional music and video page";
    promo.addEventListener("click", renderPromo);
    choicesContainer.appendChild(promo);
  }

  errorContainer.hidden = true;

  if (shouldScroll) {
    const target = choicesContainer.lastElementChild || storyContainer.lastElementChild;
    scrollStoryToLatest(target);
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
      scrollStoryToTop();
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
  started = false;
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
