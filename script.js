const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

// Music toggle function
function toggleMusic(audioId) {
  const audio = document.getElementById(audioId);
  const allAudios = document.querySelectorAll('audio');
  
  // Stop all other audio
  allAudios.forEach(a => {
    if (a.id !== audioId) {
      a.pause();
      a.currentTime = 0;
    }
  });
  
  // Toggle current audio
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
}

// Global music toggle
function toggleAllMusic() {
  const allAudios = document.querySelectorAll('audio');
  const btn = document.getElementById('global-music-btn');
  let allPaused = true;
  
  // Check if all are paused
  allAudios.forEach(a => {
    if (!a.paused) {
      allPaused = false;
    }
  });
  
  // Toggle all
  allAudios.forEach(a => {
    if (allPaused) {
      a.play();
    } else {
      a.pause();
    }
  });
  
  // Update button
  btn.textContent = allPaused ? '🔊' : '🔇';
}

function setSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setSize();
window.addEventListener("resize", setSize);

const frameCount = 301;
const images = [];
const imageSeq = i => `frames/male${String(i).padStart(4,"0")}.png`;

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = imageSeq(i);
  images.push(img);
}

let currentFrame = 0;

gsap.to({frame:0}, {
  frame: frameCount - 1,
  snap: "frame",
  scrollTrigger: {
    trigger: "#main",
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  onUpdate: function() {
    currentFrame = this.targets()[0].frame;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = images[currentFrame];
    if (img && img.complete) {
      
      const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;
      ctx.drawImage(img, x, y, w, h);
    }
  }
});
