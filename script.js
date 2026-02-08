document.addEventListener("DOMContentLoaded", () => {

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
  let char = 0;

  function typeEffect() {
    if (line < codeLines.length) {
      if (char < codeLines[line].length) {
        codeEl.textContent += codeLines[line][char];
        char++;
        setTimeout(typeEffect, 40);
      } else {
        codeEl.textContent += "\n";
        line++;
        char = 0;
        setTimeout(typeEffect, 400);
      }
    } else {
      setTimeout(() => {
        terminal.style.display = "none";
        hold.classList.remove("hidden");
      }, 800);
    }
  }

  typeEffect();

  function proceed() {
    hold.classList.add("hidden");
    proposal.classList.remove("hidden");

    const music = document.getElementById("bgMusic");
    music.volume = 0.4;
    music.play().catch(() => {});

    setInterval(() => {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent = Math.random() > 0.5 ? "💗" : "💜";
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.bottom = "-20px";
      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 4000);
    }, 300);
  }

  // ✅ SUPPORT BOTH TAP TYPES
  holdBtn.addEventListener("click", proceed);
  holdBtn.addEventListener("touchstart", proceed);

});
