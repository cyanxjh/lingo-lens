import React, { useState, useEffect, useRef } from 'react';
import {
  Language,
  TOP_LANGUAGES,
  DictionaryEntry,
} from './types';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { ResultCard } from './components/ResultCard';
import { WordChatDrawer } from './components/WordChatDrawer';
import { NotebookView } from './components/NotebookView';
import { FlashcardsView } from './components/FlashcardsView';
import { StoryModal } from './components/StoryModal';
import { YouglishContextViewer } from './components/YouglishContextViewer';
import {
  Search,
  BookMarked,
  Layers,
  Sparkles,
  Globe,
  ArrowRight,
  ArrowLeftRight,
  Loader2,
  AlertCircle,
  Clock,
  Trash2,
  Volume2,
  X,
  Compass,
  RefreshCw,
} from 'lucide-react';

const STORAGE_KEY_SOURCE_LANG = 'ai_dict_source_lang';
const STORAGE_KEY_TARGET_LANG = 'ai_dict_target_lang';
const STORAGE_KEY_NOTEBOOK = 'ai_dict_notebook_entries';
const STORAGE_KEY_RECENTS = 'ai_dict_recent_searches';
const STORAGE_KEY_INIT_DONE = 'ai_dict_initial_setup_done';

// Initial sample entry so first visit is immediately vibrant and engaging
const INITIAL_SAMPLE_ENTRY: DictionaryEntry = {
  id: 'sample_serendipity',
  query: 'serendipity',
  normalizedTerm: 'serendipity',
  sourceLang: 'zh',
  targetLang: 'en',
  phonetic: '/ˌser.ənˈdɪp.ə.t̬i/',
  partOfSpeech: '不可数名词 (Noun)',
  naturalExplanation:
    '指“意外发现的美好事物”或“无心插柳柳成荫的幸运巧合”。通常指你本没刻意寻找，却意外撞见惊喜或贵人。',
  examples: [
    {
      target: 'Finding my favorite vintage book in that tiny coffee shop was pure serendipity.',
      translation: '在那家不起眼的咖啡小馆里意外偶遇我最心仪的复古旧书，纯粹是命中注定的美好小确幸。',
    },
    {
      target: 'Science is full of serendipity—penicillin was discovered entirely by accident!',
      translation: '科学史往往充满奇妙巧合——青霉素的问世完全是一次美丽的意外！',
    },
  ],
  funUsageNotes: {
    culturalVibe:
      '英语母语者非常偏爱的一个词，经常被评为“最美丽的英语单词之一”。自带浪漫、轻快又感恩的氛围感，比单纯的 "lucky" 或 "accident" 多了一层诗意和命运的馈赠感。',
    scenarios: '朋友聚会闲聊旅行奇遇、偶遇旧友、意外发掘宝藏店铺或灵感降临时脱口而出。',
    tone: '浪漫、欣喜、文艺且温和',
    relatedWords: [
      {
        word: 'fluke',
        type: 'synonym',
        difference: 'fluke 指纯属侥幸或撞大运，多带有随意或不严肃的感觉；而 serendipity 强调美好的意外发现。',
      },
      {
        word: 'coincidence',
        type: 'confusing_similar',
        difference: 'coincidence 只是中性的“巧合”（好坏皆可）；serendipity 则特指令人愉悦的正面奇遇。',
      },
    ],
  },
  imagePrompt:
    'A whimsical 3D isometric illustration of a person stepping into an enchanted sunny cobblestone alley and discovering a glowing book, warm golden morning light, joyful pastel tones, miniature diorama style',
  imageUrl:
    'https://image.pollinations.ai/prompt/whimsical%203D%20isometric%20illustration%20of%20discovering%20a%20glowing%20book%20in%20sunny%20cafe%20warm%20golden%20light%20serendipity%20pastel%20style?width=768&height=768&seed=88231&nologo=true',
  timestamp: Date.now(),
  isBookmarked: true,
};

