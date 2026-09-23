export const TRANSLATION_LANGUAGES = [
  { id: 20, code: 'en', name: 'الإنجليزية (English - Saheeh Int.)' },
  { id: 31, code: 'fr', name: 'الفرنسية (Français - Hamidullah)' },
  { id: 83, code: 'es', name: 'الإسبانية (Español - Isa Garcia)' },
  { id: 27, code: 'de', name: 'الألمانية (Deutsch - Bubenheim)' },
  { id: 77, code: 'tr', name: 'التركية (Türkçe - Diyanet)' },
  { id: 33, code: 'id', name: 'الإندونيسية (Bahasa Indonesia)' },
  { id: 54, code: 'ur', name: 'الأردية (اردو - Junagarhi)' },
  { id: 45, code: 'ru', name: 'الروسية (Русский - Kuliev)' }
];

export const RECITERS = [
  { id: 7, name: "مشاري بن راشد العفاسي", englishName: "Mishary Rashid Alafasy", style: "مرتل", everyAyahFolder: "Alafasy_128kbps" },
  { id: 101, name: "علي عبد الله جابر", englishName: "Ali Jaber", style: "إمام الحرم المكي", everyAyahFolder: "Ali_Jaber_64kbps" },
  { id: 102, name: "أحمد بن علي العجمي", englishName: "Ahmed Al-Ajamy", style: "مرتل", everyAyahFolder: "ahmed_ibn_ali_al_ajamy_128kbps" },
  { id: 2, name: "عبد الباسط عبد الصمد", englishName: "AbdulBaset AbdulSamad", style: "مرتل", everyAyahFolder: "Abdul_Basit_Murattal_192kbps" },
  { id: 9, name: "محمد صديق المنشاوي", englishName: "Mohamed Siddiq Al-Minshawi", style: "مرتل", everyAyahFolder: "Minshawy_Murattal_128kbps" },
  { id: 6, name: "محمود خليل الحصري", englishName: "Mahmoud Khalil Al-Husary", style: "مرتل", everyAyahFolder: "Husary_128kbps" },
  { id: 12, name: "ماهر المعيقلي", englishName: "Maher Al-Muaiqly", style: "حفص عن عاصم", everyAyahFolder: "Maher_AlMuaiqly_64kbps" },
  { id: 13, name: "ياسر الدوسري", englishName: "Yasser Al-Dossari", style: "مرتل", everyAyahFolder: "Yasser_Ad-Dussary_128kbps" },
  { id: 3, name: "سعد الغامدي", englishName: "Saad Al-Ghamdi", style: "مرتل", everyAyahFolder: "Ghamadi_40kbps" },
  { id: 1, name: "عبد الرحمن السديس", englishName: "Abdul Rahman Al-Sudais", style: "مرتل", everyAyahFolder: "Abdurrahmaan_As-Sudais_192kbps" },
  { id: 10, name: "سعود الشريم", englishName: "Saud Al-Shuraim", style: "مرتل", everyAyahFolder: "Saood_ash-Shuraym_128kbps" },
  { id: 5, name: "أبو بكر الشاطري", englishName: "Abu Bakr Al-Shatri", style: "مرتل", everyAyahFolder: "Abu_Bakr_Ash-Shaatree_128kbps" }
];

