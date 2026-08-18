/**
 * Pink & Blue Gender Reveal Confetti System
 */

class ConfettiManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationFrame = null;
    this.colors = [
      '#F48FB1', '#F06292', '#F8BBD0', '#FF80AB', // Pinks
      '#90CAF9', '#64B5F6', '#BBDEFB', '#82B1FF', // Blues
      '#FFD700', '#F5D77F', '#FFF0B3', '#D4AF37'  // Gold accents
    ];
  }

  init() {
    if (this.canvas) return;
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confetti-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 120) {
    this.init();
    const shapes = ['circle', 'rect', 'star', 'heart'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed - Math.random() * 6 - 3,
        size: Math.random() * 8 + 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        color: color,
        shape: shape,
        alpha: 1,
        gravity: 0.22,
        drag: 0.96,
        decay: Math.random() * 0.008 + 0.005
      });
    }

    if (!this.animationFrame) {
      this.animate();
    }
  }

  doubleBurst() {
    this.init();
    // Burst from left (pink dominant) and right (blue dominant)
    setTimeout(() => this.burst(window.innerWidth * 0.25, window.innerHeight * 0.6, 80), 0);
    setTimeout(() => this.burst(window.innerWidth * 0.75, window.innerHeight * 0.6, 80), 200);
    setTimeout(() => this.burst(window.innerWidth * 0.5, window.innerHeight * 0.4, 100), 400);
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

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
  }

  drawHeart(x, y, size) {
    const s = size / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + s / 4);
    this.ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s / 2);
    this.ctx.bezierCurveTo(x - s, y + (s * 3) / 4, x, y + s, x, y + s * 1.25);
    this.ctx.bezierCurveTo(x, y + s, x + s, y + (s * 3) / 4, x + s, y + s / 2);
    this.ctx.bezierCurveTo(x + s, y, x, y, x, y + s / 4);
    this.ctx.closePath();
    this.ctx.fill();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === 'star') {
        this.drawStar(0, 0, 5, p.size, p.size / 2);
      } else if (p.shape === 'heart') {
        this.drawHeart(0, 0, p.size);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.animationFrame = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

window.confettiManager = new ConfettiManager();
