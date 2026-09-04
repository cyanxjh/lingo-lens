import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Volume2,
  Film,
  Sparkles,
  Sliders,
  ExternalLink,
  Check,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Tv,
  Search,
  MessageSquare,
  ChevronRight,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { VideoClip, VideoClipSearchResult } from '../types';

interface VideoClipArtifactProps {
  initialTerm?: string;
  onAdoptDecision?: (accepted: boolean, preferredDuration: number) => void;
  standalone?: boolean;
}

const FEATURED_TERMS = [
  { term: 'bite the bullet', label: 'Bite the bullet (硬着头皮)', type: '日常习语' },
  { term: 'serendipity', label: 'Serendipity (妙手偶得)', type: '高级抽象' },
  { term: 'couch potato', label: 'Couch potato (沙发土豆)', type: '形象俚语' },
  { term: 'pragmatic', label: 'Pragmatic (务实实效)', type: '哲学/职场' },
  { term: 'cognitive dissonance', label: 'Cognitive Dissonance (认知失调)', type: '心理学' },
  { term: 'gaslighting', label: 'Gaslighting (煤气灯操纵)', type: '心理学/社会' },
  { term: 'procrastinate', label: 'Procrastinate (拖延顽疾)', type: '日常痛点' },
  { term: 'ambiguity', label: 'Ambiguity (模棱两可)', type: '高阶思辨' },
];