export const SURAHS = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", versesCount: 7, revelationType: "مكية" },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", versesCount: 286, revelationType: "مدنية" },
  { number: 3, name: "آل عمران", englishName: "Ali 'Imran", versesCount: 200, revelationType: "مدنية" },
  { number: 4, name: "النساء", englishName: "An-Nisa", versesCount: 176, revelationType: "مدنية" },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", versesCount: 120, revelationType: "مدنية" },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", versesCount: 165, revelationType: "مكية" },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", versesCount: 206, revelationType: "مكية" },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", versesCount: 75, revelationType: "مدنية" },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", versesCount: 129, revelationType: "مدنية" },
  { number: 10, name: "يونس", englishName: "Yunus", versesCount: 109, revelationType: "مكية" },
  { number: 11, name: "هود", englishName: "Hud", versesCount: 123, revelationType: "مكية" },
  { number: 12, name: "يوسف", englishName: "Yusuf", versesCount: 111, revelationType: "مكية" },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", versesCount: 43, revelationType: "مدنية" },
  { number: 14, name: "إبراهيم", englishName: "Ibrahim", versesCount: 52, revelationType: "مكية" },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", versesCount: 99, revelationType: "مكية" },
  { number: 16, name: "النحل", englishName: "An-Nahl", versesCount: 128, revelationType: "مكية" },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", versesCount: 111, revelationType: "مكية" },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", versesCount: 110, revelationType: "مكية" },
  { number: 19, name: "مريم", englishName: "Maryam", versesCount: 98, revelationType: "مكية" },
  { number: 20, name: "طه", englishName: "Taha", versesCount: 135, revelationType: "مكية" },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", versesCount: 112, revelationType: "مكية" },
  { number: 22, name: "الحج", englishName: "Al-Hajj", versesCount: 78, revelationType: "مدنية" },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", versesCount: 118, revelationType: "مكية" },
  { number: 24, name: "النور", englishName: "An-Nur", versesCount: 64, revelationType: "مدنية" },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", versesCount: 77, revelationType: "مكية" },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", versesCount: 227, revelationType: "مكية" },
  { number: 27, name: "النمل", englishName: "An-Naml", versesCount: 93, revelationType: "مكية" },
  { number: 28, name: "القصص", englishName: "Al-Qasas", versesCount: 88, revelationType: "مكية" },
  { number: 29, name: "العنكبوت", englishName: "Al-'Ankabut", versesCount: 69, revelationType: "مكية" },
  { number: 30, name: "الروم", englishName: "Ar-Rum", versesCount: 60, revelationType: "مكية" },
  { number: 31, name: "لقمان", englishName: "Luqman", versesCount: 34, revelationType: "مكية" },
  { number: 32, name: "السجدة", englishName: "As-Sajdah", versesCount: 30, revelationType: "مكية" },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", versesCount: 73, revelationType: "مدنية" },
  { number: 34, name: "سبأ", englishName: "Saba", versesCount: 54, revelationType: "مكية" },
  { number: 35, name: "فاطر", englishName: "Fatir", versesCount: 45, revelationType: "مكية" },
  { number: 36, name: "يس", englishName: "Ya-Sin", versesCount: 83, revelationType: "مكية" },
  { number: 37, name: "الصافات", englishName: "As-Saffat", versesCount: 182, revelationType: "مكية" },
  { number: 38, name: "ص", englishName: "Sad", versesCount: 88, revelationType: "مكية" },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", versesCount: 75, revelationType: "مكية" },
  { number: 40, name: "غافر", englishName: "Ghafir", versesCount: 85, revelationType: "مكية" },
  { number: 41, name: "فصلت", englishName: "Fussilat", versesCount: 54, revelationType: "مكية" },
  { number: 42, name: "الشورى", englishName: "Ash-Shuraa", versesCount: 53, revelationType: "مكية" },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", versesCount: 89, revelationType: "مكية" },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhan", versesCount: 59, revelationType: "مكية" },
  { number: 45, name: "الجاثية", englishName: "Al-Jathiyah", versesCount: 37, revelationType: "مكية" },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", versesCount: 35, revelationType: "مكية" },
  { number: 47, name: "محمد", englishName: "Muhammad", versesCount: 38, revelationType: "مدنية" },
  { number: 48, name: "الفتح", englishName: "Al-Fath", versesCount: 29, revelationType: "مدنية" },
  { number: 49, name: "الحجرات", englishName: "Al-Hujurat", versesCount: 18, revelationType: "مدنية" },
  { number: 50, name: "ق", englishName: "Qaf", versesCount: 45, revelationType: "مكية" },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", versesCount: 60, revelationType: "مكية" },
  { number: 52, name: "الطور", englishName: "At-Tur", versesCount: 49, revelationType: "مكية" },
  { number: 53, name: "النجم", englishName: "An-Najm", versesCount: 62, revelationType: "مكية" },
  { number: 54, name: "القمر", englishName: "Al-Qamar", versesCount: 55, revelationType: "مكية" },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", versesCount: 78, revelationType: "مدنية" },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", versesCount: 96, revelationType: "مكية" },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", versesCount: 29, revelationType: "مدنية" },
  { number: 58, name: "المجادلة", englishName: "Al-Mujadila", versesCount: 22, revelationType: "مدنية" },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", versesCount: 24, revelationType: "مدنية" },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahanah", versesCount: 13, revelationType: "مدنية" },
  { number: 61, name: "الصف", englishName: "As-Saf", versesCount: 14, revelationType: "مدنية" },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'ah", versesCount: 11, revelationType: "مدنية" },
  { number: 63, name: "المنافقون", englishName: "Al-Munafiqun", versesCount: 11, revelationType: "مدنية" },
  { number: 64, name: "التغابن", englishName: "At-Taghabun", versesCount: 18, revelationType: "مدنية" },
  { number: 65, name: "الطلاق", englishName: "At-Talaq", versesCount: 12, revelationType: "مدنية" },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", versesCount: 12, revelationType: "مدنية" },
  { number: 67, name: "الملك", englishName: "Al-Mulk", versesCount: 30, revelationType: "مكية" },
  { number: 68, name: "القلم", englishName: "Al-Qalam", versesCount: 52, revelationType: "مكية" },
  { number: 69, name: "الحاقة", englishName: "Al-Haqqah", versesCount: 52, revelationType: "مكية" },
  { number: 70, name: "المعارج", englishName: "Al-Ma'arij", versesCount: 44, revelationType: "مكية" },
  { number: 71, name: "نوح", englishName: "Nuh", versesCount: 28, revelationType: "مكية" },
  { number: 72, name: "الجن", englishName: "Al-Jinn", versesCount: 28, revelationType: "مكية" },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", versesCount: 20, revelationType: "مكية" },
  { number: 74, name: "المدثر", englishName: "Al-Muddaththir", versesCount: 56, revelationType: "مكية" },
  { number: 75, name: "القيامة", englishName: "Al-Qiyamah", versesCount: 40, revelationType: "مكية" },
  { number: 76, name: "الإنسان", englishName: "Al-Insan", versesCount: 31, revelationType: "مدنية" },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalat", versesCount: 50, revelationType: "مكية" },
  { number: 78, name: "النبأ", englishName: "An-Naba", versesCount: 40, revelationType: "مكية" },
  { number: 79, name: "النازعات", englishName: "An-Nazi'at", versesCount: 46, revelationType: "مكية" },
  { number: 80, name: "عبس", englishName: "'Abasa", versesCount: 42, revelationType: "مكية" },
  { number: 81, name: "التكوير", englishName: "At-Takwir", versesCount: 29, revelationType: "مكية" },
  { number: 82, name: "الانفطار", englishName: "Al-Infitar", versesCount: 19, revelationType: "مكية" },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", versesCount: 36, revelationType: "مكية" },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaq", versesCount: 25, revelationType: "مكية" },
  { number: 85, name: "البروج", englishName: "Al-Buruj", versesCount: 22, revelationType: "مكية" },
  { number: 86, name: "الطارق", englishName: "At-Tariq", versesCount: 17, revelationType: "مكية" },
  { number: 87, name: "الأعلى", englishName: "Al-A'la", versesCount: 19, revelationType: "مكية" },
  { number: 88, name: "الغاشية", englishName: "Al-Ghashiyah", versesCount: 26, revelationType: "مكية" },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", versesCount: 30, revelationType: "مكية" },
  { number: 90, name: "البلد", englishName: "Al-Balad", versesCount: 20, revelationType: "مكية" },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", versesCount: 15, revelationType: "مكية" },
  { number: 92, name: "الليل", englishName: "Al-Layl", versesCount: 21, revelationType: "مكية" },
  { number: 93, name: "الضحى", englishName: "Ad-Duhaa", versesCount: 11, revelationType: "مكية" },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", versesCount: 8, revelationType: "مكية" },
  { number: 95, name: "التين", englishName: "At-Tin", versesCount: 8, revelationType: "مكية" },
  { number: 96, name: "العلق", englishName: "Al-'Alaq", versesCount: 19, revelationType: "مكية" },
  { number: 97, name: "القدر", englishName: "Al-Qadr", versesCount: 5, revelationType: "مكية" },
  { number: 98, name: "البينة", englishName: "Al-Bayyinah", versesCount: 8, revelationType: "مدنية" },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzalah", versesCount: 8, revelationType: "مدنية" },
  { number: 100, name: "العاديات", englishName: "Al-'Adiyat", versesCount: 11, revelationType: "مكية" },
  { number: 101, name: "القارعة", englishName: "Al-Qari'ah", versesCount: 11, revelationType: "مكية" },
  { number: 102, name: "التكاثر", englishName: "At-Takathur", versesCount: 8, revelationType: "مكية" },
  { number: 103, name: "العصر", englishName: "Al-'Asr", versesCount: 3, revelationType: "مكية" },
  { number: 104, name: "الهمزة", englishName: "Al-Humazah", versesCount: 9, revelationType: "مكية" },
  { number: 105, name: "الفيل", englishName: "Al-Fil", versesCount: 5, revelationType: "مكية" },
  { number: 106, name: "قريش", englishName: "Quraysh", versesCount: 4, revelationType: "مكية" },
  { number: 107, name: "الماعون", englishName: "Al-Ma'un", versesCount: 7, revelationType: "مكية" },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", versesCount: 3, revelationType: "مكية" },
  { number: 109, name: "الكافرون", englishName: "Al-Kafirun", versesCount: 6, revelationType: "مكية" },
  { number: 110, name: "النصر", englishName: "An-Nasr", versesCount: 3, revelationType: "مدنية" },
  { number: 111, name: "المسد", englishName: "Al-Masad", versesCount: 5, revelationType: "مكية" },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", versesCount: 4, revelationType: "مكية" },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", versesCount: 5, revelationType: "مكية" },
  { number: 114, name: "الناس", englishName: "An-Nas", versesCount: 6, revelationType: "مكية" }
];

