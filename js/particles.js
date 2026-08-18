/**
 * Dreamy Background Ambient Particles
 * Ultra-slow, highly randomized watercolor blossom & rose petals drifting weightlessly,
 * with multi-axis 3D fluttering, organic wind currents, and golden sparkles.
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
    this.numPetals = 65; // Abundant, diverse petals
    this.numStars = 35;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse interactive events
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (Math.random() > 0.5) {
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
        if (Math.random() > 0.45) {
          this.addSparkleTrail(this.mouse.x, this.mouse.y);
        }
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    }, { passive: true });

    // 1. Ambient Twinkling Stars
    const starColors = [
      'rgba(248, 187, 208, 0.5)',
      'rgba(187, 222, 251, 0.5)',
      'rgba(212, 175, 55, 0.6)',
      'rgba(255, 249, 196, 0.65)'
    ];

    for (let i = 0; i < this.numStars; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1.2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.2 - 0.04,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        isStar: Math.random() > 0.4
      });
    }

    // 2. Randomized, Ultra-Slow Drifting Petals (Pink, Blue, and Cream #fef5eb)
    const petalPalette = [
      'rgba(248, 187, 208, 0.85)', // Soft Rose Quartz
      'rgba(244, 143, 177, 0.78)', // Warm Blush
      'rgba(255, 209, 220, 0.9)',  // Pure Pastel Pink
      'rgba(187, 222, 251, 0.85)', // Baby Sky Blue
      'rgba(207, 232, 255, 0.88)', // Pastel Powder Blue
      'rgba(225, 245, 254, 0.85)', // Pale Ice Blue
      'rgba(254, 245, 235, 0.92)'  // Cream Porcelain #fef5eb
    ];

    const shapes = ['sakura', 'rose', 'oval', 'mini'];

    for (let i = 0; i < this.numPetals; i++) {
      this.petals.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 8 + 5, // 5px to 13px varied size
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: petalPalette[Math.floor(Math.random() * petalPalette.length)],
        goldEdge: Math.random() > 0.6,
        
        // ULTRA-SLOW GENTLE FLOAT
        vy: Math.random() * 0.18 + 0.07,
        vxBase: (Math.random() - 0.5) * 0.12,

        // Compound Natural Sway
        swaySpeed1: Math.random() * 0.012 + 0.005,
        swayAmp1: Math.random() * 2.2 + 0.8,
        swaySpeed2: Math.random() * 0.02 + 0.008,
        swayAmp2: Math.random() * 1.2 + 0.4,
        phase1: Math.random() * Math.PI * 2,
        phase2: Math.random() * Math.PI * 2,

        // 3D Tumbling & Flutter
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        flipAngleX: Math.random() * Math.PI * 2,
        flipSpeedX: Math.random() * 0.015 + 0.006,
        flipAngleY: Math.random() * Math.PI * 2,
        flipSpeedY: Math.random() * 0.018 + 0.007
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
      x: x + (Math.random() - 0.5) * 22,
      y: y + (Math.random() - 0.5) * 22,
      size: Math.random() * 3.5 + 1.5,
      color: Math.random() > 0.5 ? '#f48fb1' : (Math.random() > 0.5 ? '#90caf9' : '#d4af37'),
      alpha: 1,
      decay: Math.random() * 0.025 + 0.015,
      vy: -Math.random() * 0.6 - 0.2
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

    // Multi-axis 3D scale flip for organic tumbling
    const scaleX = Math.cos(p.flipAngleX);
    const scaleY = Math.sin(p.flipAngleY);
    this.ctx.scale(
      Math.max(0.15, Math.abs(scaleX)),
      Math.max(0.15, Math.abs(scaleY))
    );

    this.ctx.fillStyle = p.color;

    this.ctx.beginPath();
    const s = p.size;

    if (p.shape === 'sakura') {
      // Notched Sakura Petal
      this.ctx.moveTo(0, -s);
      this.ctx.bezierCurveTo(s * 0.8, -s * 0.6, s * 0.8, s * 0.3, 0, s);
      this.ctx.bezierCurveTo(-s * 0.8, s * 0.3, -s * 0.8, -s * 0.6, 0, -s);
    } else if (p.shape === 'rose') {
      // Rounded Rose Petal
      this.ctx.moveTo(0, -s * 0.8);
      this.ctx.bezierCurveTo(s * 0.9, -s * 0.4, s * 0.9, s * 0.7, 0, s);
      this.ctx.bezierCurveTo(-s * 0.9, s * 0.7, -s * 0.9, -s * 0.4, 0, -s * 0.8);
    } else if (p.shape === 'oval') {
      // Delicate Elongated Petal
      this.ctx.ellipse(0, 0, s * 0.5, s, 0, 0, Math.PI * 2);
    } else {
      // Mini Blossom Bud
      this.ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2);
    }

    this.ctx.closePath();
    this.ctx.fill();

    if (p.goldEdge) {
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      this.ctx.lineWidth = 0.75;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Twinkling Ambient Stars
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

      const alpha = 0.2 + 0.6 * Math.sin(p.twinklePhase);

      if (p.isStar) {
        this.drawStar(p.x, p.y, 4, p.size * 1.5, p.size * 0.5, p.color, Math.max(0.08, alpha));
      } else {
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0.08, alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    // 2. Slow, Highly Randomized Falling Petals
    for (let pt of this.petals) {
      pt.phase1 += pt.swaySpeed1;
      pt.phase2 += pt.swaySpeed2;

      // Compound organic drift
      const sway = Math.sin(pt.phase1) * pt.swayAmp1 + Math.cos(pt.phase2) * pt.swayAmp2;
      pt.x += pt.vxBase + sway * 0.35;
      pt.y += pt.vy; // Ultra-slow fall
      pt.angle += pt.rotationSpeed;
      pt.flipAngleX += pt.flipSpeedX;
      pt.flipAngleY += pt.flipSpeedY;

      // Gentle touch / cursor avoidance
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = pt.x - this.mouse.x;
        const dy = pt.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          pt.x += (dx / dist) * 1.1;
          pt.y += (dy / dist) * 0.8;
        }
      }

      // Recycle petals back to top smoothly
      if (pt.y > this.canvas.height + 25) {
        pt.y = -20;
        pt.x = Math.random() * this.canvas.width;
      }
      if (pt.x > this.canvas.width + 25) pt.x = -20;
      if (pt.x < -25) pt.x = this.canvas.width + 25;

      this.drawPetal(pt);
    }

    // 3. Interactive Sparkles
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
