/**
 * Dreamy Background Ambient Particles
 * Floating watercolor sparkles, drifting flower petals, twinkling stars, and pastel bokeh orbs
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
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      // Add interactive sparkle trail
      if (Math.random() > 0.4) {
        this.addSparkleTrail(e.clientX, e.clientY);
      }
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // 1. Ambient Floating Bokeh & Stars
    const colors = [
      'rgba(248, 187, 208, 0.45)', // Soft Pink
      'rgba(244, 143, 177, 0.35)', // Rosy Pink
      'rgba(187, 222, 251, 0.45)', // Baby Sky Blue
      'rgba(144, 202, 249, 0.35)', // Powder Blue
      'rgba(212, 175, 55, 0.45)',  // Champagne Gold
      'rgba(255, 249, 196, 0.55)'  // Warm Sunlight
    ];

    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        isStar: Math.random() > 0.5
      });
    }

    // 2. Drifting Soft Petals (Pink & Blue)
    for (let i = 0; i < 22; i++) {
      this.petals.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 8 + 6,
        color: Math.random() > 0.5 ? 'rgba(248, 187, 208, 0.65)' : 'rgba(187, 222, 251, 0.65)',
        goldEdge: Math.random() > 0.7,
        vy: Math.random() * 0.7 + 0.3,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAmplitude: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
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
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? '#f48fb1' : (Math.random() > 0.5 ? '#90caf9' : '#d4af37'),
      alpha: 1,
      decay: Math.random() * 0.03 + 0.02,
      vy: -Math.random() * 1 - 0.5
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
    this.ctx.fillStyle = p.color;

    this.ctx.beginPath();
    this.ctx.moveTo(0, -p.size);
    this.ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
    this.ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
    this.ctx.closePath();
    this.ctx.fill();

    if (p.goldEdge) {
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Animate Ambient Dust & Twinkle Stars
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.twinklePhase += p.twinkleSpeed;

      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += (dx / dist) * 1.2;
          p.y += (dy / dist) * 1.2;
        }
      }

      if (p.y < -10) {
        p.y = this.canvas.height + 10;
        p.x = Math.random() * this.canvas.width;
      }
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;

      const alpha = 0.25 + 0.65 * Math.sin(p.twinklePhase);

      if (p.isStar) {
        this.drawStar(p.x, p.y, 4, p.size * 1.6, p.size * 0.5, p.color, Math.max(0.1, alpha));
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

    // 2. Animate Drifting Petals
    for (let pt of this.petals) {
      pt.phase += pt.swaySpeed;
      pt.x += Math.sin(pt.phase) * pt.swayAmplitude;
      pt.y += pt.vy;
      pt.angle += pt.rotationSpeed;

      if (pt.y > this.canvas.height + 20) {
        pt.y = -20;
        pt.x = Math.random() * this.canvas.width;
      }
      if (pt.x > this.canvas.width + 20) pt.x = -20;
      if (pt.x < -20) pt.x = this.canvas.width + 20;

      this.drawPetal(pt);
    }

    // 3. Animate Sparkle Trails
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
