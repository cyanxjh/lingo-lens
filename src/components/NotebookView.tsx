import React, { useState } from 'react';
import { DictionaryEntry, Language } from '../types';
import { AudioButton } from './AudioButton';
import {
  BookMarked,
  BookOpen,
  Layers,
  Search,
  Trash2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  Filter,
  Plus,
} from 'lucide-react';

interface NotebookViewProps {
  entries: DictionaryEntry[];
  targetLangObj: Language;
  sourceLangObj: Language;
  onSelectEntry: (entry: DictionaryEntry) => void;
  onRemoveEntry: (id: string) => void;
  onToggleMastered: (id: string, mastered: boolean) => void;
  onStartFlashcards: () => void;
  onStartStory: () => void;
  onGoToSearch: () => void;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  entries,
  targetLangObj,
  sourceLangObj,
  onSelectEntry,
  onRemoveEntry,
  onToggleMastered,
  onStartFlashcards,
  onStartStory,
  onGoToSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMastered, setFilterMastered] = useState<'all' | 'learning' | 'mastered'>('all');

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.normalizedTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.naturalExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.query.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMastered === 'learning') return !entry.mastered;
    if (filterMastered === 'mastered') return !!entry.mastered;
    return true;
  });

  const masteredCount = entries.filter((e) => e.mastered).length;
  const masteryPercent = entries.length > 0 ? Math.round((masteredCount / entries.length) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Top Banner & Quick Launchers */}
      <div className="bg-[#1DB954] rounded-3xl p-5 md:p-6 text-white shadow-xl shadow-emerald-600/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-md">
                <BookMarked size={18} className="text-white" />
              </span>
              <span className="text-xs uppercase tracking-wider font-bold text-white/90">
                随身生词本
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              复习与记忆工坊
            </h2>
            <p className="text-emerald-100 text-xs md:text-sm mt-1">
              累计收藏 {entries.length} 个词汇 · 掌握率 {masteryPercent}%
            </p>
          </div>

          {/* Action Launchers: Story Weaver & Flashcards */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="notebook-story-weaver-btn"
              type="button"
              disabled={entries.length === 0}
              onClick={onStartStory}
              className="px-4 py-2.5 rounded-2xl bg-white text-[#1DB954] hover:bg-emerald-50 font-bold text-xs md:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <Sparkles size={16} className="text-[#1DB954]" />
              <span>编故事记忆</span>
            </button>

            <button
              id="notebook-flashcards-mode-btn"
              type="button"
              disabled={entries.length === 0}
              onClick={onStartFlashcards}
              className="px-4 py-2.5 rounded-2xl bg-[#1ed760] hover:bg-emerald-300 text-emerald-950 font-black text-xs md:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <Layers size={16} />
              <span>学习模式 (闪卡)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="notebook-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索笔记本中的词语或中文释义..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs md:text-sm focus:outline-none focus:border-[#1DB954] shadow-xs"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterMastered('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterMastered === 'all'
                ? 'bg-white text-[#1DB954] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            全部 ({entries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMastered('learning')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterMastered === 'learning'
                ? 'bg-white text-[#1DB954] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            需复习 ({entries.length - masteredCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMastered('mastered')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterMastered === 'mastered'
                ? 'bg-white text-[#1DB954] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            已掌握 ({masteredCount})
          </button>
        </div>
      </div>

      {/* Vocabulary Cards List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-[#1DB954] flex items-center justify-center mx-auto">
            <BookMarked size={30} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {entries.length === 0 ? '笔记本还是空的' : '未找到匹配的词汇'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {entries.length === 0
              ? '在词典搜索任意单词、短语或句子后，点击右上角“存笔记”，即可随时在这里复习、翻闪卡或编故事！'
              : '尝试输入不同的关键词检索。'}
          </p>
          {entries.length === 0 && (
            <button
              onClick={onGoToSearch}
              className="mt-2 px-5 py-2.5 rounded-2xl bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              立刻去查词
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              id={`notebook-card-${entry.id}`}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between gap-3 group"
            >
              {/* Header: Term, Phonetic, Audio, Image Thumbnail */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {entry.imageUrl && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={entry.imageUrl}
                        alt={entry.normalizedTerm}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h4
                        onClick={() => onSelectEntry(entry)}
                        className="text-lg font-black text-slate-900 group-hover:text-[#1DB954] transition-colors truncate cursor-pointer"
                        title="点击查看完整释义"
                      >
                        {entry.normalizedTerm}
                      </h4>
                    </div>

                    {entry.phonetic && (
                      <div className="text-xs font-mono text-emerald-800">
                        {entry.phonetic}
                      </div>
                    )}

                    <div className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {entry.naturalExplanation}
                    </div>
                  </div>
                </div>

                <AudioButton
                  text={entry.normalizedTerm}
                  bcp47={targetLangObj.bcp47}
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                />
              </div>

              {/* Footer: Mastered toggle, View full, Delete */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onToggleMastered(entry.id, !entry.mastered)}
                  className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                    entry.mastered
                      ? 'text-[#1DB954] font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {entry.mastered ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <Circle size={15} />
                  )}
                  <span>{entry.mastered ? '已掌握' : '标为掌握'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectEntry(entry)}
                    className="text-[#1DB954] hover:text-[#169c46] font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>详情</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveEntry(entry.id)}
                    title="从笔记本移除"
                    className="p-1 rounded-lg text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
