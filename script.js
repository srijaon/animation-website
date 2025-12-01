const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
const galaxyCanvas = document.getElementById("galaxy-canvas");
const galaxyCtx = galaxyCanvas.getContext("2d");
const audio = document.getElementById("galaxy-music");

function setSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  galaxyCanvas.width = window.innerWidth;
  galaxyCanvas.height = window.innerHeight;
}
setSize();
window.addEventListener("resize", setSize);

// Galaxy stars array
let stars = [];

function createStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * galaxyCanvas.width,
      y: Math.random() * galaxyCanvas.height,
      radius: Math.random() * 1.5,
      opacity: Math.random() * 0.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      twinkle: Math.random() * Math.PI * 2
    });
  }
}

createStars();

function drawGalaxy() {
  galaxyCtx.fillStyle = "rgba(10, 10, 30, 0.1)";
  galaxyCtx.fillRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

  stars.forEach(star => {
    // Update position
    star.x += star.vx;
    star.y += star.vy;

    // Wrap around edges
    if (star.x < 0) star.x = galaxyCanvas.width;
    if (star.x > galaxyCanvas.width) star.x = 0;
    if (star.y < 0) star.y = galaxyCanvas.height;
    if (star.y > galaxyCanvas.height) star.y = 0;

    // Twinkling effect
    star.twinkle += 0.02;
    const twinkleOpacity = Math.abs(Math.sin(star.twinkle)) * 0.5 + 0.5;

    // Draw star
    galaxyCtx.fillStyle = `rgba(200, 150, 255, ${star.opacity * twinkleOpacity})`;
    galaxyCtx.beginPath();
    galaxyCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    galaxyCtx.fill();

    // Add glow
    galaxyCtx.strokeStyle = `rgba(150, 100, 255, ${star.opacity * twinkleOpacity * 0.3})`;
    galaxyCtx.lineWidth = 2;
    galaxyCtx.beginPath();
    galaxyCtx.arc(star.x, star.y, star.radius + 2, 0, Math.PI * 2);
    galaxyCtx.stroke();
  });
}

// Animate galaxy continuously
function animateGalaxy() {
  drawGalaxy();
  requestAnimationFrame(animateGalaxy);
}

// Control music and galaxy based on scroll position
gsap.registerPlugin(ScrollTrigger);

let isOnFirstPage = true;

ScrollTrigger.create({
  trigger: "#page",
  onUpdate: (self) => {
    const progress = self.progress;
    
    // Show galaxy only on first page
    if (progress < 0.35) {
      isOnFirstPage = true;
      galaxyCanvas.classList.add("active");
      audio.play().catch(() => {
        // Autoplay might be blocked by browser
      });
    } else {
      isOnFirstPage = false;
      galaxyCanvas.classList.remove("active");
      audio.pause();
    }
  }
});

animateGalaxy();

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
