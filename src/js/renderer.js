/**
 * Studio Canvas Renderer & Visualizer
 * Renders the high-definition video frame with atmospheric particles,
 * background videos/images, typography, and glowing Quranic text.
 */

export class VideoRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Video Dimensions
    this.aspectRatio = '9:16'; // '9:16', '16:9', '1:1'
    this.width = 1080;
    this.height = 1920;
    this.updateDimensions();

    // Visual Settings
    this.settings = {
      theme: 'emerald-gold', // 'emerald-gold', 'midnight-blue', 'velvet-black', 'pure-gold', 'nature'
      bgType: 'particles', // 'particles', 'gradient', 'video', 'image'
      bgMediaElement: null, // HTMLVideoElement or HTMLImageElement
      fontFamily: 'Amiri Quran, serif',
      fontSize: 48,
      showTranslation: true,
      showSurahHeader: true,
      showReciterName: true,
      showAyahNumberBadge: true,
      textGlow: true,
      glowColor: 'rgba(212, 175, 55, 0.4)', // Gold
      textColor: '#FFFFFF',
      highlightColor: '#F5D77F',
      overlayOpacity: 0.45,
      animationSpeed: 1.0,
      visualizerType: 'wave' // 'wave', 'bars', 'none'
    };

    // Particles system for luxury atmospheric movement
    this.particles = [];
    this.initParticles(75);

    // Current render state
    this.state = {
      surahName: "الفاتحة",
      surahEnglish: "Al-Fatihah",
      reciterName: "مشاري راشد العفاسي",
      currentVerse: null,
      verseIndex: 0,
      totalVerses: 7,
      audioProgress: 0,
      time: 0
    };

    this.isRendering = false;
    this.animationFrameId = null;
  }

  setAspectRatio(ratio) {
    this.aspectRatio = ratio;
    this.updateDimensions();
  }

  updateDimensions() {
    if (this.aspectRatio === '9:16') {
      this.width = 1080;
      this.height = 1920;
    } else if (this.aspectRatio === '16:9') {
      this.width = 1920;
      this.height = 1080;
    } else if (this.aspectRatio === '1:1') {
      this.width = 1080;
      this.height = 1080;
    }
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  initParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2, // float upwards gently
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
  }

  startRenderLoop() {
    if (this.isRendering) return;
    this.isRendering = true;

    const loop = (timestamp) => {
      this.state.time = timestamp * 0.001;
      this.renderFrame();
      if (this.isRendering) {
        this.animationFrameId = requestAnimationFrame(loop);
      }
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stopRenderLoop() {
    this.isRendering = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  renderFrame() {
    const { ctx, width, height, settings, state } = this;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background
    this.drawBackground(ctx, width, height, settings);

    // 2. Draw Atmospheric Particles
    if (settings.bgType === 'particles' || settings.bgType === 'gradient' || settings.bgType === 'video') {
      this.drawParticles(ctx, width, height, state.time);
    }

    // 3. Draw Dark Overlay for readability
    ctx.fillStyle = `rgba(5, 12, 10, ${settings.overlayOpacity})`;
    ctx.fillRect(0, 0, width, height);

    // 4. Draw Islamic Frame / Ornamental Accents
    this.drawOrnamentalAccents(ctx, width, height);

    // 5. Draw Header (Surah name, Bismillah if appropriate)
    if (settings.showSurahHeader) {
      this.drawSurahHeader(ctx, width, height, state);
    }

    // 6. Draw Main Ayah Content (Uthmani Typography)
    this.drawAyahContent(ctx, width, height, state, settings);

    // 7. Draw Footer / Reciter Branding
    if (settings.showReciterName) {
      this.drawFooter(ctx, width, height, state, settings);
    }

    // 8. Draw Audio Visualizer Wave
    if (settings.visualizerType !== 'none') {
      this.drawVisualizer(ctx, width, height, state);
    }
  }

  drawBackground(ctx, width, height, settings) {
    if (settings.bgType === 'video' && settings.bgMediaElement && settings.bgMediaElement.readyState >= 2) {
      const v = settings.bgMediaElement;
      // Object-fit: cover logic
      const hRatio = width / v.videoWidth;
      const vRatio = height / v.videoHeight;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (width - v.videoWidth * ratio) / 2;
      const centerShiftY = (height - v.videoHeight * ratio) / 2;
      ctx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight, centerShiftX, centerShiftY, v.videoWidth * ratio, v.videoHeight * ratio);
      return;
    }

    if (settings.bgType === 'image' && settings.bgMediaElement) {
      const img = settings.bgMediaElement;
      const hRatio = width / (img.naturalWidth || width);
      const vRatio = height / (img.naturalHeight || height);
      const ratio = Math.max(hRatio, vRatio);
      const w = (img.naturalWidth || width) * ratio;
      const h = (img.naturalHeight || height) * ratio;
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      return;
    }

    // Gradient Themes
    let grad = ctx.createLinearGradient(0, 0, width, height);
    if (settings.theme === 'emerald-gold') {
      grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.8);
      grad.addColorStop(0, '#0d281e');
      grad.addColorStop(0.5, '#051811');
      grad.addColorStop(1, '#020b08');
    } else if (settings.theme === 'midnight-blue') {
      grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.8);
      grad.addColorStop(0, '#0e1e38');
      grad.addColorStop(0.6, '#060d1a');
      grad.addColorStop(1, '#02050a');
    } else if (settings.theme === 'velvet-black') {
      grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.8);
      grad.addColorStop(0, '#1c1c24');
      grad.addColorStop(0.6, '#0f0f14');
      grad.addColorStop(1, '#050508');
    } else {
      grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.8);
      grad.addColorStop(0, '#1e1b12');
      grad.addColorStop(0.6, '#120f08');
      grad.addColorStop(1, '#050402');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  drawParticles(ctx, width, height, time) {
    ctx.save();
    for (const p of this.particles) {
      p.y += p.vy;
      p.x += p.vx + Math.sin(time + p.pulseOffset) * 0.2;

      // Wrap around
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 2 + p.pulseOffset));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 206, 122, ${alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.fill();
    }
    ctx.restore();
  }

  drawOrnamentalAccents(ctx, width, height) {
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 1.5;

    const margin = this.aspectRatio === '9:16' ? 40 : 30;
    
    // Top-left corner ornament
    ctx.beginPath();
    ctx.moveTo(margin, margin + 40);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + 40, margin);
    ctx.stroke();

    // Top-right corner ornament
    ctx.beginPath();
    ctx.moveTo(width - margin - 40, margin);
    ctx.lineTo(width - margin, margin);
    ctx.lineTo(width - margin, margin + 40);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(margin, height - margin - 40);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(margin + 40, height - margin);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - margin - 40, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.lineTo(width - margin, height - margin - 40);
    ctx.stroke();

    ctx.restore();
  }

  drawSurahHeader(ctx, width, height, state) {
    ctx.save();
    const topY = this.aspectRatio === '9:16' ? 140 : 100;

    // Surah Badge Box
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';

    // Surah Arabic Name
    ctx.font = `bold ${this.aspectRatio === '9:16' ? '44px' : '36px'} 'Scheherazade New', 'Amiri Quran', serif`;
    ctx.fillStyle = '#D4AF37'; // Gold
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
    ctx.fillText(`سُورَةُ ${state.surahName}`, width / 2, topY);

    // English subtitle
    ctx.font = `500 ${this.aspectRatio === '9:16' ? '20px' : '18px'} 'Outfit', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.shadowBlur = 0;
    ctx.fillText(`Surah ${state.surahEnglish}`, width / 2, topY + 36);

    // Decorative underline with gold diamond
    const lineW = 160;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - lineW / 2, topY + 54);
    ctx.lineTo(width / 2 + lineW / 2, topY + 54);
    ctx.stroke();

    // Tiny Center Diamond
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(width / 2, topY + 54, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawAyahContent(ctx, width, height, state, settings) {
    const verse = state.currentVerse;
    if (!verse) return;

    ctx.save();
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';

    const centerY = this.aspectRatio === '9:16' ? height * 0.46 : height * 0.44;
    const maxTextWidth = this.aspectRatio === '9:16' ? width * 0.86 : width * 0.78;
    
    // User-controlled font size from the slider
    const fontSize = parseInt(settings.fontSize) || 48;

    ctx.font = `600 ${fontSize}px ${settings.fontFamily}`;
    
    // Glowing text effect
    if (settings.textGlow) {
      ctx.shadowBlur = 24;
      ctx.shadowColor = settings.glowColor;
    }
    ctx.fillStyle = settings.highlightColor;

    // Convert Arabic numeral for Ayah End Symbol ﴿١﴾
    const arabicNumber = this.toArabicNumerals(verse.ayahNumber);
    const fullText = `${verse.textUthmani} ﴿${arabicNumber}﴾`;

    // Wrap Arabic lines nicely
    const lines = this.wrapText(ctx, fullText, maxTextWidth);
    const lineHeight = fontSize * 1.85;
    const totalBlockHeight = lines.length * lineHeight;
    let startY = centerY - (totalBlockHeight / 2) + (fontSize * 0.6);

    lines.forEach((line) => {
      ctx.fillText(line, width / 2, startY);
      startY += lineHeight;
    });

    // Draw Translation if enabled
    if (settings.showTranslation && verse.textTranslation) {
      ctx.restore();
      ctx.save();
      ctx.direction = 'ltr';
      ctx.textAlign = 'center';
      
      const transFontSize = Math.max(18, Math.min(32, Math.round(fontSize * 0.48)));
      ctx.font = `500 ${transFontSize}px 'Outfit', 'Inter', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';

      const transLines = this.wrapText(ctx, verse.textTranslation, maxTextWidth * 0.95);
      const transLineHeight = transFontSize * 1.5;
      let transStartY = startY + 28;

      transLines.forEach((tLine) => {
        ctx.fillText(tLine, width / 2, transStartY);
        transStartY += transLineHeight;
      });
    }

    ctx.restore();
  }

  drawFooter(ctx, width, height, state, settings) {
    ctx.save();
    const bottomY = this.aspectRatio === '9:16' ? height - 120 : height - 80;

    // Reciter Info Badge
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';

    // Reciter Name
    ctx.font = `600 ${this.aspectRatio === '9:16' ? '26px' : '22px'} 'Scheherazade New', 'Amiri Quran', serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(`بصوت القارئ: ${state.reciterName}`, width / 2, bottomY);

    // Ayah Indicator Badge
    if (settings.showAyahNumberBadge && state.currentVerse) {
      const ayahBadgeY = bottomY + 36;
      ctx.font = `500 18px 'Outfit', sans-serif`;
      ctx.direction = 'ltr';
      ctx.fillStyle = '#D4AF37';
      ctx.fillText(`Ayah ${state.currentVerse.ayahNumber} of ${state.totalVerses}`, width / 2, ayahBadgeY);
    }

    ctx.restore();
  }

  drawVisualizer(ctx, width, height, state) {
    ctx.save();
    const vizY = this.aspectRatio === '9:16' ? height - 200 : height - 140;
    const vizWidth = this.aspectRatio === '9:16' ? width * 0.6 : width * 0.4;
    const startX = (width - vizWidth) / 2;

    const bars = 28;
    const barWidth = vizWidth / bars;
    const time = state.time * 4;

    ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';

    for (let i = 0; i < bars; i++) {
      const x = startX + i * barWidth;
      const normalizedIndex = (i / bars) * Math.PI;
      const baseHeight = Math.sin(normalizedIndex) * 20;
      const animatedHeight = baseHeight + Math.sin(time + i * 0.4) * 14 + Math.cos(time * 1.5 + i * 0.3) * 8;
      const barH = Math.max(4, Math.abs(animatedHeight));

      // Draw rounded miniature bars
      ctx.beginPath();
      ctx.roundRect(x + 2, vizY - barH / 2, Math.max(2, barWidth - 4), barH, 2);
      ctx.fill();
    }

    ctx.restore();
  }

  wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  toArabicNumerals(num) {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w]);
  }
}
