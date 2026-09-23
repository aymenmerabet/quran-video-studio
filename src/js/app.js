/**
 * Quran Video Studio - Main Application Controller
 */

import { SURAHS, RECITERS, fetchSurahVerses } from './api.js';
import { QuranPlayer } from './player.js';
import { VideoRenderer } from './renderer.js';
import { VideoExporter } from './exporter.js';

class QuranStudioApp {
  constructor() {
    this.canvas = document.getElementById('videoCanvas');
    this.renderer = new VideoRenderer(this.canvas);
    this.player = new QuranPlayer();
    this.exporter = new VideoExporter(this.renderer, this.player);

    this.currentSurahNumber = 1;
    this.currentReciterId = 7; // Alafasy
    this.fromAyah = 1;
    this.toAyah = 7;
    this.surahData = null;

    this.initElements();
    this.initEventListeners();
    this.initSurahsAndReciters();
    this.renderer.startRenderLoop();
    this.loadSurah(1, 1, 7, 7);
  }

  initElements() {
    this.elSurahSelect = document.getElementById('surahSelect');
    this.elReciterSelect = document.getElementById('reciterSelect');
    this.elFromAyah = document.getElementById('fromAyah');
    this.elToAyah = document.getElementById('toAyah');
    this.elMaxAyahLabel = document.getElementById('maxAyahLabel');
    this.elAyahList = document.getElementById('ayahList');

    // Aspect buttons
    this.aspectBtns = document.querySelectorAll('.aspect-btn');
    this.canvasContainer = document.getElementById('canvasContainer');

    // Theme cards
    this.themeCards = document.querySelectorAll('.theme-card');

    // Controls
    this.elPlayBtn = document.getElementById('playBtn');
    this.elPrevBtn = document.getElementById('prevBtn');
    this.elNextBtn = document.getElementById('nextBtn');
    this.elProgressFill = document.getElementById('progressFill');
    this.elProgressBar = document.getElementById('progressBar');
    this.elTimeDisplay = document.getElementById('timeDisplay');

    // Style toggles
    this.elToggleTrans = document.getElementById('toggleTranslation');
    this.elToggleSurahHeader = document.getElementById('toggleSurahHeader');
    this.elToggleReciter = document.getElementById('toggleReciter');
    this.elFontSizeSlider = document.getElementById('fontSizeSlider');
    this.elFontSizeLabel = document.getElementById('fontSizeLabel');
    this.elBgUpload = document.getElementById('bgUpload');

    // Export elements
    this.elBtnExport = document.getElementById('btnExport');
    this.elExportModal = document.getElementById('exportModal');
    this.elExportProgress = document.getElementById('exportProgress');
    this.elExportStatus = document.getElementById('exportStatus');
    this.elExportSubtext = document.getElementById('exportSubtext');
    this.elBtnCloseExport = document.getElementById('btnCloseExport');
  }

  initSurahsAndReciters() {
    // Populate Surahs
    this.elSurahSelect.innerHTML = SURAHS.map(s => 
      `<option value="${s.number}">${s.number}. سورة ${s.name} (${s.englishName}) - ${s.versesCount} آيات</option>`
    ).join('');

    // Populate Reciters
    this.elReciterSelect.innerHTML = RECITERS.map(r => 
      `<option value="${r.id}">${r.name} (${r.englishName})</option>`
    ).join('');
  }

