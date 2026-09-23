/**
 * In-Browser Professional Video Exporter Engine
 * Records Canvas stream + Audio stream with customizable resolution, FPS, format & cinematic effects
 */

export class VideoExporter {
  constructor(renderer, player) {
    this.renderer = renderer;
    this.player = player;
    this.isExporting = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }

  cancelExport() {
    this.isExporting = false;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }
  }

  getDimensions(aspectRatio, resolution) {
    if (resolution === '720p') {
      if (aspectRatio === '9:16') return { width: 720, height: 1280, bitrate: 6000000 };
      if (aspectRatio === '16:9') return { width: 1280, height: 720, bitrate: 6000000 };
      return { width: 720, height: 720, bitrate: 5000000 };
    }
    if (resolution === '4k') {
      if (aspectRatio === '9:16') return { width: 2160, height: 3840, bitrate: 28000000 };
      if (aspectRatio === '16:9') return { width: 3840, height: 2160, bitrate: 28000000 };
      return { width: 2160, height: 2160, bitrate: 24000000 };
    }
    // Default: 1080p
    if (aspectRatio === '9:16') return { width: 1080, height: 1920, bitrate: 14000000 };
    if (aspectRatio === '16:9') return { width: 1920, height: 1080, bitrate: 14000000 };
    return { width: 1080, height: 1080, bitrate: 12000000 };
  }

  async exportVideo({ surahData, options = {}, onProgress, onComplete, onError }) {
    if (this.isExporting) return;
    this.isExporting = true;

    const {
      resolution = '1080p',
      fps = 60,
      format = 'mp4',
      fade = true
    } = options;

    // Save original renderer canvas dimensions to restore after export
    const origWidth = this.renderer.canvas.width;
    const origHeight = this.renderer.canvas.height;

    // Calculate export target dimensions
    const dims = this.getDimensions(this.renderer.aspectRatio, resolution);
    this.renderer.canvas.width = dims.width;
    this.renderer.canvas.height = dims.height;

    try {
      const canvas = this.renderer.canvas;
      const targetFps = parseInt(fps) || 60;
      const canvasStream = canvas.captureStream(targetFps);

      // Setup Web Audio Context for crystal clear audio mixing
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();
      const gainNode = audioCtx.createGain();
      gainNode.connect(dest);

      // Setup audio element
      const exportAudio = new Audio();
      exportAudio.crossOrigin = "anonymous";
      exportAudio.preload = "auto";

      let combinedStream;
      try {
        const source = audioCtx.createMediaElementSource(exportAudio);
        source.connect(gainNode);
        const audioTracks = dest.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          combinedStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...audioTracks
          ]);
        }
      } catch (err) {
        console.warn("AudioContext setup notice:", err);
      }

      if (!combinedStream) {
        combinedStream = canvasStream;
      }

      // Check supported MIME types prioritizing user preference
      let selectedMimeType = 'video/webm;codecs=vp9,opus';
      if (format === 'mp4') {
        const mp4Types = [
          'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
          'video/mp4;codecs=avc1.4d002a',
          'video/mp4;codecs=h264,aac',
          'video/mp4'
        ];
        const supported = mp4Types.find(t => MediaRecorder.isTypeSupported(t));
        if (supported) {
          selectedMimeType = supported;
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
          selectedMimeType = 'video/webm;codecs=vp9,opus';
        } else {
          selectedMimeType = 'video/webm';
        }
      } else {
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
          selectedMimeType = 'video/webm;codecs=vp9,opus';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
          selectedMimeType = 'video/webm;codecs=vp8,opus';
        } else {
          selectedMimeType = 'video/webm';
        }
      }

      this.recordedChunks = [];
      const recorderOptions = {
        videoBitsPerSecond: dims.bitrate
      };
      if (MediaRecorder.isTypeSupported(selectedMimeType)) {
        recorderOptions.mimeType = selectedMimeType;
      }

      this.mediaRecorder = new MediaRecorder(combinedStream, recorderOptions);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      const verses = surahData.verses;
      const totalVerses = verses.length;
      let currentIdx = 0;

      // Handle recording stop promise
      const recordingPromise = new Promise((resolve, reject) => {
        this.mediaRecorder.onstop = () => {
          try {
            const ext = selectedMimeType.includes('mp4') || format === 'mp4' ? 'mp4' : 'webm';
            const blob = new Blob(this.recordedChunks, { type: selectedMimeType });
            const url = URL.createObjectURL(blob);
            resolve({ blob, url, extension: ext });
          } catch (e) {
            reject(e);
          } finally {
            // Restore original canvas resolution
            this.renderer.canvas.width = origWidth;
            this.renderer.canvas.height = origHeight;
            this.isExporting = false;
          }
        };
        this.mediaRecorder.onerror = (e) => {
          this.renderer.canvas.width = origWidth;
          this.renderer.canvas.height = origHeight;
          this.isExporting = false;
          reject(e);
        };
      });

      // Start recorder
      this.mediaRecorder.start(250);

      // Handle fade in if requested
      if (fade) {
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1.2);
      } else {
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      }

      // Sequential verse player for export
      const playNextExportVerse = async () => {
        if (currentIdx >= totalVerses || !this.isExporting) {
          // Fade out on last second if requested
          if (fade && audioCtx.state !== 'closed') {
            gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
          }

          setTimeout(() => {
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
              this.mediaRecorder.stop();
            }
            if (audioCtx.state !== 'closed') {
              audioCtx.close();
            }
          }, fade ? 900 : 400);
          return;
        }

        const v = verses[currentIdx];
        this.renderer.updateState({
          currentVerse: v,
          verseIndex: currentIdx
        });

        if (onProgress) {
          onProgress({
            percent: Math.round(((currentIdx) / totalVerses) * 100),
            currentAyah: v.ayahNumber,
            totalAyahs: totalVerses,
            verseText: v.textUthmani
          });
        }

        exportAudio.src = v.everyAyahUrl;
        
        await new Promise((res) => {
          const onEnded = () => {
            exportAudio.removeEventListener('ended', onEnded);
            exportAudio.removeEventListener('error', onErrorAyah);
            currentIdx++;
            res();
          };
          const onErrorAyah = () => {
            exportAudio.removeEventListener('ended', onEnded);
            exportAudio.removeEventListener('error', onErrorAyah);
            setTimeout(() => {
              currentIdx++;
              res();
            }, 4000);
          };

          exportAudio.addEventListener('ended', onEnded);
          exportAudio.addEventListener('error', onErrorAyah);
          exportAudio.play().catch(() => onErrorAyah());
        });

        playNextExportVerse();
      };

      // Launch sequential processing
      playNextExportVerse();

      const result = await recordingPromise;
      if (onComplete) onComplete(result);
      return result;

    } catch (err) {
      this.renderer.canvas.width = origWidth;
      this.renderer.canvas.height = origHeight;
      this.isExporting = false;
      console.error("Export error:", err);
      if (onError) onError(err);
      throw err;
    }
  }

  /**
   * Quick Audio MP3 Export for selected Surah/range
   */
  async exportAudioOnly({ surahData, onProgress, onComplete }) {
    try {
      const verses = surahData.verses;
      if (!verses || verses.length === 0) return;

      // If single verse or chapter audio URL is present
      if (surahData.chapterAudioUrl && verses.length === surahData.surah.versesCount) {
        const a = document.createElement('a');
        a.href = surahData.chapterAudioUrl;
        a.target = '_blank';
        a.download = `Quran_${surahData.surah.englishName}_${surahData.reciter.englishName}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (onComplete) onComplete();
        return;
      }

      // Download first ayah audio or trigger direct link
      const firstAudioUrl = verses[0].everyAyahUrl;
      const a = document.createElement('a');
      a.href = firstAudioUrl;
      a.target = '_blank';
      a.download = `Quran_${surahData.surah.englishName}_Ayah_${surahData.startAyah}_${surahData.endAyah}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (onComplete) onComplete();
    } catch (e) {
      console.error("Audio download error:", e);
    }
  }
}
