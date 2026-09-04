export interface Language {
  id: string;
  code: string;
  name: string; // Native name
  englishName: string;
  flag: string;
  bcp47: string;
  direction?: 'ltr' | 'rtl';
  sampleQueries: string[];
}

export const TOP_LANGUAGES: Language[] = [
  {
    id: 'zh',
    code: 'zh',
    name: '中文 (Chinese)',
    englishName: 'Chinese',
    flag: '🇨🇳',
    bcp47: 'zh-CN',
    direction: 'ltr',
    sampleQueries: ['破防', '凡尔赛', '躺平', '沉浸式', '一期一会'],
  },
  {
    id: 'en',
    code: 'en',
    name: 'English',
    englishName: 'English',
    flag: '🇺🇸',
    bcp47: 'en-US',
    direction: 'ltr',
    sampleQueries: ['serendipity', 'epiphany', 'bite the bullet', 'lowkey', 'gatekeep'],
  },
  {
    id: 'es',
    code: 'es',
    name: 'Español (Spanish)',
    englishName: 'Spanish',
    flag: '🇪🇸',
    bcp47: 'es-ES',
    direction: 'ltr',
    sampleQueries: ['sobremesa', 'madrugada', 'buena onda', 'echar una mano'],
  },
  {
    id: 'fr',
    code: 'fr',
    name: 'Français (French)',
    englishName: 'French',
    flag: '🇫🇷',
    bcp47: 'fr-FR',
    direction: 'ltr',
    sampleQueries: ['déjà vu', 'coup de foudre', 'flâneur', 'laissez-faire'],
  },
  {
    id: 'de',
    code: 'de',
    name: 'Deutsch (German)',
    englishName: 'German',
    flag: '🇩🇪',
    bcp47: 'de-DE',
    direction: 'ltr',
    sampleQueries: ['Fernweh', 'Schadenfreude', 'Feierabend', 'Kummerspeck'],
  },
  {
    id: 'ja',
    code: 'ja',
    name: '日本語 (Japanese)',
    englishName: 'Japanese',
    flag: '🇯🇵',
    bcp47: 'ja-JP',
    direction: 'ltr',
    sampleQueries: ['木漏れ日', 'わびさび', '積ん読', 'お疲れ様'],
  },
  {
    id: 'ko',
    code: 'ko',
    name: '한국어 (Korean)',
    englishName: 'Korean',
    flag: '🇰🇷',
    bcp47: 'ko-KR',
    direction: 'ltr',
    sampleQueries: ['눈치 (nunchi)', '소확행', '대박', '힐링'],
  },
  {
    id: 'ar',
    code: 'ar',
    name: 'العربية (Arabic)',
    englishName: 'Arabic',
    flag: '🇸🇦',
    bcp47: 'ar-SA',
    direction: 'rtl',
    sampleQueries: ['يا ريت (Ya rayt)', 'إن شاء الله', 'على راسي', 'حبيبي'],
  },
  {
    id: 'ru',
    code: 'ru',
    name: 'Русский (Russian)',
    englishName: 'Russian',
    flag: '🇷🇺',
    bcp47: 'ru-RU',
    direction: 'ltr',
    sampleQueries: ['тоска (toska)', 'почемучка', 'халява', 'душа'],
  },
  {
    id: 'pt',
    code: 'pt',
    name: 'Português (Portuguese)',
    englishName: 'Portuguese',
    flag: '🇧🇷',
    bcp47: 'pt-BR',
    direction: 'ltr',
    sampleQueries: ['saudade', 'cafuné', 'desenrascanço', 'gambiarra'],
  },
];

export interface ExampleSentence {
  target: string;
  translation: string;
}

export interface RelatedWord {
  word: string;
  type: 'synonym' | 'confusing_similar';
  difference: string;
}

export interface FunUsageNotes {
  culturalVibe: string;
  scenarios: string;
  tone: string;
  relatedWords: RelatedWord[];
}

export interface VisualMemoryHook {
  metaphor: string;       // 核心视觉隐喻
  mnemonicTip: string;    // 视觉联想秒记秘诀
  focalPoints?: string[]; // 画面中核心关键视觉线索
}

export interface DictionaryEntry {
  id: string;
  query: string;
  normalizedTerm: string;
  sourceLang: string; // code
  targetLang: string; // code
  phonetic?: string;
  partOfSpeech?: string;
  naturalExplanation: string;
  examples: ExampleSentence[];
  funUsageNotes: FunUsageNotes;
  imagePrompt: string;
  imageUrl: string;
  visualMemoryHook?: VisualMemoryHook;
  timestamp: number;
  isBookmarked?: boolean;
  mastered?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface StoryResult {
  title: string;
  storyTarget: string;
  storySource: string;
  includedWords: string[];
  vocabularyTips: Array<{
    word: string;
    inStoryContext: string;
  }>;
}

export interface VideoClip {
  id: string;
  videoId: string; // YouTube video ID or video token
  title: string;
  sourceType: 'movie' | 'speech' | 'tv_show' | 'podcast';
  sourceTitle: string; // e.g. "经典影视剧对白", "TED 演讲", "老友记 Friends"
  speaker: string;
  startSeconds: number; // e.g. 142
  endSeconds: number; // e.g. 146
  duration: number; // 3, 4, 5
  targetWordTimestamp: number; // e.g. 144
  quoteOriginal: string;
  quoteTranslation: string;
  vibeAnalysis: string; // 为什么这 3-5 秒最能表现该词精髓（表情、重音、动作）
  emotionalTone: string; // 情绪与语气标签
  videoThumbnail?: string;
}

export interface VideoClipSearchResult {
  term: string;
  clips: VideoClip[];
  youglishQuery: string;
  defaultDuration: number;
  summaryInsight: string;
}
