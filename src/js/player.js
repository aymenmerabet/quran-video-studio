/**
 * Quran Audio & Sync Player Engine
 * Synchronizes audio playback with Ayah and Word timestamps
 */

export class QuranPlayer {
  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.audio.preload = "auto";

    this.currentSurahData = null;
    this.currentVerseIndex = 0;
    this.isPlaying = false;
    this.playbackMode = 'chapter'; // 'chapter' or 'sequential'

    // Web Audio API for Real-time Visualizer
    this.audioCtx = null;
    this.analyser = null;
    this.freqData = new Uint8Array(32);
    this.isAudioSourceConnected = false;
    
    this.onVerseChange = null;
    this.onTimeUpdate = null;
    this.onStateChange = null;
    this.onEnded = null;

    this.initAudioListeners();
  }

  initAudioContext() {
    if (this.audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

      if (!this.isAudioSourceConnected) {
        const source = this.audioCtx.createMediaElementSource(this.audio);
        source.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
        this.isAudioSourceConnected = true;
      }
    } catch (e) {
      console.warn('AudioContext notice:', e);
    }
  }

  getFrequencyData() {
    if (this.analyser && this.isPlaying) {
      this.analyser.getByteFrequencyData(this.freqData);
      return this.freqData;
    }
    return this.freqData;
  }

  initAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.handleTimeUpdate();
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (this.onStateChange) this.onStateChange({ isPlaying: true });
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false });
    });

    this.audio.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error, falling back if sequential:', e);
      if (this.playbackMode === 'chapter') {
        // Fallback to sequential EveryAyah audio
        this.fallbackToSequential();
      }
    });
  }

  loadData(surahData) {
    this.currentSurahData = surahData;
    this.currentVerseIndex = 0;
    this.pause();

    // Check if we have chapter audio and all verses have timings
    const hasFullTimings = surahData.chapterAudioUrl && 
      surahData.verses.every(v => v.timing && typeof v.timing.start === 'number');

    if (hasFullTimings) {
      this.playbackMode = 'chapter';
      this.audio.src = surahData.chapterAudioUrl;
      // Seek to the start of the first selected verse
      const firstVerse = surahData.verses[0];
      if (firstVerse && firstVerse.timing) {
        this.audio.currentTime = firstVerse.timing.start;
      }
    } else {
      this.playbackMode = 'sequential';
      if (surahData.verses.length > 0) {
        this.audio.src = surahData.verses[0].everyAyahUrl;
      }
    }

    if (this.onVerseChange) {
      this.onVerseChange(this.getCurrentVerse(), this.currentVerseIndex);
    }
  }

  fallbackToSequential() {
    this.playbackMode = 'sequential';
    const verse = this.getCurrentVerse();
    if (verse) {
      this.audio.src = verse.everyAyahUrl;
      this.play();
    }
  }

  handleTimeUpdate() {
    if (!this.currentSurahData) return;

    const currentTime = this.audio.currentTime;
    let duration = this.audio.duration || 0;
    let progress = 0;

    if (this.playbackMode === 'chapter') {
      const verses = this.currentSurahData.verses;
      const firstStart = verses[0]?.timing?.start || 0;
      const lastEnd = verses[verses.length - 1]?.timing?.end || duration;
      const totalRangeDuration = Math.max(0.1, lastEnd - firstStart);

      // Check if we exceeded the range of selected verses
      if (currentTime >= lastEnd) {
        this.pause();
        if (this.onEnded) this.onEnded();
        return;
      }

      // Find current verse by timing
      let activeIndex = verses.findIndex(v => v.timing && currentTime >= v.timing.start && currentTime < v.timing.end);
      if (activeIndex === -1) {
        if (currentTime < firstStart) activeIndex = 0;
        else activeIndex = verses.length - 1;
      }

      if (activeIndex !== this.currentVerseIndex) {
        this.currentVerseIndex = activeIndex;
        if (this.onVerseChange) {
          this.onVerseChange(verses[activeIndex], activeIndex);
        }
      }

      const elapsed = Math.max(0, currentTime - firstStart);
      progress = (elapsed / totalRangeDuration) * 100;

      if (this.onTimeUpdate) {
        this.onTimeUpdate({
          currentTime: elapsed,
          duration: totalRangeDuration,
          absoluteCurrentTime: currentTime,
          progress: Math.min(100, Math.max(0, progress)),
          currentVerse: verses[this.currentVerseIndex]
        });
      }
    } else {
      // Sequential mode
      const totalVerses = this.currentSurahData.verses.length;
      progress = ((this.currentVerseIndex + (currentTime / (duration || 1))) / totalVerses) * 100;

      if (this.onTimeUpdate) {
        this.onTimeUpdate({
          currentTime: currentTime,
          duration: duration,
          progress: Math.min(100, Math.max(0, progress)),
          currentVerse: this.getCurrentVerse()
        });
      }
    }
  }

  handleTrackEnded() {
    if (this.playbackMode === 'sequential') {
      if (this.currentVerseIndex < this.currentSurahData.verses.length - 1) {
        this.nextVerse();
        this.play();
      } else {
        this.isPlaying = false;
        if (this.onEnded) this.onEnded();
      }
    } else {
      this.isPlaying = false;
      if (this.onEnded) this.onEnded();
    }
  }

  async play() {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    try {
      await this.audio.play();
    } catch (e) {
      console.warn('Playback autoplay restriction or error:', e);
    }
  }

  pause() {
    this.audio.pause();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seekToVerse(index) {
    if (!this.currentSurahData || index < 0 || index >= this.currentSurahData.verses.length) return;
    this.currentVerseIndex = index;
    const verse = this.currentSurahData.verses[index];

    if (this.playbackMode === 'chapter' && verse.timing) {
      this.audio.currentTime = verse.timing.start + 0.05;
    } else {
      this.audio.src = verse.everyAyahUrl;
      this.audio.currentTime = 0;
    }

    if (this.onVerseChange) {
      this.onVerseChange(verse, index);
    }
    if (this.isPlaying) {
      this.play();
    }
  }

  nextVerse() {
    if (this.currentVerseIndex < (this.currentSurahData?.verses.length || 0) - 1) {
      this.seekToVerse(this.currentVerseIndex + 1);
    }
  }

  prevVerse() {
    if (this.currentVerseIndex > 0) {
      this.seekToVerse(this.currentVerseIndex - 1);
    }
  }

  seekPercentage(percent) {
    if (!this.currentSurahData) return;
    const clamped = Math.max(0, Math.min(1, percent));

    if (this.playbackMode === 'chapter') {
      const verses = this.currentSurahData.verses;
      const firstStart = verses[0]?.timing?.start || 0;
      const lastEnd = verses[verses.length - 1]?.timing?.end || this.audio.duration;
      const targetTime = firstStart + (lastEnd - firstStart) * clamped;
      this.audio.currentTime = targetTime;
    } else {
      const totalVerses = this.currentSurahData.verses.length;
      const targetVerseIndex = Math.min(totalVerses - 1, Math.floor(clamped * totalVerses));
      this.seekToVerse(targetVerseIndex);
    }
  }

  setVolume(val) {
    this.audio.volume = Math.max(0, Math.min(1, val));
  }

  setPlaybackRate(rate) {
    this.audio.playbackRate = rate;
  }

  getCurrentVerse() {
    return this.currentSurahData?.verses[this.currentVerseIndex] || null;
  }
}
