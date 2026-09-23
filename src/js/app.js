/**
 * Quran Video Studio - Main Application Controller
 */

import { SURAHS, RECITERS, TRANSLATION_LANGUAGES, fetchSurahVerses } from './api.js';
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
    this.currentReciterId = 7; // Alafasy default
    this.currentTranslationId = 20; // Saheeh Int. default
    this.fromAyah = 1;
    this.toAyah = 7;
    this.showTafsir = false;
    this.showTranslation = true;

    // Export Options
    this.exportResolution = '1080p';
    this.exportFps = 60;
    this.exportFormat = 'mp4';
    this.exportFade = true;

    this.initElements();
    this.initSurahsAndReciters();
    this.initEventListeners();
    this.loadSavedSettings();
    this.renderer.startRenderLoop();
    this.loadSurah(this.currentSurahNumber, this.fromAyah, this.toAyah, this.currentReciterId, this.currentTranslationId);
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

    // Style toggles & Subtext
    this.elToggleTafsir = document.getElementById('toggleTafsir');
    this.elToggleTranslation = document.getElementById('toggleTranslation');
    this.elTranslationLangSelect = document.getElementById('translationLangSelect');
    this.elToggleSurahHeader = document.getElementById('toggleSurahHeader');
    this.elToggleReciter = document.getElementById('toggleReciter');
    this.elFontSizeSlider = document.getElementById('fontSizeSlider');
    this.elFontSizeLabel = document.getElementById('fontSizeLabel');
    this.elFontOpacitySlider = document.getElementById('fontOpacitySlider');
    this.elFontOpacityLabel = document.getElementById('fontOpacityLabel');
    this.elTextPosSlider = document.getElementById('textPosSlider');
    this.elTextPosLabel = document.getElementById('textPosLabel');
    this.colorSwatches = document.querySelectorAll('.color-swatch');
    this.elCustomColorPicker = document.getElementById('customColorPicker');
    this.elBgUpload = document.getElementById('bgUpload');
    this.elSnapshotBtn = document.getElementById('snapshotBtn');

    // Preset Backup / Restore elements
    this.btnExportPreset = document.getElementById('btnExportPreset');
    this.presetImportFile = document.getElementById('presetImportFile');

    // Export Elements & Dialog
    this.elBtnExport = document.getElementById('btnExport');
    this.elExportModal = document.getElementById('exportModal');
    this.exportConfigStage = document.getElementById('exportConfigStage');
    this.exportProgressStage = document.getElementById('exportProgressStage');
    this.btnCloseExportModal = document.getElementById('btnCloseExportModal');
    this.btnStartRender = document.getElementById('btnStartRender');
    this.btnQuickAudioExport = document.getElementById('btnQuickAudioExport');
    this.btnQuickPosterExport = document.getElementById('btnQuickPosterExport');
    this.exportToggleFade = document.getElementById('exportToggleFade');
    this.exportResBtns = document.querySelectorAll('[data-res]');
    this.exportFpsBtns = document.querySelectorAll('[data-fps]');
    this.exportFormatBtns = document.querySelectorAll('[data-format]');
    this.elExportProgress = document.getElementById('exportProgress');
    this.elExportStatus = document.getElementById('exportStatus');
    this.elExportSubtext = document.getElementById('exportSubtext');
    this.elBtnCloseExport = document.getElementById('btnCloseExport');
  }

  saveSettings() {
    try {
      const preset = {
        fontSize: this.renderer.settings.fontSize,
        fontOpacity: this.renderer.settings.fontOpacity,
        textPosY: this.renderer.settings.textPosY,
        highlightColor: this.renderer.settings.highlightColor,
        glowColor: this.renderer.settings.glowColor,
        theme: this.renderer.settings.theme,
        aspectRatio: this.renderer.aspectRatio,
        showTafsir: this.showTafsir,
        showTranslation: this.showTranslation,
        translationId: this.currentTranslationId,
        exportResolution: this.exportResolution,
        exportFps: this.exportFps,
        exportFormat: this.exportFormat,
        exportFade: this.exportFade,
        showSurahHeader: this.renderer.settings.showSurahHeader,
        showReciterName: this.renderer.settings.showReciterName,
        currentReciterId: this.currentReciterId
      };
      localStorage.setItem('quran_studio_preset', JSON.stringify(preset));
    } catch (e) {
      console.warn('Could not save settings to localStorage:', e);
    }
  }

  loadSavedSettings() {
    try {
      const saved = localStorage.getItem('quran_studio_preset');
      if (saved) {
        const preset = JSON.parse(saved);
        this.applyPreset(preset);
      }
    } catch (e) {
      console.warn('Could not load settings from localStorage:', e);
    }
  }

  applyPreset(preset) {
    if (!preset) return;

    if (preset.fontSize) {
      this.elFontSizeSlider.value = preset.fontSize;
      if (this.elFontSizeLabel) this.elFontSizeLabel.textContent = `${preset.fontSize}px`;
      this.renderer.updateSettings({ fontSize: preset.fontSize });
    }

    if (preset.fontOpacity !== undefined) {
      const pct = Math.round(preset.fontOpacity * 100);
      this.elFontOpacitySlider.value = pct;
      if (this.elFontOpacityLabel) this.elFontOpacityLabel.textContent = `${pct}%`;
      this.renderer.updateSettings({ fontOpacity: preset.fontOpacity });
    }

    if (preset.textPosY !== undefined) {
      this.elTextPosSlider.value = preset.textPosY;
      if (this.elTextPosLabel) this.elTextPosLabel.textContent = `${preset.textPosY}%`;
      this.renderer.updateSettings({ textPosY: preset.textPosY });
    }

    if (preset.highlightColor) {
      this.renderer.updateSettings({
        highlightColor: preset.highlightColor,
        glowColor: preset.glowColor || `${preset.highlightColor}80`
      });
      if (this.elCustomColorPicker) this.elCustomColorPicker.value = preset.highlightColor;
      this.colorSwatches.forEach(s => {
        s.classList.toggle('active', s.dataset.color === preset.highlightColor);
      });
    }

    if (preset.aspectRatio) {
      this.aspectBtns.forEach(btn => {
        const active = btn.dataset.ratio === preset.aspectRatio;
        btn.classList.toggle('active', active);
      });
      this.renderer.setAspectRatio(preset.aspectRatio);
      this.canvasContainer.className = 'canvas-container';
      this.canvasContainer.classList.add(`ratio-${preset.aspectRatio.replace(':', '-')}`);
    }

    if (preset.theme) {
      this.themeCards.forEach(card => {
        card.classList.toggle('active', card.dataset.theme === preset.theme);
      });
      this.renderer.updateSettings({ theme: preset.theme });
    }

    if (preset.showTafsir !== undefined) {
      this.showTafsir = !!preset.showTafsir;
      if (this.elToggleTafsir) this.elToggleTafsir.checked = this.showTafsir;
      this.renderer.updateSettings({ showTafsir: this.showTafsir });
    }

    if (preset.showTranslation !== undefined) {
      this.showTranslation = !!preset.showTranslation;
      if (this.elToggleTranslation) this.elToggleTranslation.checked = this.showTranslation;
      this.renderer.updateSettings({ showTranslation: this.showTranslation });
    }

    if (preset.translationId) {
      this.currentTranslationId = parseInt(preset.translationId);
      if (this.elTranslationLangSelect) this.elTranslationLangSelect.value = this.currentTranslationId;
    }

    if (preset.exportResolution) {
      this.exportResolution = preset.exportResolution;
      this.exportResBtns.forEach(b => b.classList.toggle('active', b.dataset.res === preset.exportResolution));
    }

    if (preset.exportFps) {
      this.exportFps = parseInt(preset.exportFps);
      this.exportFpsBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.fps) === this.exportFps));
    }

    if (preset.exportFormat) {
      this.exportFormat = preset.exportFormat;
      this.exportFormatBtns.forEach(b => b.classList.toggle('active', b.dataset.format === preset.exportFormat));
    }

    if (preset.exportFade !== undefined) {
      this.exportFade = !!preset.exportFade;
      if (this.exportToggleFade) this.exportToggleFade.checked = this.exportFade;
    }

    if (preset.showSurahHeader !== undefined) {
      if (this.elToggleSurahHeader) this.elToggleSurahHeader.checked = !!preset.showSurahHeader;
      this.renderer.updateSettings({ showSurahHeader: !!preset.showSurahHeader });
    }

    if (preset.showReciterName !== undefined) {
      if (this.elToggleReciter) this.elToggleReciter.checked = !!preset.showReciterName;
      this.renderer.updateSettings({ showReciterName: !!preset.showReciterName });
    }

    if (preset.currentReciterId) {
      this.currentReciterId = parseInt(preset.currentReciterId);
      if (this.elReciterSelect) this.elReciterSelect.value = preset.currentReciterId;
    }

    if (this.surahData) {
      this.renderPlaylist(this.surahData.verses);
    }
  }

  exportPresetFile() {
    const preset = {
      app: 'Quran Video Studio',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      fontSize: this.renderer.settings.fontSize,
      fontOpacity: this.renderer.settings.fontOpacity,
      textPosY: this.renderer.settings.textPosY,
      highlightColor: this.renderer.settings.highlightColor,
      glowColor: this.renderer.settings.glowColor,
      theme: this.renderer.settings.theme,
      aspectRatio: this.renderer.aspectRatio,
      showTafsir: this.showTafsir,
      showTranslation: this.showTranslation,
      translationId: this.currentTranslationId,
      exportResolution: this.exportResolution,
      exportFps: this.exportFps,
      exportFormat: this.exportFormat,
      exportFade: this.exportFade,
      showSurahHeader: this.renderer.settings.showSurahHeader,
      showReciterName: this.renderer.settings.showReciterName,
      currentReciterId: this.currentReciterId
    };

    const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quran_Studio_Preset_${this.renderer.settings.theme}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  importPresetFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const preset = JSON.parse(e.target.result);
        this.applyPreset(preset);
        this.saveSettings();
        alert('تم استيراد وتطبيق القالب بنجاح! ✨');
      } catch (err) {
        alert('عذراً، ملف القالب غير صالح.');
      }
    };
    reader.readAsText(file);
  }

  initSurahsAndReciters() {
    // Populate Surahs
    this.elSurahSelect.innerHTML = SURAHS.map(s => 
      `<option value="${s.number}">${s.number}. سورة ${s.name} (${s.englishName}) - ${s.versesCount} آيات</option>`
    ).join('');

    // Populate Reciters
    this.elReciterSelect.innerHTML = RECITERS.map(r => 
      `<option value="${r.id}">${r.name} (${r.englishName}) - ${r.style}</option>`
    ).join('');

    // Populate Translation Languages
    if (this.elTranslationLangSelect) {
      this.elTranslationLangSelect.innerHTML = TRANSLATION_LANGUAGES.map(t => 
        `<option value="${t.id}" ${t.id === this.currentTranslationId ? 'selected' : ''}>${t.name}</option>`
      ).join('');
    }
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
        this.loadSurah(this.currentSurahNumber, 1, this.elToAyah.value, this.currentReciterId, this.currentTranslationId);
      }
    });

    // Reciter Selection Change
    this.elReciterSelect.addEventListener('change', (e) => {
      this.currentReciterId = parseInt(e.target.value);
      this.loadSurah(this.currentSurahNumber, this.elFromAyah.value, this.elToAyah.value, this.currentReciterId, this.currentTranslationId);
    });

    // Translation Language Change
    if (this.elTranslationLangSelect) {
      this.elTranslationLangSelect.addEventListener('change', (e) => {
        this.currentTranslationId = parseInt(e.target.value);
        this.loadSurah(this.currentSurahNumber, this.elFromAyah.value, this.elToAyah.value, this.currentReciterId, this.currentTranslationId);
        this.saveSettings();
      });
    }

    // Ayah Range Change
    const handleRangeChange = () => {
      let from = parseInt(this.elFromAyah.value) || 1;
      let to = parseInt(this.elToAyah.value) || 1;
      if (from > to) from = to;
      this.loadSurah(this.currentSurahNumber, from, to, this.currentReciterId, this.currentTranslationId);
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

    // Toggle Tafsir
    if (this.elToggleTafsir) {
      this.elToggleTafsir.addEventListener('change', (e) => {
        this.showTafsir = e.target.checked;
        this.renderer.updateSettings({ showTafsir: this.showTafsir });
        if (this.surahData) this.renderPlaylist(this.surahData.verses);
        this.saveSettings();
      });
    }

    // Toggle Translation
    if (this.elToggleTranslation) {
      this.elToggleTranslation.addEventListener('change', (e) => {
        this.showTranslation = e.target.checked;
        this.renderer.updateSettings({ showTranslation: this.showTranslation });
        if (this.surahData) this.renderPlaylist(this.surahData.verses);
        this.saveSettings();
      });
    }

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

    // Font Opacity (شفافية الخط)
    this.elFontOpacitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      if (this.elFontOpacityLabel) {
        this.elFontOpacityLabel.textContent = `${val}%`;
      }
      this.renderer.updateSettings({ fontOpacity: val / 100 });
    });

    // Snapshot Poster Button
    if (this.elSnapshotBtn) {
      this.elSnapshotBtn.addEventListener('click', () => {
        const verseNum = this.renderer.state.currentVerse?.ayahNumber || 1;
        const surahName = this.surahData?.surah?.englishName || 'Surah';
        this.renderer.takeSnapshot(`Quran_${surahName}_Ayah_${verseNum}.png`);
      });
    }

    // Text Vertical Position (رفع / تنزيل)
    this.elTextPosSlider.addEventListener('input', (e) => {
      const pos = parseInt(e.target.value);
      if (this.elTextPosLabel) {
        this.elTextPosLabel.textContent = `${pos}%`;
      }
      this.renderer.updateSettings({ textPosY: pos });
    });

    // Font Color Palette Selection
    this.colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        this.colorSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        const color = swatch.dataset.color;
        const glow = swatch.dataset.glow;
        this.renderer.updateSettings({
          highlightColor: color,
          glowColor: glow
        });
        if (this.elCustomColorPicker) {
          this.elCustomColorPicker.value = color;
        }
      });
    });

    // Preset Export / Import Listeners
    if (this.btnExportPreset) {
      this.btnExportPreset.addEventListener('click', () => this.exportPresetFile());
    }
    if (this.presetImportFile) {
      this.presetImportFile.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.importPresetFile(e.target.files[0]);
        }
      });
    }

    // Auto-save on settings changes
    const triggerAutoSave = () => this.saveSettings();
    this.elFontSizeSlider.addEventListener('change', triggerAutoSave);
    this.elFontOpacitySlider.addEventListener('change', triggerAutoSave);
    this.elTextPosSlider.addEventListener('change', triggerAutoSave);
    if (this.elCustomColorPicker) this.elCustomColorPicker.addEventListener('change', triggerAutoSave);
    this.colorSwatches.forEach(s => s.addEventListener('click', triggerAutoSave));
    this.themeCards.forEach(c => c.addEventListener('click', triggerAutoSave));
    this.aspectBtns.forEach(b => b.addEventListener('click', triggerAutoSave));
    this.elToggleSurahHeader.addEventListener('change', triggerAutoSave);
    this.elToggleReciter.addEventListener('change', triggerAutoSave);
    this.elReciterSelect.addEventListener('change', triggerAutoSave);

    // Export Options UI Listeners
    this.exportResBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.exportResBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.exportResolution = btn.dataset.res;
        this.saveSettings();
      });
    });

    this.exportFpsBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.exportFpsBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.exportFps = parseInt(btn.dataset.fps);
        this.saveSettings();
      });
    });

    this.exportFormatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.exportFormatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.exportFormat = btn.dataset.format;
        this.saveSettings();
      });
    });

    if (this.exportToggleFade) {
      this.exportToggleFade.addEventListener('change', (e) => {
        this.exportFade = e.target.checked;
        this.saveSettings();
      });
    }

    // Open Export Options Modal
    this.elBtnExport.addEventListener('click', () => {
      if (!this.surahData) return;
      this.exportConfigStage.style.display = 'flex';
      this.exportProgressStage.style.display = 'none';
      this.elExportModal.classList.add('active');
    });

    if (this.btnCloseExportModal) {
      this.btnCloseExportModal.addEventListener('click', () => {
        this.elExportModal.classList.remove('active');
      });
    }

    // Start Render
    if (this.btnStartRender) {
      this.btnStartRender.addEventListener('click', () => {
        this.startExportFlow();
      });
    }

    // Quick Audio MP3 Export
    if (this.btnQuickAudioExport) {
      this.btnQuickAudioExport.addEventListener('click', () => {
        if (!this.surahData) return;
        this.exporter.exportAudioOnly({ surahData: this.surahData });
      });
    }

    // Quick Poster PNG Export
    if (this.btnQuickPosterExport) {
      this.btnQuickPosterExport.addEventListener('click', () => {
        const verseNum = this.renderer.state.currentVerse?.ayahNumber || 1;
        const surahName = this.surahData?.surah?.englishName || 'Surah';
        this.renderer.takeSnapshot(`Quran_${surahName}_Ayah_${verseNum}.png`);
      });
    }

    // Player Controls
    this.elPlayBtn.addEventListener('click', () => this.player.togglePlay());
    this.elPrevBtn.addEventListener('click', () => this.player.prevVerse());
    this.elNextBtn.addEventListener('click', () => this.player.nextVerse());

    this.elProgressBar.addEventListener('click', (e) => {
      const rect = this.elProgressBar.getBoundingClientRect();
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

    this.elBtnCloseExport.addEventListener('click', () => {
      this.exporter.cancelExport();
      this.elExportModal.classList.remove('active');
    });
  }

  async loadSurah(surahNum, fromAyah, toAyah, reciterId, translationId = this.currentTranslationId) {
    try {
      this.elPlayBtn.disabled = true;
      this.elProgressFill.style.width = '0%';
      this.elTimeDisplay.textContent = 'جاري التحميل...';

      const data = await fetchSurahVerses(surahNum, fromAyah, toAyah, reciterId, translationId);
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
    this.elAyahList.innerHTML = verses.map((v, i) => {
      let extraBlocks = '';
      if (this.showTafsir && v.textTafsir) {
        extraBlocks += `<div class="ayah-item-trans" style="direction: rtl; text-align: right; color: #f3e5ab; font-family: var(--font-arabic-ui); font-size: 0.85rem; margin-top: 4px;">التفسير: ${v.textTafsir}</div>`;
      }
      if (this.showTranslation && v.textTranslation) {
        extraBlocks += `<div class="ayah-item-trans" style="margin-top: 4px;">${v.textTranslation}</div>`;
      }

      return `
        <div class="ayah-item ${i === 0 ? 'active' : ''}" data-index="${i}">
          <div class="ayah-item-header">
            <span>الآية ${v.ayahNumber}</span>
            <span style="font-family: var(--font-latin); font-size: 0.75rem; color: var(--text-muted);">${v.verseKey}</span>
          </div>
          <div class="ayah-item-text">${v.textUthmani}</div>
          ${extraBlocks}
        </div>
      `;
    }).join('');

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

    // Switch to progress view
    this.exportConfigStage.style.display = 'none';
    this.exportProgressStage.style.display = 'flex';

    this.elExportProgress.textContent = '0%';
    this.elExportProgress.classList.remove('done');
    this.elExportStatus.textContent = 'جاري تصدير المقطع...';
    this.elExportSubtext.textContent = `جاري تجهيز الإطارات بدقة ${this.exportResolution} وسلاسة ${this.exportFps} FPS`;
    this.elBtnCloseExport.textContent = 'إلغاء التصدير';

    try {
      const result = await this.exporter.exportVideo({
        surahData: this.surahData,
        options: {
          resolution: this.exportResolution,
          fps: this.exportFps,
          format: this.exportFormat,
          fade: this.exportFade
        },
        onProgress: ({ percent, currentAyah, totalAyahs }) => {
          this.elExportProgress.textContent = `${percent}%`;
          this.elExportSubtext.textContent = `معالجة الآية ${currentAyah} من ${totalAyahs}`;
        },
        onComplete: ({ url, extension }) => {
          this.elExportProgress.textContent = '100%';
          this.elExportProgress.classList.add('done');
          this.elExportStatus.textContent = 'تم إنشاء الفيديو بنجاح! 🎉';
          this.elExportSubtext.textContent = `تم إنشاء ملف ${extension.toUpperCase()} بدقة ${this.exportResolution} وبدء التنزيل`;
          this.elBtnCloseExport.textContent = 'إغلاق النافذة';

          // Trigger download
          const a = document.createElement('a');
          a.href = url;
          a.download = `Quran_${this.surahData.surah.englishName}_Ayah_${this.surahData.startAyah}_${this.surahData.endAyah}_${this.exportResolution}.${extension}`;
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
