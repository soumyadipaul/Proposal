/* FINAL ROBUST script.js
   - AudioContext + decoded buffer playback (gesture-safe)
   - Hold-to-reveal (1.6s)
   - Continuous floating hearts
   - Terminal typing effect
*/

const codeEl = document.getElementById("code");
const terminal = document.getElementById("terminal");
const hold = document.getElementById("hold");
const proposal = document.getElementById("proposal");
const holdBtn = document.getElementById("holdBtn");
const musicEl = document.getElementById("bgMusic"); // fallback element

/* ---------------- TERMINAL TYPE EFFECT ---------------- */
const lines = [
  "C:\\Users\\You> start love.exe",
  "",
  "Initializing feelings...",
  "Loading memories...",
  "Compiling moments...",
  "Build successful ❤️"
];

let line = 0;
let ch = 0;
function typeCode() {
  if (line < lines.length) {
    if (ch < lines[line].length) {
      codeEl.textContent += lines[line][ch++];
      setTimeout(typeCode, 35);
    } else {
      codeEl.textContent += "\n";
      line++;
      ch = 0;
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

/* ---------------- AUDIO (AudioContext + Buffer) ---------------- */
let audioCtx = null;
let audioBuffer = null;
let bufferSource = null;
let gainNode = null;
let audioSetupStarted = false;
const AUDIO_URL = "music.mp3"; // must be same-origin (your repo)

// Initialize AudioContext and start fetching/decoding the audio
function initAudioContextAndDecode() {
  if (audioSetupStarted) return;
  audioSetupStarted = true;

  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
    // Resume (important for some browsers)
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});

    // Fetch and decode the audio file (async)
    fetch(AUDIO_URL)
      .then((res) => res.arrayBuffer())
      .then((arrBuf) => {
        // decodeAudioData returns a promise in modern browsers
        return audioCtx.decodeAudioData(arrBuf);
      })
      .then((decoded) => {
        audioBuffer = decoded;
      })
      .catch(() => {
        // If decoding fails, we keep audioBuffer null so fallback will try <audio>.
        audioBuffer = null;
      });
  } catch (e) {
    // If AudioContext not supported or fails, fallback to <audio>
    audioCtx = null;
    audioBuffer = null;
  }
}

// Fade helper for WebAudio gain node
function fadeGainTo(targetVol = 0.4, duration = 1200) {
  if (!gainNode || !audioCtx) return;
  const now = audioCtx.currentTime;
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(gainNode.gain.value, now);
  gainNode.gain.linearRampToValueAtTime(targetVol, now + duration / 1000);
}

/* ---------------- PRESS & HOLD LOGIC ---------------- */
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

/* ---------------- EVENTS: gesture-safe unlocking ---------------- */
/* Use pointerdown to unlock/init audio but DO NOT preventDefault here */
holdBtn.addEventListener("pointerdown", () => {
  // Start the audio context & start fetching/decoding (gesture-safe)
  initAudioContextAndDecode();
  // Start the hold logic (we don't block the gesture)
  startHold();
});

/* Keep the touch/mouse event handlers that cancel selection/drag but do not block the gesture */
holdBtn.addEventListener("touchstart", (e) => e.preventDefault()); // prevents selection/drag
holdBtn.addEventListener("mousedown", (e) => e.preventDefault());

holdBtn.addEventListener("pointerup", cancelHold);
holdBtn.addEventListener("pointerleave", cancelHold);
holdBtn.addEventListener("touchcancel", cancelHold);

/* ---------------- FINAL REVEAL: play audio (buffer if ready) ---------------- */
function revealProposal() {
  // show/hide screens (no display:none)
  hold.classList.replace("visible", "hidden");
  proposal.classList.replace("hidden", "visible");

  // If audioBuffer is decoded and audioCtx present -> play via WebAudio (precise & reliable)
  if (audioCtx && audioBuffer) {
    try {
      // Create gain & bufferSource
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime); // start near 0

      bufferSource = audioCtx.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.loop = true;

      bufferSource.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      bufferSource.start(0);
      // Fade gain up to audible level
      fadeGainTo(0.4, 1000);
    } catch (e) {
      // fallback to HTMLAudio element
      tryPlayHtmlAudioFallback();
    }
  } else {
    // If not ready, fallback to HTMLAudio element - best-effort
    tryPlayHtmlAudioFallback();
  }

  // start hearts regardless
  startHearts();
}

// HTMLAudio fallback: best-effort play of the <audio> element
function tryPlayHtmlAudioFallback() {
  try {
    // try resetting to 0 so the start is heard if allowed
    try { musicEl.currentTime = 0; } catch {}
    musicEl.volume = 0.4;
    const p = musicEl.play();
    if (p && typeof p.then === "function") {
      p.catch(() => {
        // silent failure; nothing more we can do
      });
    }
  } catch (e) {
    // ignore
  }
}

/* ---------------- HEARTS ---------------- */
function startHearts() {
  // create an interval to spawn hearts continuously
  const iv = setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = Math.random() > 0.5 ? "💗" : "💜";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = (4 + Math.random() * 3) + "s";

    document.body.appendChild(heart);
    // remove when animation done
    setTimeout(() => heart.remove(), 9000);
  }, 250);

  // stop after 20s to avoid infinite DOM growth (optional)
  setTimeout(() => clearInterval(iv), 20000);
}
