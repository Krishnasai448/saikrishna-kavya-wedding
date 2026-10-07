/* ============================================================
   SAIKRISHNA & KAVYA — WEDDING INVITATION CONFIGURATION
   Edit only the values in this section when you personalize it.
   ============================================================ */
const CONFIG = {
  weddingDate: "2026-11-15T00:00:00+05:30",

  // Paste your published Google Form responder URL here.
  // Example: https://docs.google.com/forms/d/e/XXXXXXXX/viewform

};

const $ = (id) => document.getElementById(id);

// Smoothly open the invitation and start music if desired.
const openBtn = $("openInvitation");
if (openBtn) {
  openBtn.addEventListener("click", () => {
    const coupleSection = document.querySelector("#couple");
    if (coupleSection) {
      coupleSection.scrollIntoView({ behavior: "smooth" });
    }
    // Attempt to start music on first user gesture
    toggleMusic(true);
  });
}

// Wedding countdown — uses the wedding date supplied by the couple.
function updateCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const now = Date.now();
  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);
  diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);

  if ($("days")) $("days").textContent = String(days).padStart(2, "0");
  if ($("hours")) $("hours").textContent = String(hours).padStart(2, "0");
  if ($("minutes")) $("minutes").textContent = String(minutes).padStart(2, "0");
  if ($("seconds")) $("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Optional background music. Browsers require user interaction before audio can play.
const music = $("bgMusic");
const musicButton = $("musicButton");
const musicLabel = $("musicLabel");

function updateMusicUI(isPlaying) {
  if (!musicButton || !musicLabel) return;
  if (isPlaying) {
    musicButton.classList.add("playing");
    musicLabel.textContent = "Pause";
    musicButton.setAttribute("aria-label", "Pause background music");
  } else {
    musicButton.classList.remove("playing");
    musicLabel.textContent = "Music";
    musicButton.setAttribute("aria-label", "Play background music");
  }
}

async function toggleMusic(onlyPlay = false) {
  if (!music) return;
  try {
    if (music.paused) {
      await music.play();
      updateMusicUI(true);
    } else if (!onlyPlay) {
      music.pause();
      updateMusicUI(false);
    }
  } catch (error) {
    console.warn("Music playback error:", error);
    if (!onlyPlay) {
      updateMusicUI(false);
    }
  }
}

if (musicButton) {
  musicButton.addEventListener("click", () => toggleMusic(false));
}

if (music) {
  music.addEventListener("play", () => updateMusicUI(true));
  music.addEventListener("pause", () => updateMusicUI(false));
  music.addEventListener("ended", () => updateMusicUI(false));
  music.addEventListener("error", () => {
    console.warn("Could not load music file.");
    if (musicLabel) musicLabel.textContent = "Music";
  });
}

// Smart image fallback: if .jpg fails, try .jpeg (and vice versa)
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    if (this.dataset.fallbackTried) {
      this.style.display = "none";
      const galleryItem = this.closest(".gallery-item");
      if (galleryItem) {
        galleryItem.style.display = "none";
      }
      return;
    }
    this.dataset.fallbackTried = "true";
    if (this.src.endsWith(".jpg")) {
      this.src = this.src.replace(/\.jpg$/, ".jpeg");
    } else if (this.src.endsWith(".jpeg")) {
      this.src = this.src.replace(/\.jpeg$/, ".jpg");
    }
  });
});