  initEventListeners() {
    // Surah Selection Change
    this.elSurahSelect.addEventListener('change', (e) => {
      this.currentSurahNumber = parseInt(e.target.value);
      const surah = SURAHS.find(s => s.number === this.currentSurahNumber);
      if (surah) {
        this.elFromAyah.value = 1;
        this.elToAyah.value = Math.min(7, surah.versesCount);
        this.elFromAyah.max = surah.versesCount;
        this.elToAyah.max = surah.versesCount;
        this.elMaxAyahLabel.textContent = `(من 1 إلى ${surah.versesCount})`;
        this.loadSurah(this.currentSurahNumber, 1, this.elToAyah.value, this.currentReciterId);
      }
    });

    // Reciter Selection Change
    this.elReciterSelect.addEventListener('change', (e) => {
      this.currentReciterId = parseInt(e.target.value);
      this.loadSurah(this.currentSurahNumber, this.elFromAyah.value, this.elToAyah.value, this.currentReciterId);
    });

    // Ayah Range Change
    const handleRangeChange = () => {
      let from = parseInt(this.elFromAyah.value) || 1;
      let to = parseInt(this.elToAyah.value) || 1;
      if (from > to) from = to;
      this.loadSurah(this.currentSurahNumber, from, to, this.currentReciterId);
    };

    this.elFromAyah.addEventListener('change', handleRangeChange);
    this.elToAyah.addEventListener('change', handleRangeChange);

    // Aspect Ratio Toggle
    this.aspectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.aspectBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const ratio = btn.dataset.ratio;
        this.renderer.setAspectRatio(ratio);

        this.canvasContainer.className = 'canvas-container';
        this.canvasContainer.classList.add(`ratio-${ratio.replace(':', '-')}`);
      });
    });

    // Theme Switcher
    this.themeCards.forEach(card => {
      card.addEventListener('click', () => {
        this.themeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const theme = card.dataset.theme;
        this.renderer.updateSettings({ theme, bgType: 'particles' });
      });
    });

    // Background File Upload (Video or Image)
    this.elBgUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = url;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.play();
        this.renderer.updateSettings({ bgType: 'video', bgMediaElement: video });
      } else if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          this.renderer.updateSettings({ bgType: 'image', bgMediaElement: img });
        };
      }
    });

    // Font and Overlay Toggles
    this.elToggleTrans.addEventListener('change', (e) => {
      this.renderer.updateSettings({ showTranslation: e.target.checked });
      // Toggle translation in the playlist as well
      const transItems = document.querySelectorAll('.ayah-item-trans');
      transItems.forEach(el => {
        el.style.display = e.target.checked ? 'block' : 'none';
      });
    });
    this.elToggleSurahHeader.addEventListener('change', (e) => {
      this.renderer.updateSettings({ showSurahHeader: e.target.checked });
    });
    this.elToggleReciter.addEventListener('change', (e) => {
      this.renderer.updateSettings({ showReciterName: e.target.checked });
    });
    this.elFontSizeSlider.addEventListener('input', (e) => {
      const size = parseInt(e.target.value);
      if (this.elFontSizeLabel) {
        this.elFontSizeLabel.textContent = `${size}px`;
      }
      this.renderer.updateSettings({ fontSize: size });
    });

    // Player Controls
    this.elPlayBtn.addEventListener('click', () => this.player.togglePlay());
    this.elPrevBtn.addEventListener('click', () => this.player.prevVerse());
    this.elNextBtn.addEventListener('click', () => this.player.nextVerse());

    this.elProgressBar.addEventListener('click', (e) => {
      const rect = this.elProgressBar.getBoundingClientRect();
      // Calculate percentage taking RTL into account
      const clickX = e.clientX - rect.left;
      const percent = clickX / rect.width;
      this.player.seekPercentage(percent);
    });

    // Player Events
    this.player.onStateChange = ({ isPlaying }) => {
      this.elPlayBtn.innerHTML = isPlaying ? 
        `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>` : 
        `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    };

    this.player.onVerseChange = (verse, index) => {
      this.renderer.updateState({
        currentVerse: verse,
        verseIndex: index
      });
      this.highlightActivePlaylistItem(index);
    };

    this.player.onTimeUpdate = ({ currentTime, duration, progress }) => {
      this.elProgressFill.style.width = `${progress}%`;
      const curM = Math.floor(currentTime / 60);
      const curS = Math.floor(currentTime % 60);
      const durM = Math.floor(duration / 60);
      const durS = Math.floor(duration % 60);
      this.elTimeDisplay.textContent = `${curM}:${curS < 10 ? '0' : ''}${curS} / ${durM}:${durS < 10 ? '0' : ''}${durS}`;
    };

    // Export Video Button
    this.elBtnExport.addEventListener('click', () => this.startExportFlow());
    this.elBtnCloseExport.addEventListener('click', () => {
      this.exporter.cancelExport();
      this.elExportModal.classList.remove('active');
    });
  }

  async loadSurah(surahNum, fromAyah, toAyah, reciterId) {
    try {
      this.elPlayBtn.disabled = true;
      this.elProgressFill.style.width = '0%';
      this.elTimeDisplay.textContent = 'جاري التحميل...';

      const data = await fetchSurahVerses(surahNum, fromAyah, toAyah, reciterId);
      this.surahData = data;

      this.renderer.updateState({
        surahName: data.surah.name,
        surahEnglish: data.surah.englishName,
        reciterName: data.reciter.name,
        totalVerses: data.surah.versesCount,
        currentVerse: data.verses[0],
        verseIndex: 0
      });

      this.renderPlaylist(data.verses);
      this.player.loadData(data);
      this.elPlayBtn.disabled = false;
      this.elTimeDisplay.textContent = '0:00 / 0:00';
    } catch (err) {
      console.error('Failed to load surah data:', err);
      this.elTimeDisplay.textContent = 'خطأ في التحميل';
      this.elPlayBtn.disabled = false;
    }
  }

  renderPlaylist(verses) {
    this.elAyahList.innerHTML = verses.map((v, i) => `
      <div class="ayah-item ${i === 0 ? 'active' : ''}" data-index="${i}">
        <div class="ayah-item-header">
          <span>الآية ${v.ayahNumber}</span>
          <span style="font-family: var(--font-latin); font-size: 0.75rem; color: var(--text-muted);">${v.verseKey}</span>
        </div>
        <div class="ayah-item-text">${v.textUthmani}</div>
        ${v.textTranslation ? `<div class="ayah-item-trans">${v.textTranslation}</div>` : ''}
      </div>
    `).join('');

    // Attach click events
    this.elAyahList.querySelectorAll('.ayah-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index);
        this.player.seekToVerse(idx);
      });
    });
  }

  highlightActivePlaylistItem(index) {
    const items = this.elAyahList.querySelectorAll('.ayah-item');
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  async startExportFlow() {
    if (!this.surahData) return;
    this.player.pause();

    this.elExportModal.classList.add('active');
    this.elExportProgress.textContent = '0%';
    this.elExportProgress.classList.remove('done');
    this.elExportStatus.textContent = 'جاري تصدير المقطع...';
    this.elExportSubtext.textContent = 'يتم الآن تجميع الإطارات والصوت في المتصفح مباشرة';
    this.elBtnCloseExport.textContent = 'إلغاء التصدير';

    try {
      const result = await this.exporter.exportVideo({
        surahData: this.surahData,
        onProgress: ({ percent, currentAyah, totalAyahs }) => {
          this.elExportProgress.textContent = `${percent}%`;
          this.elExportSubtext.textContent = `معالجة الآية ${currentAyah} من ${totalAyahs}`;
        },
        onComplete: ({ url, extension }) => {
          this.elExportProgress.textContent = '100%';
          this.elExportProgress.classList.add('done');
          this.elExportStatus.textContent = 'تم إنشاء الفيديو بنجاح! 🎉';
          this.elExportSubtext.textContent = 'تم بدء تنزيل ملف الفيديو إلى جهازك تلقائياً';
          this.elBtnCloseExport.textContent = 'إغلاق النافذة';

          // Trigger download
          const a = document.createElement('a');
          a.href = url;
          a.download = `Quran_${this.surahData.surah.englishName}_Ayah_${this.surahData.startAyah}_${this.surahData.endAyah}.${extension}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        onError: (err) => {
          this.elExportStatus.textContent = 'حدث خطأ أثناء التصدير';
          this.elExportSubtext.textContent = err.message || 'يرجى المحاولة مرة أخرى';
          this.elBtnCloseExport.textContent = 'إغلاق';
        }
      });
    } catch (err) {
      console.error('Export failed:', err);
    }
  }
}

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  window.app = new QuranStudioApp();
});
