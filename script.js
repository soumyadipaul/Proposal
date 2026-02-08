const codeEl = document.getElementById("code");
const terminal = document.getElementById("terminal");
const hold = document.getElementById("hold");
const proposal = document.getElementById("proposal");
const holdBtn = document.getElementById("holdBtn");
const music = document.getElementById("bgMusic");

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

/* TERMINAL TYPE */
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

/* PRESS & HOLD LOGIC */
let holdTimer = null;
let holding = false;

function startHold(e) {
  e.preventDefault();
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

/* EVENTS */
holdBtn.addEventListener("touchstart", startHold);
holdBtn.addEventListener("touchend", cancelHold);
holdBtn.addEventListener("touchcancel", cancelHold);

holdBtn.addEventListener("mousedown", startHold);
holdBtn.addEventListener("mouseup", cancelHold);
holdBtn.addEventListener("mouseleave", cancelHold);

/* FINAL REVEAL */
function revealProposal() {
  hold.classList.replace("visible", "hidden");
  proposal.classList.replace("hidden", "visible");

  try {
    music.volume = 0.4;
    music.play();
  } catch {}

  startHearts();
}

/* CONTINUOUS HEARTS */
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
