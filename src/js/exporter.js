/**
 * In-Browser Video Exporter Engine
 * Records Canvas stream + Audio stream into high-definition WebM / MP4 video
 */

export class VideoExporter {
  constructor(renderer, player) {
    this.renderer = renderer;
    this.player = player;
    this.isExporting = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }

  async exportVideo({ surahData, onProgress, onComplete, onError }) {
    if (this.isExporting) return;
    this.isExporting = true;

    try {
      const canvas = this.renderer.canvas;
      const canvasStream = canvas.captureStream(30); // 30 FPS

      // Create Audio Context to route audio properly without CORS blocks if possible
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();

      // Setup audio element for recording
      const exportAudio = new Audio();
      exportAudio.crossOrigin = "anonymous";
      exportAudio.preload = "auto";

      // Combine Canvas video tracks + Audio tracks
      let combinedStream;
      let hasAudioTrack = false;

      try {
        const source = audioCtx.createMediaElementSource(exportAudio);
        source.connect(dest);
        source.connect(audioCtx.destination); // optional monitor
        const audioTracks = dest.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          combinedStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...audioTracks
          ]);
          hasAudioTrack = true;
        }
      } catch (err) {
        console.warn("AudioContext connect warning:", err);
      }

      if (!combinedStream) {
        combinedStream = canvasStream;
      }

      // Determine best supported MIME type
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
        videoBitsPerSecond: 8000000 // 8 Mbps for crisp HD
      });

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      const verses = surahData.verses;
      const totalVerses = verses.length;
      let currentIdx = 0;

      // Promise resolution on stop
      const recordingPromise = new Promise((resolve, reject) => {
        this.mediaRecorder.onstop = () => {
          try {
            const blob = new Blob(this.recordedChunks, { type: mimeType });
            const url = URL.createObjectURL(blob);
            resolve({ blob, url, extension: mimeType.includes('mp4') ? 'mp4' : 'webm' });
          } catch (e) {
            reject(e);
          }
        };
        this.mediaRecorder.onerror = (e) => reject(e);
      });

      // Start recording
      this.mediaRecorder.start(250);

      // Play each verse sequentially and update canvas
      const playNextExportVerse = async () => {
        if (currentIdx >= totalVerses || !this.isExporting) {
          // Finished recording
          setTimeout(() => {
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
              this.mediaRecorder.stop();
            }
            if (audioCtx.state !== 'closed') {
              audioCtx.close();
            }
          }, 600);
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
        
        // Wait for verse audio to play completely
        await new Promise((res) => {
          const onEnded = () => {
            exportAudio.removeEventListener('ended', onEnded);
            exportAudio.removeEventListener('error', onErrorAyah);
            currentIdx++;
            res();
          };
          const onErrorAyah = () => {
            // If audio fails, wait 4 seconds fallback
            exportAudio.removeEventListener('ended', onEnded);
            exportAudio.removeEventListener('error', onErrorAyah);
            setTimeout(() => {
              currentIdx++;
              res();
            }, 4000);
          };

          exportAudio.addEventListener('ended', onEnded);
          exportAudio.addEventListener('error', onErrorAyah);
          
          exportAudio.play().catch(() => {
            setTimeout(onEnded, 4000);
          });
        });

        playNextExportVerse();
      };

      // Kickoff sequential render
      playNextExportVerse();

      const result = await recordingPromise;
      this.isExporting = false;

      if (onProgress) {
        onProgress({ percent: 100, currentAyah: totalVerses, totalAyahs: totalVerses });
      }

      if (onComplete) {
        onComplete(result);
      }

      return result;
    } catch (err) {
      this.isExporting = false;
      if (onError) onError(err);
      throw err;
    }
  }

  cancelExport() {
    this.isExporting = false;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }
}
