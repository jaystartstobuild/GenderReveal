/**
 * Dreamy Background Ambient Particles
 * Abundant, slow-falling watercolor sakura & rose petals with gentle wind sway,
 * twinkling stars, and interactive touch/cursor sparkles.
 */

class DreamyBackground {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.petals = [];
    this.sparkles = [];
    this.mouse = { x: null, y: null };
    this.numPetals = 60; // Abundant petals
    this.numStars = 40;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse events
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (Math.random() > 0.45) {
        this.addSparkleTrail(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Touch events for iPhone & mobile
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.addSparkleTrail(this.mouse.x, this.mouse.y);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        if (Math.random() > 0.4) {
          this.addSparkleTrail(this.mouse.x, this.mouse.y);
        }
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    }, { passive: true });

    // 1. Ambient Twinkling Stars & Bokeh
    const starColors = [
      'rgba(248, 187, 208, 0.55)', // Soft Pink
      'rgba(187, 222, 251, 0.55)', // Sky Blue
      'rgba(212, 175, 55, 0.65)',  // Gold Star
      'rgba(255, 249, 196, 0.7)'   // Warm Sunlight
    ];

    for (let i = 0; i < this.numStars; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3.5 + 1.5,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.25 - 0.05,
        twinkleSpeed: Math.random() * 0.025 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        isStar: Math.random() > 0.4
      });
    }

    // 2. Abundant, Slow-Falling Flower Petals (Pink, Soft Rosy, Sky Blue, White-Gold)
    const petalColors = [
      'rgba(248, 187, 208, 0.82)', // Classic Pastel Pink
      'rgba(244, 143, 177, 0.75)', // Rose Petal
      'rgba(252, 228, 236, 0.88)', // Light Blush Pink
      'rgba(187, 222, 251, 0.8)',  // Baby Blue Petal
      'rgba(144, 202, 249, 0.72)', // Soft Sky Blue
      'rgba(255, 253, 245, 0.85)'  // White Ivory Petal with Gold Rim
    ];

    for (let i = 0; i < this.numPetals; i++) {
      this.petals.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 7 + 6, // 6px to 13px petal size
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        goldEdge: Math.random() > 0.65,
        // VERY SLOW FALL SPEED (Dreamy Floating Drift)
        vy: Math.random() * 0.35 + 0.15,
        swaySpeed: Math.random() * 0.018 + 0.008,
        swayAmplitude: Math.random() * 1.8 + 0.8,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }

    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addSparkleTrail(x, y) {
    this.sparkles.push({
      x: x + (Math.random() - 0.5) * 24,
      y: y + (Math.random() - 0.5) * 24,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? '#f48fb1' : (Math.random() > 0.5 ? '#90caf9' : '#d4af37'),
      alpha: 1,
      decay: Math.random() * 0.025 + 0.015,
      vy: -Math.random() * 0.8 - 0.3
    });
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius, color, alpha) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.angle);

    // 3D tumble flip scale effect
    const flipScale = Math.sin(p.flipAngle);
    this.ctx.scale(1, Math.max(0.15, Math.abs(flipScale)));

    this.ctx.fillStyle = p.color;

    // Organic teardrop petal path
    this.ctx.beginPath();
    this.ctx.moveTo(0, -p.size);
    this.ctx.bezierCurveTo(p.size * 0.85, -p.size * 0.5, p.size * 0.75, p.size * 0.6, 0, p.size);
    this.ctx.bezierCurveTo(-p.size * 0.75, p.size * 0.6, -p.size * 0.85, -p.size * 0.5, 0, -p.size);
    this.ctx.closePath();
    this.ctx.fill();

    if (p.goldEdge) {
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Animate Stars & Sparkles
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.twinklePhase += p.twinkleSpeed;

      if (p.y < -10) {
        p.y = this.canvas.height + 10;
        p.x = Math.random() * this.canvas.width;
      }
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;

      const alpha = 0.25 + 0.65 * Math.sin(p.twinklePhase);

      if (p.isStar) {
        this.drawStar(p.x, p.y, 4, p.size * 1.5, p.size * 0.5, p.color, Math.max(0.1, alpha));
      } else {
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0.1, alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    // 2. Animate Slow Falling Petals
    for (let pt of this.petals) {
      pt.phase += pt.swaySpeed;
      pt.x += Math.sin(pt.phase) * pt.swayAmplitude;
      pt.y += pt.vy; // Gentle slow fall
      pt.angle += pt.rotationSpeed;
      pt.flipAngle += pt.flipSpeed;

      // Soft mouse / touch interaction (petals gently float away from touch)
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = pt.x - this.mouse.x;
        const dy = pt.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          pt.x += (dx / dist) * 1.5;
          pt.y += (dy / dist) * 1.2;
        }
      }

      // Recycle petals back to top when reaching bottom
      if (pt.y > this.canvas.height + 25) {
        pt.y = -20;
        pt.x = Math.random() * this.canvas.width;
      }
      if (pt.x > this.canvas.width + 25) pt.x = -20;
      if (pt.x < -25) pt.x = this.canvas.width + 25;

      this.drawPetal(pt);
    }

    // 3. Animate Interactive Sparkles
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.y += sp.vy;
      sp.alpha -= sp.decay;

      if (sp.alpha <= 0) {
        this.sparkles.splice(i, 1);
        continue;
      }

      this.drawStar(sp.x, sp.y, 4, sp.size, sp.size * 0.4, sp.color, sp.alpha);
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DreamyBackground();
});
