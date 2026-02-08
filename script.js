// Keep in top-level so inline onclick can call proceed()
(function () {
  const codeEl = document.getElementById("code");
  const terminal = document.getElementById("terminal");
  const hold = document.getElementById("hold");
  const proposal = document.getElementById("proposal");
  const holdBtn = document.getElementById("holdBtn");

  const codeLines = [
    "C:\\Users\\You> start love.html",
    "",
    "Initializing feelings...",
    "Loading memories...",
    "Compiling moments...",
    "Build successful ❤️",
  ];

  let line = 0;
  let ch = 0;

  function typeEffect() {
    if (line < codeLines.length) {
      if (ch < codeLines[line].length) {
        codeEl.textContent += codeLines[line][ch++];
        setTimeout(typeEffect, 36);
      } else {
        codeEl.textContent += "\n";
        line++;
        ch = 0;
        setTimeout(typeEffect, 320);
      }
    } else {
      setTimeout(() => {
        // hide terminal (no display:none)
        terminal.classList.remove("visible");
        terminal.classList.add("hidden");
        // show hold
        hold.classList.remove("hidden");
        hold.classList.add("visible");
      }, 700);
    }
  }
  // start typing on load
  window.addEventListener("load", typeEffect);

  // proceed is global and inline onclick uses it
  window.proceed = function proceed() {
    // immediately guard to prevent double taps
    if (!hold.classList.contains("visible")) return;

    // hide hold, show proposal (no display:none used)
    hold.classList.remove("visible");
    hold.classList.add("hidden");
    proposal.classList.remove("hidden");
    proposal.classList.add("visible");

    // play music (mobile requires user interaction; we have it)
    const music = document.getElementById("bgMusic");
    try { music.volume = 0.4; music.play(); } catch (e) { /* ignore */ }

    // generate hearts using CSS animation
    const heartInterval = setInterval(() => {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent = Math.random() > 0.5 ? "💗" : "💜";

      // randomize start position and slight rotation
      const left = Math.floor(Math.random() * 90) + 2; // 2vw..92vw
      heart.style.left = left + "vw";
      heart.style.bottom = "-10px";
      heart.style.transform = `rotate(${Math.random()*40-20}deg)`;

      document.body.appendChild(heart);

      // remove after animation duration (approx 4.2s)
      setTimeout(() => {
        heart.remove();
      }, 4200);
    }, 320);

    // stop creating hearts after some time to avoid clutter (optional)
    setTimeout(() => clearInterval(heartInterval), 12000);
  };

  // Add a safe JS fallback listener too (shouldn't hurt)
  window.addEventListener("DOMContentLoaded", () => {
    if (holdBtn) {
      holdBtn.addEventListener("click", () => { /* inline proceed covers it */ });
      holdBtn.addEventListener("touchstart", () => { /* inline proceed covers it */ });
    }
  });
})();