const API_BASE = 'https://api.quran.com/api/v4';

/**
 * Fetch verses with Uthmani script and translations for a surah / range
 */
export async function fetchSurahVerses(surahNumber, fromAyah = 1, toAyah = null, reciterId = 7, translationId = 20) {
  try {
    const surah = SURAHS.find(s => s.number === parseInt(surahNumber));
    const totalAyahs = surah ? surah.versesCount : 7;
    const endAyah = toAyah ? Math.min(parseInt(toAyah), totalAyahs) : totalAyahs;
    const startAyah = Math.max(1, parseInt(fromAyah));

    // Fetch Uthmani text from Quran.com API v4
    const uthmaniUrl = `${API_BASE}/quran/verses/uthmani?chapter_number=${surahNumber}`;
    // Fetch translation in selected language (default 20 = English Saheeh Int.)
    const translationUrl = `${API_BASE}/quran/translations/${translationId}?chapter_number=${surahNumber}`;
    // Fetch Arabic Tafsir Muyassar (from alquran.cloud)
    const tafsirUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.muyassar`;
    // Fetch Audio recitations with verse segments
    const audioUrl = `${API_BASE}/chapter_recitations/${reciterId}/${surahNumber}?segments=true`;

    const [uthmaniRes, transRes, tafsirRes, audioRes] = await Promise.allSettled([
      fetch(uthmaniUrl).then(r => r.json()),
      fetch(translationUrl).then(r => r.json()),
      fetch(tafsirUrl).then(r => r.json()),
      fetch(audioUrl).then(r => r.json())
    ]);

    let uthmaniVerses = [];
    if (uthmaniRes.status === 'fulfilled' && uthmaniRes.value.verses) {
      uthmaniVerses = uthmaniRes.value.verses;
    }

    let translations = [];
    if (transRes.status === 'fulfilled' && transRes.value.translations) {
      translations = transRes.value.translations;
    }

    let tafsirList = [];
    if (tafsirRes.status === 'fulfilled' && tafsirRes.value.data && tafsirRes.value.data.ayahs) {
      tafsirList = tafsirRes.value.data.ayahs;
    }

    // Fallback translation from AlQuran.cloud if needed
    if (translations.length === 0) {
      try {
        const cloudRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`).then(r => r.json());
        if (cloudRes.code === 200 && cloudRes.data && cloudRes.data.ayahs) {
          translations = cloudRes.data.ayahs.map(a => ({ text: a.text }));
        }
      } catch (e) {
        console.warn('Fallback translation error:', e);
      }
    }

    let audioData = null;
    if (audioRes.status === 'fulfilled' && audioRes.value.audio_file) {
      audioData = audioRes.value.audio_file;
    }

    // Build verse list with timestamps
    const verses = [];
    const reciter = RECITERS.find(r => r.id === parseInt(reciterId)) || RECITERS[0];

    for (let i = startAyah; i <= endAyah; i++) {
      const verseKey = `${surahNumber}:${i}`;
      const uthmaniObj = uthmaniVerses.find(v => v.verse_key === verseKey);
      const transObj = translations[i - 1];
      const tafsirObj = tafsirList[i - 1];

      let textUthmani = uthmaniObj ? uthmaniObj.text_uthmani : `آية ${i}`;
      let rawTranslation = transObj ? transObj.text : '';
      // Remove footnote tags like <sup ...>...</sup> and HTML tags
      let textTranslation = rawTranslation
        .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
        .replace(/<[^>]*>?/gm, '')
        .trim();

      let textTafsir = tafsirObj ? tafsirObj.text.replace(/<[^>]*>?/gm, '').trim() : '';

      // Fallback single verse audio from EveryAyah (guaranteed to always work)
      const paddedSurah = String(surahNumber).padStart(3, '0');
      const paddedAyah = String(i).padStart(3, '0');
      const everyAyahUrl = `https://everyayah.com/data/${reciter.everyAyahFolder}/${paddedSurah}${paddedAyah}.mp3`;

      // Audio timing segments if available from Quran.com
      let timing = null;
      if (audioData && audioData.timestamps) {
        const seg = audioData.timestamps.find(t => t.verse_key === verseKey);
        if (seg) {
          timing = {
            start: seg.timestamp_from / 1000,
            end: seg.timestamp_to / 1000,
            duration: (seg.timestamp_to - seg.timestamp_from) / 1000,
            segments: seg.segments || []
          };
        }
      }

      verses.push({
        surahNumber: parseInt(surahNumber),
        ayahNumber: i,
        verseKey,
        textUthmani,
        textTranslation,
        textTafsir,
        everyAyahUrl,
        timing
      });
    }

    return {
      surah,
      reciter,
      chapterAudioUrl: audioData ? audioData.audio_url : null,
      verses,
      startAyah,
      endAyah
    };
  } catch (error) {
    console.error('Error fetching surah data:', error);
    throw error;
  }
}
