import React, { useState } from 'react';
import { ExternalLink, Volume2, Sparkles, CheckCircle2, Globe, Search } from 'lucide-react';

interface YouglishContextViewerProps {
  initialTerm: string;
  standalone?: boolean;
}

const POPULAR_PRACTICE_TERMS = [
  { term: 'bite the bullet', label: 'Bite the bullet (迎难而上)' },
  { term: 'serendipity', label: 'Serendipity (不期而遇的美好)' },
  { term: 'couch potato', label: 'Couch potato (沙发土豆)' },
  { term: 'cognitive dissonance', label: 'Cognitive Dissonance (认知失调)' },
  { term: 'gaslighting', label: 'Gaslighting (煤气灯操纵)' },
  { term: 'procrastinate', label: 'Procrastinate (习惯性拖延)' },
  { term: 'ambiguity', label: 'Ambiguity (模棱两可)' },
  { term: 'pragmatic', label: 'Pragmatic (务实实效)' },
];

export const YouglishContextViewer: React.FC<YouglishContextViewerProps> = ({
  initialTerm,
  standalone = false,
}) => {
  const [term, setTerm] = useState(initialTerm || 'bite the bullet');
  const [inputVal, setInputVal] = useState(initialTerm || 'bite the bullet');
  const [accent, setAccent] = useState<'all' | 'us' | 'uk' | 'aus'>('all');

  const cleanTerm = term.trim();
  const accentPath = accent === 'all' ? 'english' : `english/${accent}`;
  const embedUrl = `https://youglish.com/pronounce/${encodeURIComponent(cleanTerm)}/${accentPath}?emb=1`;
  const externalUrl = `https://youglish.com/pronounce/${encodeURIComponent(cleanTerm)}/${accentPath}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setTerm(inputVal.trim());
    }
  };

  const handleSelectTerm = (selected: string) => {
    setTerm(selected);
    setInputVal(selected);
  };

  return (
    <div
      id="youglish-context-viewer"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-lg shadow-slate-200/50 p-5 md:p-6 space-y-5"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center font-black text-base shadow-sm">
            YG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black text-slate-900">
                母语者真实语境发音 (YouGlish 官方原声检索)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                100% 字幕精确对齐
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              自动检索 YouTube 海量真实母语视频，精准跳转至说出「{cleanTerm}」的前 2 秒，配实时黄色字幕高亮。
            </p>
          </div>
        </div>

        {/* External Link */}
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/70 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>在 YouGlish 官方原站打开</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Standalone search & Accent selector toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
        {standalone ? (
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="搜索任意英文单词或短语..."
                className="w-full pl-9 pr-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              检索原声
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Volume2 size={15} className="text-red-600" />
            <span>当前检索词汇：</span>
            <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {cleanTerm}
            </span>
          </div>
        )}

        {/* Accent Filter */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Globe size={13} />
            <span>口音：</span>
          </span>
          {(['all', 'us', 'uk', 'aus'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setAccent(item)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                accent === item
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {item === 'all' ? '全部口音' : item === 'us' ? '美音 (US)' : item === 'uk' ? '英音 (UK)' : '澳音 (AUS)'}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Quick Terms if in standalone mode */}
      {standalone && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1">🔥 热门探索：</span>
          {POPULAR_PRACTICE_TERMS.map((pt) => (
            <button
              key={pt.term}
              type="button"
              onClick={() => handleSelectTerm(pt.term)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                cleanTerm.toLowerCase() === pt.term.toLowerCase()
                  ? 'bg-red-100 text-red-800 font-bold border border-red-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      )}

      {/* Embedded YouGlish Video Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl aspect-[16/10] sm:aspect-[16/9]">
        <iframe
          key={`${cleanTerm}-${accent}`}
          src={embedUrl}
          title={`YouGlish video for ${cleanTerm}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Practical Guide & Technical Assurance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-slate-800">官方字幕帧对齐</div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              根据全网英文字幕库精确索引，直接播放含该词的完整句子，杜绝无关片头。
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-xs">
          <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-slate-800">逐词高亮与即时快进</div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              播放器下方实时滚动显示字幕，说话瞬间标黄高亮，可点击“Next”无缝换人听。
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-xs">
          <Volume2 size={16} className="text-indigo-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-slate-800">多元母语语境</div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              涵盖影视、演讲、生活访谈等多样场景，真实体会不同语速、连读与情感语气。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