export default function App() {
  // 1. Language States
  const [sourceLang, setSourceLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SOURCE_LANG);
    return TOP_LANGUAGES.find((l) => l.id === saved) || TOP_LANGUAGES[0]; // Chinese
  });

  const [targetLang, setTargetLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TARGET_LANG);
    return TOP_LANGUAGES.find((l) => l.id === saved) || TOP_LANGUAGES[1]; // English
  });

  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(() => {
    return !localStorage.getItem(STORAGE_KEY_INIT_DONE);
  });

  // 2. Search & Result States
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<DictionaryEntry | null>(INITIAL_SAMPLE_ENTRY);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 3. Notebook / Flashcards / Recents States
  const [savedEntries, setSavedEntries] = useState<DictionaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTEBOOK);
      return saved ? JSON.parse(saved) : [INITIAL_SAMPLE_ENTRY];
    } catch {
      return [INITIAL_SAMPLE_ENTRY];
    }
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENTS);
      return saved ? JSON.parse(saved) : ['serendipity', 'sobremesa', '木漏れ日'];
    } catch {
      return ['serendipity'];
    }
  });

  // 4. View & Modal Navigation States
  const [activeTab, setActiveTab] = useState<'lookup' | 'notebook' | 'flashcards' | 'youglish'>('lookup');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // In-flight request controller and client-side memory cache
  const activeAbortRef = useRef<AbortController | null>(null);
  const clientCacheRef = useRef<Map<string, DictionaryEntry>>(new Map());

  // Save notebook changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTEBOOK, JSON.stringify(savedEntries));
  }, [savedEntries]);

  // Save recents changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Save languages
  const handleSelectLanguages = (source: Language, target: Language) => {
    setSourceLang(source);
    setTargetLang(target);
    localStorage.setItem(STORAGE_KEY_SOURCE_LANG, source.id);
    localStorage.setItem(STORAGE_KEY_TARGET_LANG, target.id);
    localStorage.setItem(STORAGE_KEY_INIT_DONE, 'true');
    setIsInitialSetup(false);
  };

  // Perform Dictionary Lookup
  const handleLookup = async (queryText?: string) => {
    const text = (queryText ?? searchQuery).trim();
    if (!text) return;

    // Cleanly cancel previous in-flight request if user triggered a new lookup
    if (activeAbortRef.current) {
      try {
        activeAbortRef.current.abort();
      } catch {
        // intentional cancel
      }
    }

    const cacheKey = `${sourceLang.id}_${targetLang.id}_${text.toLowerCase()}`;
    if (clientCacheRef.current.has(cacheKey)) {
      const cached = clientCacheRef.current.get(cacheKey)!;
      setCurrentEntry(cached);
      setActiveTab('lookup');
      setSearchError(null);
      return;
    }

    const controller = new AbortController();
    activeAbortRef.current = controller;

    setIsLoading(true);
    setSearchError(null);
    setActiveTab('lookup');

    const timeoutId = setTimeout(() => {
      try {
        controller.abort();
      } catch {
        // intentional timeout
      }
    }, 28000);

    try {
      let response: Response | null = null;
      try {
        response = await fetch('/api/dictionary/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            query: text,
            sourceLang: sourceLang.id,
            targetLang: targetLang.id,
            sourceLangName: sourceLang.name,
            targetLangName: targetLang.name,
          }),
        });
      } catch (firstErr: any) {
        if (controller.signal.aborted) {
          return;
        }
        // Auto-retry once after 400ms for network glitch
        await new Promise((r) => setTimeout(r, 400));
        if (controller.signal.aborted) return;
        response = await fetch('/api/dictionary/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            query: text,
            sourceLang: sourceLang.id,
            targetLang: targetLang.id,
            sourceLangName: sourceLang.name,
            targetLangName: targetLang.name,
          }),
        });
      }

      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        const errData = await response?.json().catch(() => ({}));
        let errMessage = errData?.error || `查询服务响应异常 (${response?.status || '500'})`;
        try {
          const parsed = JSON.parse(errMessage);
          if (parsed?.error?.message) {
            errMessage = parsed.error.message;
          }
        } catch {
          // not JSON
        }
        throw new Error(errMessage);
      }

      const entry: DictionaryEntry = await response.json();
      clientCacheRef.current.set(cacheKey, entry);
      setCurrentEntry(entry);

      // Add to recents
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== text.toLowerCase());
        return [text, ...filtered].slice(0, 10);
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (controller.signal.aborted || err?.name === 'AbortError') {
        // Request cancelled intentionally by user or replaced by newer query; no error banner
        return;
      }
      console.warn('Lookup notice:', err?.message || err);
      const rawMsg = err?.message || '';
      if (rawMsg.includes('Failed to fetch') || rawMsg.includes('NetworkError')) {
        setSearchError('网络连接波动，已为您切换就绪，请点击重试。');
      } else {
        setSearchError(rawMsg || '服务响应稍慢，请点击重试');
      }
    } finally {
      if (activeAbortRef.current === controller) {
        activeAbortRef.current = null;
        setIsLoading(false);
      }
    }
  };

  // Notebook Toggle Save
  const handleToggleSave = (entry: DictionaryEntry) => {
    setSavedEntries((prev) => {
      const exists = prev.some((e) => e.normalizedTerm.toLowerCase() === entry.normalizedTerm.toLowerCase());
      if (exists) {
        return prev.filter((e) => e.normalizedTerm.toLowerCase() !== entry.normalizedTerm.toLowerCase());
      } else {
        return [{ ...entry, isBookmarked: true }, ...prev];
      }
    });
  };

  const isCurrentSaved = currentEntry
    ? savedEntries.some((e) => e.normalizedTerm.toLowerCase() === currentEntry.normalizedTerm.toLowerCase())
    : false;

  const handleOpenChat = (entry: DictionaryEntry, prompt?: string) => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  const handleToggleMastered = (id: string, mastered: boolean) => {
    setSavedEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, mastered } : e))
    );
  };

  const handleRemoveFromNotebook = (id: string) => {
    setSavedEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('lookup')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#1DB954] flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                AI 词典
              </div>
              <div className="text-[10px] font-bold text-[#1DB954]">
                生动 · 地道 · 概念配图
              </div>
            </div>
          </div>

          {/* Current Languages Selector Pill */}
          <button
            id="open-language-selector-btn"
            type="button"
            onClick={() => setIsLangModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span className="text-base">{sourceLang.flag}</span>
            <span className="hidden sm:inline text-slate-500 font-normal">母语</span>
            <ArrowRight size={13} className="text-[#1DB954]" />
            <span className="text-base">{targetLang.flag}</span>
            <span className="text-slate-900">{targetLang.name.split(' ')[0]}</span>
            <Globe size={13} className="text-slate-400 ml-0.5" />
          </button>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              id="nav-tab-lookup"
              onClick={() => setActiveTab('lookup')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'lookup'
                  ? 'bg-white text-[#1DB954] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search size={14} />
              <span>查词释义</span>
            </button>
            <button
              id="nav-tab-notebook"
              onClick={() => setActiveTab('notebook')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notebook'
                  ? 'bg-white text-[#1DB954] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookMarked size={14} />
              <span>笔记本</span>
              {savedEntries.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                  {savedEntries.length}
                </span>
              )}
            </button>
            <button
              id="nav-tab-flashcards"
              onClick={() => setActiveTab('flashcards')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'flashcards'
                  ? 'bg-white text-[#1DB954] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={14} />
              <span>翻转闪卡</span>
            </button>
            <button
              id="nav-tab-youglish"
              onClick={() => setActiveTab('youglish')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'youglish'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Volume2 size={14} />
              <span>母语者原声</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  activeTab === 'youglish'
                    ? 'bg-white/20 text-white'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                YouGlish
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Lookup View */}
        {activeTab === 'lookup' && (
          <div className="space-y-6">
            {/* Search Box Card */}
            <div className="bg-white rounded-3xl p-4 md:p-5 shadow-lg shadow-slate-200/40 border border-slate-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLookup();
                }}
                className="space-y-3"
              >
                <div className="relative flex items-center">
                  <Search
                    size={20}
                    className="absolute left-4 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="dictionary-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`输入任意单词、口语短语或整句（将用${sourceLang.name}详细解读）...`}
                    className="w-full pl-12 pr-28 py-3.5 md:py-4 rounded-2xl bg-slate-50 focus:bg-white border-2 border-transparent focus:border-[#1DB954] text-base md:text-lg font-medium text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-24 p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    id="submit-lookup-btn"
                    type="submit"
                    disabled={!searchQuery.trim() || isLoading}
                    className="absolute right-2 px-5 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Sparkles size={16} />
                    )}
                    <span>查词</span>
                  </button>
                </div>

                {/* Sample prompt chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                    <Compass size={12} />
                    <span>试一试:</span>
                  </span>
                  {targetLang.sampleQueries.map((sample, idx) => (
                    <button
                      key={idx}
                      id={`sample-query-${idx}`}
                      type="button"
                      onClick={() => {
                        setSearchQuery(sample);
                        handleLookup(sample);
                      }}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-[#1DB954] transition-colors cursor-pointer border border-slate-200/60"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </form>

              {/* Recent searches row */}
              {recentSearches.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs text-slate-500">
                  <Clock size={13} className="shrink-0 text-slate-400" />
                  <span className="shrink-0 font-medium">最近搜索:</span>
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        handleLookup(term);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 shrink-0 cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Error Banner if any */}
            {searchError && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start justify-between gap-3 animate-fade-in shadow-xs">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">查询提示</div>
                    <div className="text-xs text-amber-800 mt-0.5">{searchError}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleLookup()}
                    className="px-3 py-1.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <RefreshCw size={13} />
                    <span>重试</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchError(null)}
                    className="p-1 rounded-xl text-amber-600 hover:bg-amber-100 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-4 animate-pulse">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#1DB954] flex items-center justify-center mx-auto">
                  <Sparkles size={28} className="animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-800">
                    AI 正在为您定制解释与情境配图...
                  </h3>
                  <p className="text-xs text-slate-400">
                    深入分析词汇语境 · 提炼母语自然释义 · 生成 3D 视觉联想
                  </p>
                </div>
                <div className="w-48 h-3 bg-slate-100 rounded-full mx-auto overflow-hidden">
                  <div className="w-1/2 h-full bg-[#1DB954] rounded-full animate-progress"></div>
                </div>
              </div>
            )}

            {/* Result Card */}
            {!isLoading && currentEntry && (
              <ResultCard
                entry={currentEntry}
                targetLangObj={targetLang}
                sourceLangObj={sourceLang}
                isSaved={isCurrentSaved}
                onToggleSave={handleToggleSave}
                onOpenChat={handleOpenChat}
              />
            )}
          </div>
        )}

        {/* Notebook View */}
        {activeTab === 'notebook' && (
          <NotebookView
            entries={savedEntries}
            targetLangObj={targetLang}
            sourceLangObj={sourceLang}
            onSelectEntry={(entry) => {
              setCurrentEntry(entry);
              setActiveTab('lookup');
            }}
            onRemoveEntry={handleRemoveFromNotebook}
            onToggleMastered={handleToggleMastered}
            onStartFlashcards={() => setActiveTab('flashcards')}
            onStartStory={() => setIsStoryModalOpen(true)}
            onGoToSearch={() => setActiveTab('lookup')}
          />
        )}

        {/* Flashcards View */}
        {activeTab === 'flashcards' && (
          <FlashcardsView
            cards={savedEntries}
            targetLangObj={targetLang}
            sourceLangObj={sourceLang}
            onExit={() => setActiveTab('notebook')}
            onToggleMastered={handleToggleMastered}
          />
        )}

        {/* Authentic YouGlish Native Speaker Context View */}
        {activeTab === 'youglish' && (
          <div className="space-y-4 animate-fade-in">
            <YouglishContextViewer
              initialTerm={currentEntry?.normalizedTerm || 'bite the bullet'}
              standalone={true}
            />
          </div>
        )}
      </main>

      {/* 3. Mobile Bottom Navigation Bar */}
      <nav className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
        <button
          id="mobile-tab-lookup"
          type="button"
          onClick={() => setActiveTab('lookup')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'lookup'
              ? 'text-[#1DB954] scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search size={18} />
          <span>查词</span>
        </button>

        <button
          id="mobile-tab-youglish"
          type="button"
          onClick={() => setActiveTab('youglish')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'youglish'
              ? 'text-red-600 scale-105 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Volume2 size={18} />
          <span>母语原声</span>
        </button>

        <button
          id="mobile-tab-notebook"
          type="button"
          onClick={() => setActiveTab('notebook')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-xs font-bold relative transition-all cursor-pointer ${
            activeTab === 'notebook'
              ? 'text-[#1DB954] scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookMarked size={18} />
          <span>笔记本</span>
          {savedEntries.length > 0 && (
            <span className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-[#1DB954] text-white text-[9px] flex items-center justify-center font-black">
              {savedEntries.length}
            </span>
          )}
        </button>

        <button
          id="mobile-tab-flashcards"
          type="button"
          onClick={() => setActiveTab('flashcards')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'flashcards'
              ? 'text-[#1DB954] scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={18} />
          <span>闪卡</span>
        </button>

        <button
          id="mobile-tab-story"
          type="button"
          disabled={savedEntries.length === 0}
          onClick={() => setIsStoryModalOpen(true)}
          className="flex flex-col items-center gap-1 p-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-[#1DB954] disabled:opacity-40 transition-all cursor-pointer"
        >
          <Sparkles size={18} className="text-[#1DB954]" />
          <span>编故事</span>
        </button>
      </nav>

      {/* 4. Modals & Drawers */}
      {/* Language Selector Modal (Onboarding or Switcher) */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen || isInitialSetup}
        onClose={() => {
          setIsLangModalOpen(false);
          setIsInitialSetup(false);
        }}
        sourceLang={sourceLang}
        targetLang={targetLang}
        onSelectLanguages={handleSelectLanguages}
        isInitialSetup={isInitialSetup}
      />

      {/* Follow-up Interactive Chat Drawer */}
      <WordChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        entry={currentEntry}
        sourceLangObj={sourceLang}
        targetLangObj={targetLang}
        initialPrompt={chatInitialPrompt}
      />

      {/* Story Weaver Modal */}
      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        savedEntries={savedEntries}
        sourceLangObj={sourceLang}
        targetLangObj={targetLang}
      />
    </div>
  );
}
