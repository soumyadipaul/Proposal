/* ================= ELEMENTS ================= */

const codeEl = document.getElementById("code");
const terminal = document.getElementById("terminal");
const hold = document.getElementById("hold");
const proposal = document.getElementById("proposal");
const holdBtn = document.getElementById("holdBtn");
const music = document.getElementById("bgMusic");

/* ================= TERMINAL TYPE EFFECT ================= */

const lines = [
  "C:\\Users\\You> start love.exe",
  "",
  "Initializing feelings...",
  "Loading memories...",
  "Compiling moments...",
  "Build successful ❤️"
];

let line = 0;
let char = 0;

function typeCode() {
  if (line < lines.length) {
    if (char < lines[line].length) {
      codeEl.textContent += lines[line][char++];
      setTimeout(typeCode, 35);
    } else {
      codeEl.textContent += "\n";
      line++;
      char = 0;
      setTimeout(typeCode, 300);
    }
  } else {
    setTimeout(() => {
      terminal.classList.replace("visible", "hidden");
      hold.classList.replace("hidden", "visible");
    }, 600);
  }
}

window.addEventListener("load", typeCode);

/* ================= AUDIO (HARD UNLOCK) ================= */

/*
  Browsers REQUIRE a simple tap/click activation.
  Press-and-hold alone is NOT enough.
*/

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  try {
    music.volume = 0;
    music.loop = true;

    const p = music.play();
    if (p !== undefined) {
      p.then(() => {
        music.pause();
        music.currentTime = 0;
        audioUnlocked = true;
      }).catch(() => {});
    }
  } catch {}
}

/* ================= PRESS & HOLD ================= */

let holdTimer = null;
let holding = false;

function startHold() {
  if (holding) return;
  holding = true;
  holdBtn.classList.add("holding");

  holdTimer = setTimeout(() => {
    revealProposal();
  }, 1600);
}

function cancelHold() {
  holding = false;
  holdBtn.classList.remove("holding");
  clearTimeout(holdTimer);
}

/* ================= EVENTS ================= */

/*
  🔑 THIS is the key:
  - click = audio unlock (guaranteed)
  - pointerdown = visual hold logic
*/

holdBtn.addEventListener("click", unlockAudio, { once: true });

holdBtn.addEventListener("pointerdown", () => {
  unlockAudio();     // safety
  startHold();
});

holdBtn.addEventListener("pointerup", cancelHold);
holdBtn.addEventListener("pointerleave", cancelHold);
holdBtn.addEventListener("touchcancel", cancelHold);

/* Prevent text selection WITHOUT breaking activation */
holdBtn.style.userSelect = "none";
holdBtn.addEventListener("selectstart", e => e.preventDefault());

/* ================= FINAL REVEAL ================= */

function revealProposal() {
  hold.classList.replace("visible", "hidden");
  proposal.classList.replace("hidden", "visible");

  // Play music audibly now
  music.currentTime = 0;
  music.volume = 0.4;
  music.play().catch(() => {});

  startHearts();
}

/* ================= FLOATING HEARTS ================= */

function startHearts() {
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = Math.random() > 0.5 ? "💗" : "💜";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = (4 + Math.random() * 3) + "s";

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
  }, 250);
}