export const VideoClipArtifact: React.FC<VideoClipArtifactProps> = ({
  initialTerm = 'bite the bullet',
  onAdoptDecision,
  standalone = false,
}) => {
  const [currentTerm, setCurrentTerm] = useState(initialTerm);
  const [inputQuery, setInputQuery] = useState(initialTerm);
  const [searchResult, setSearchResult] = useState<VideoClipSearchResult | null>(null);
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3-5 seconds duration and trim controls
  const [clipDuration, setClipDuration] = useState<number>(4); // 3, 4, 5
  const [offsetStart, setOffsetStart] = useState<number>(0); // -1.0 to +1.0 seconds
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [activeTabMode, setActiveTabMode] = useState<'micro-clip' | 'youglish'>('micro-clip');

  // Feedback state for user evaluation of this prototype
  const [feedbackGiven, setFeedbackGiven] = useState<'like' | 'dislike' | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');

  // Key to force iframe reload when start/end/videoId changes
  const [playerKey, setPlayerKey] = useState(0);

  // Fetch video clips
  const fetchClips = async (termToSearch: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/video-clips/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: termToSearch }),
      });

      if (!res.ok) {
        throw new Error('Failed to load video clips');
      }

      const data: VideoClipSearchResult = await res.json();
      setSearchResult(data);
      setSelectedClipIndex(0);
      setClipDuration(data.defaultDuration || 4);
      setOffsetStart(0);
      setPlayerKey((prev) => prev + 1);
    } catch (e: any) {
      console.error(e);
      setError('无法获取该词的视频切片，请检查网络或重试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClips(currentTerm);
    setInputQuery(currentTerm);
  }, [currentTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setCurrentTerm(inputQuery.trim());
    }
  };

  const currentClip: VideoClip | undefined = searchResult?.clips[selectedClipIndex];

  // Calculate exact playback interval
  const calculatedStart = currentClip
    ? Math.max(0, Math.round(currentClip.startSeconds + offsetStart))
    : 30;
  const calculatedEnd = calculatedStart + clipDuration;

  // Clean YouTube embed URL with exact start/end and responsive playsinline
  const embedUrl = currentClip
    ? `https://www.youtube.com/embed/${currentClip.videoId}?start=${calculatedStart}&end=${calculatedEnd}&autoplay=1&mute=0&rel=0&playsinline=1&modestbranding=1`
    : '';

  const handleDurationChange = (d: number) => {
    setClipDuration(d);
    setPlayerKey((prev) => prev + 1);
  };

  const handleOffsetAdjust = (delta: number) => {
    setOffsetStart((prev) => {
      const next = Math.round((prev + delta) * 10) / 10;
      return Math.min(2, Math.max(-2, next));
    });
    setPlayerKey((prev) => prev + 1);
  };

  const handleReplay = () => {
    setPlayerKey((prev) => prev + 1);
    setIsPlaying(true);
  };

  return (
    <div
      id="video-clip-artifact-container"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden max-w-5xl mx-auto my-4 transition-all"
    >
      {/* 1. Artifact Prototype Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 sm:p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-red-600 text-white shadow-xs flex items-center gap-1">
                <Film size={12} />
                <span>原型实验方案 (Artifact)</span>
              </span>
              <span className="text-xs text-slate-300 font-medium">
                针对抽象/高级词汇难画准的问题
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>YouTube 真实语境 3-5 秒微视频片段截取</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              用真人母语者真实脱口而出的**微表情、语调重音、肢体手势与上下文对白**，代替模糊抽象的静态配图，3秒内直接击穿词汇灵魂。
            </p>
          </div>

          {/* Tab Switcher: Micro-Clip vs YouGlish */}
          <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTabMode('micro-clip')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTabMode === 'micro-clip'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Film size={13} />
              <span>3-5秒精准微切片</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTabMode('youglish')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTabMode === 'youglish'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Tv size={13} />
              <span>YouGlish 全网数万视频</span>
            </button>
          </div>
        </div>

        {/* Quick Word Selectors */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 shrink-0 font-medium">快速体验典型抽象词:</span>
          {FEATURED_TERMS.map((item) => (
            <button
              key={item.term}
              type="button"
              onClick={() => setCurrentTerm(item.term)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTerm.toLowerCase() === item.term.toLowerCase()
                  ? 'bg-white text-slate-900 shadow-sm scale-105'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] opacity-70 px-1 py-0.2 rounded bg-black/20">
                {item.type}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Term Search Input */}
        <form onSubmit={handleSearchSubmit} className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="测试任意抽象词或短语 (如: ambiguity, epiphany, imposter syndrome)..."
              className="w-full bg-slate-950/60 border border-white/20 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Search size={14} />
            <span>提取微片段</span>
          </button>
        </form>
      </div>

      {/* 2. Main Content Area */}
      <div className="p-4 sm:p-6 space-y-6">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center border border-red-200">
              <Film size={24} className="text-red-600 animate-spin" />
            </div>
            <p className="text-sm font-bold text-slate-800">正在智能检索 YouTube 最佳 3-5 秒高能片段...</p>
            <p className="text-xs text-slate-500">定位母语者说出该词的精准时间戳与微表情语境</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-red-700 text-center space-y-2">
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={() => fetchClips(currentTerm)}
              className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl"
            >
              重新加载
            </button>
          </div>
        ) : activeTabMode === 'micro-clip' ? (
          /* Micro-Clip Player Mode */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Main Column: 3-5s Video Player + Trim Controls */}
            <div className="lg:col-span-7 space-y-4">
              {/* Video Player Frame with 3-5s loop */}
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl aspect-[16/9] group">
                {currentClip ? (
                  <iframe
                    key={playerKey}
                    src={embedUrl}
                    title={currentClip.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    未找到可用切片
                  </div>
                )}

                {/* Duration Badge overlay */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-[11px] font-mono font-bold flex items-center gap-1.5 border border-white/10 pointer-events-none">
                  <Clock size={12} className="text-red-400" />
                  <span>
                    {calculatedStart}s - {calculatedEnd}s ({clipDuration}秒微循环)
                  </span>
                </div>

                {/* Target Word Overlay Banner */}
                <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs flex items-center justify-between border border-white/10">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span className="font-bold text-red-400 truncate">关键词聚焦:</span>
                    <span className="font-mono font-black text-amber-300 tracking-wide truncate">
                      {searchResult?.term}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={11} />
                    <span>单键重播</span>
                  </button>
                </div>
              </div>

              {/* Direct playback status & fast link to YouTube */}
              {currentClip && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                      已截取 <b>{calculatedStart}s - {calculatedEnd}s</b> 核心对白瞬间 ({clipDuration}秒)
                    </span>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${currentClip.videoId}&t=${calculatedStart}s`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>在新窗口观看 YouTube 原片</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              )}

              {/* Precise 3-5 Seconds Duration & Trimming Deck */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Sliders size={14} className="text-red-600" />
                    <span>微片段时长测试调节器 (你觉得几秒最直观？)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    当前: <b className="text-red-600 font-bold">{clipDuration} 秒</b>
                  </span>
                </div>

                {/* 3s / 4s / 5s Switcher */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDurationChange(3)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      clipDuration === 3
                        ? 'bg-red-600 border-red-600 text-white font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="text-sm font-black">3 秒极速</div>
                    <div className="text-[10px] opacity-80">闪现重音瞬记</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDurationChange(4)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      clipDuration === 4
                        ? 'bg-red-600 border-red-600 text-white font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="text-sm font-black">4 秒黄金律</div>
                    <div className="text-[10px] opacity-80">带出微表情与动作</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDurationChange(5)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      clipDuration === 5
                        ? 'bg-red-600 border-red-600 text-white font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="text-sm font-black">5 秒完整</div>
                    <div className="text-[10px] opacity-80">包含前后半句对白</div>
                  </button>
                </div>

                {/* Fine-tuning offset buttons */}
                <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                  <span className="text-[11px]">起始秒数微调:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOffsetAdjust(-0.5)}
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-mono text-[11px] cursor-pointer"
                      title="往前移 0.5 秒"
                    >
                      -0.5s
                    </button>
                    <span className="font-mono text-xs px-1 text-slate-700 font-semibold">
                      {offsetStart >= 0 ? `+${offsetStart}` : offsetStart}s
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOffsetAdjust(0.5)}
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-mono text-[11px] cursor-pointer"
                      title="往后移 0.5 秒"
                    >
                      +0.5s
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOffsetStart(0);
                        setPlayerKey((p) => p + 1);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-200 text-slate-600 hover:text-slate-900 text-[11px] cursor-pointer"
                    >
                      重置
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-scene switcher (if multiple clips exist for this word) */}
              {searchResult && searchResult.clips.length > 1 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Layers size={13} className="text-slate-500" />
                    <span>同一词汇在不同场景下的 3-5 秒片段切换:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResult.clips.map((clip, idx) => (
                      <button
                        key={clip.id}
                        type="button"
                        onClick={() => {
                          setSelectedClipIndex(idx);
                          setOffsetStart(0);
                          setPlayerKey((p) => p + 1);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          selectedClipIndex === idx
                            ? 'bg-red-50 border-red-300 ring-1 ring-red-400'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">{clip.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {clip.sourceType === 'movie'
                              ? '🎬 电影'
                              : clip.sourceType === 'speech'
                              ? '🎤 演讲'
                              : '📺 剧集'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{clip.sourceTitle}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Deep Linguistic Context Card & Vibe Analysis */}
            <div className="lg:col-span-5 space-y-4">
              {currentClip && (
                <>
                  {/* Dialogue & Subtitle Card with Word Spotlight */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <Volume2 size={15} className="text-amber-600" />
                        <span>真实对白原声台词</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300/50">
                        {currentClip.emotionalTone}
                      </span>
                    </div>

                    {/* Original Dialogue */}
                    <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200/60">
                      {currentClip.quoteOriginal.split('**').map((part, pIdx) =>
                        pIdx % 2 === 1 ? (
                          <span
                            key={pIdx}
                            className="bg-amber-300/90 text-amber-950 px-1.5 py-0.5 rounded font-black text-base shadow-2xs mx-0.5 inline-block"
                          >
                            {part}
                          </span>
                        ) : (
                          <span key={pIdx}>{part}</span>
                        )
                      )}
                    </div>

                    {/* Translation */}
                    <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed pl-1">
                      <span className="text-amber-800 font-bold mr-1">意译:</span>
                      <span>{currentClip.quoteTranslation}</span>
                    </div>

                    {/* Meta: Source & Speaker */}
                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        出处: <b className="text-slate-700 font-semibold">{currentClip.sourceTitle}</b>
                      </span>
                      <span>
                        角色: <b className="text-slate-700 font-semibold">{currentClip.speaker}</b>
                      </span>
                    </div>
                  </div>

                  {/* Why this 3-5s clip captures the essence (Vibe Analysis) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <Sparkles size={15} className="text-emerald-600" />
                      <span>💡 为什么这 3-5 秒比静态图片更懂精髓？</span>
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                      {currentClip.vibeAnalysis}
                    </p>

                    {searchResult?.summaryInsight && (
                      <p className="text-[11px] text-emerald-800 bg-white/70 p-2 rounded-xl border border-emerald-200/60">
                        {searchResult.summaryInsight}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Direct YouTube Link for Full Context */}
              {currentClip && (
                <a
                  href={`https://www.youtube.com/watch?v=${currentClip.videoId}&t=${calculatedStart}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>在 YouTube 原站观看该完整视频</span>
                  <ExternalLink size={13} className="text-slate-400" />
                </a>
              )}
            </div>
          </div>
        ) : (
          /* YouGlish All-Web Search Mode */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm">
                    YG
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      YouGlish 全网真实 YouTube 语境检索
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      即时索引全网几十万个带有「{currentTerm}」的 YouTube 原生视频片段
                    </p>
                  </div>
                </div>
                <a
                  href={`https://youglish.com/pronounce/${encodeURIComponent(currentTerm)}/english`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                >
                  <span>在 YouGlish 打开</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Embedded YouGlish Widget Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl aspect-[16/10] sm:aspect-[16/9]">
              <iframe
                src={`https://youglish.com/pronounce/${encodeURIComponent(
                  currentTerm
                )}/english?emb=1`}
                title={`YouGlish video for ${currentTerm}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <p className="text-xs text-slate-500 text-center">
              💡 提示: YouGlish 会自动跳转到包含该单词的准确秒数，并提供同步字幕。支持切换上一个/下一个视频片段。
            </p>
          </div>
        )}

        {/* 3. Artifact Review & Decision Panel (针对用户的诉求：看了效果后再定要不要应用) */}
        <div
          id="artifact-evaluation-box"
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/70 border-2 border-indigo-200 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 uppercase tracking-wider">
                <HelpCircle size={15} className="text-indigo-600" />
                <span>原型评估：您觉得这个 3-5 秒微视频片段方案如何？</span>
              </div>
              <p className="text-xs text-slate-600">
                请体验上方不同词汇和 3秒/4秒/5秒 切换后，告诉我们您的真实感受：
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFeedbackGiven('like');
                  onAdoptDecision?.(true, clipDuration);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  feedbackGiven === 'like'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
                }`}
              >
                <ThumbsUp size={13} />
                <span>方案很好，建议应用</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFeedbackGiven('dislike');
                  onAdoptDecision?.(false, clipDuration);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  feedbackGiven === 'dislike'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white hover:bg-rose-50 text-rose-800 border border-rose-300'
                }`}
              >
                <ThumbsDown size={13} />
                <span>还不够理想，需再调整</span>
              </button>
            </div>
          </div>

          {feedbackGiven && (
            <div className="text-xs text-indigo-900 bg-white/80 p-2.5 rounded-xl border border-indigo-200 flex items-center gap-2">
              <Check size={14} className="text-emerald-600 shrink-0" />
              <span>
                已记录您的偏好反馈（当前设定截取时长为 <b>{clipDuration} 秒</b>）。您可以随时继续在上方切换更多词汇测试！
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
