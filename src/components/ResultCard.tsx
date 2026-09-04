import React, { useState, useEffect } from 'react';
import {
  DictionaryEntry,
  Language,
  TOP_LANGUAGES,
} from '../types';
import { AudioButton } from './AudioButton';
import {
  Bookmark,
  BookmarkCheck,
  MessageCircleQuestion,
  Sparkles,
  Layers,
  Compass,
  Smile,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Share2,
  Check,
  Maximize2,
  X,
  Palette,
  Lightbulb,
  Eye,
  Camera,
  Volume2,
} from 'lucide-react';
import { YouglishContextViewer } from './YouglishContextViewer';

interface ResultCardProps {
  entry: DictionaryEntry;
  targetLangObj: Language;
  sourceLangObj: Language;
  isSaved: boolean;
  onToggleSave: (entry: DictionaryEntry) => void;
  onOpenChat: (entry: DictionaryEntry, initialPrompt?: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  entry,
  targetLangObj,
  sourceLangObj,
  isSaved,
  onToggleSave,
  onOpenChat,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSlowMode, setIsSlowMode] = useState(false);

  // Multi-style & Variation states
  const [currentImageUrl, setCurrentImageUrl] = useState(entry.imageUrl);
  const [currentStyle, setCurrentStyle] = useState<'comic' | 'vector' | 'cinematic'>('comic');
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [visualMode, setVisualMode] = useState<'image' | 'video'>('image'); // Default to AI visual memory card for reliable, instant metaphor anchoring

  // When entry changes, reset image states
  useEffect(() => {
    setCurrentImageUrl(entry.imageUrl);
    setCurrentStyle('comic');
    setImageLoaded(false);
    setImageError(false);
  }, [entry.id, entry.imageUrl]);

  const handleCopy = () => {
    const textToCopy = `${entry.normalizedTerm}\n${entry.phonetic}\n${entry.naturalExplanation}\n\n例句:\n1. ${entry.examples[0]?.target || ''} - ${entry.examples[0]?.translation || ''}\n2. ${entry.examples[1]?.target || ''} - ${entry.examples[1]?.translation || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Change style or generate a new random seed variation
  const handleRegenerateImage = async (styleToUse?: 'comic' | 'vector' | 'cinematic') => {
    const selectedStyle = styleToUse || currentStyle;
    if (styleToUse) {
      setCurrentStyle(styleToUse);
    }
    setIsRegeneratingImage(true);
    setImageLoaded(false);
    setImageError(false);

    try {
      const newSeed = Math.floor(Math.random() * 1000000);
      const res = await fetch('/api/dictionary/regenerate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: entry.normalizedTerm,
          imagePrompt: entry.imagePrompt,
          style: selectedStyle,
          seed: newSeed,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          setCurrentImageUrl(data.imageUrl);
        }
      } else {
        // Direct fallback generation with timestamp seed
        const seed = Date.now();
        const base = encodeURIComponent(
          `${entry.imagePrompt || entry.normalizedTerm}, crisp detailed illustration, no blur`
        );
        setCurrentImageUrl(`https://image.pollinations.ai/prompt/${base}?width=1024&height=768&model=flux&seed=${seed}&nologo=true`);
      }
    } catch (e) {
      console.warn('Failed to regenerate image variation:', e);
      setImageError(true);
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  return (
    <div
      id={`result-card-${entry.id}`}
      className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300"
    >
      {/* 1. Header Section: Term, Pronunciation, Tags, Actions */}
      <div className="p-5 md:p-6 bg-gradient-to-br from-[#1DB954]/10 via-emerald-500/5 to-teal-500/10 border-b border-emerald-100/70">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Meta Tags: Target language, part of speech */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200/60">
                <span>{targetLangObj.flag}</span>
                <span>{targetLangObj.name}</span>
              </span>
              {entry.partOfSpeech && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {entry.partOfSpeech}
                </span>
              )}
            </div>

            {/* Target Word / Phrase Heading */}
            <div className="flex flex-wrap items-baseline gap-3">
              <h1
                id="result-normalized-term"
                className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight break-words"
              >
                {entry.normalizedTerm}
              </h1>

              {entry.phonetic && (
                <span
                  id="result-phonetic"
                  className="text-sm md:text-base font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/50"
                >
                  {entry.phonetic}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Save to Notebook, Copy, Slow toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="toggle-slow-audio-btn"
              type="button"
              onClick={() => setIsSlowMode(!isSlowMode)}
              title={isSlowMode ? '当前为慢速发音 (0.7x)' : '切换为慢速朗读'}
              className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSlowMode
                  ? 'bg-[#1DB954] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {isSlowMode ? '慢速 0.7x' : '原速'}
            </button>

            <button
              id="copy-result-btn"
              type="button"
              onClick={handleCopy}
              title="复制释义与例句"
              className="p-2 rounded-xl bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check size={18} className="text-[#1DB954]" /> : <Share2 size={18} />}
            </button>

            <button
              id="bookmark-word-btn"
              type="button"
              onClick={() => onToggleSave(entry)}
              title={isSaved ? '从笔记本移除' : '保存到生词笔记本'}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                isSaved
                  ? 'bg-[#1DB954] text-white border-[#169c46] shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-[#1DB954] border-slate-200'
              }`}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              <span className="hidden sm:inline">{isSaved ? '已收藏' : '存笔记'}</span>
            </button>
          </div>
        </div>

        {/* Big tactile audio pronunciation button for the word itself */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <AudioButton
            id="main-word-pronounce-btn"
            text={entry.normalizedTerm}
            bcp47={targetLangObj.bcp47}
            size="lg"
            variant="primary"
            label="点击发音"
            slow={isSlowMode}
            className="shadow-md"
          />

          <button
            id="open-chat-from-header-btn"
            type="button"
            onClick={() => onOpenChat(entry)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold bg-white text-[#1DB954] hover:bg-emerald-50 border border-emerald-200 shadow-sm transition-all cursor-pointer hover:shadow"
          >
            <MessageCircleQuestion size={18} />
            <span>问问 AI</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-6">
        {/* 2. Natural Language Explanation in User's Native Language */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
            <span>母语自然释义 ({sourceLangObj.name})</span>
          </div>
          <div
            id="result-natural-explanation"
            className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-slate-900 text-base md:text-lg font-medium leading-relaxed"
          >
            {entry.naturalExplanation}
          </div>
        </div>

        {/* 3. Visual Concept Deck: AI Visual Memory Anchor vs Native Context Audio/Video */}
        <div id="visual-mnemonic-section" className="space-y-4">
          {/* Top visual mode switcher pill */}
          <div className="flex flex-wrap items-center justify-between p-1.5 rounded-2xl bg-slate-100 border border-slate-200/90 text-xs gap-2">
            <div className="flex items-center gap-1">
              <button
                id="tab-visual-image-btn"
                type="button"
                onClick={() => setVisualMode('image')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  visualMode === 'image'
                    ? 'bg-[#1DB954] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Sparkles size={14} />
                <span>🖼️ AI 视觉记忆锚点卡 (直观秒记)</span>
              </button>

              <button
                id="tab-visual-youglish-btn"
                type="button"
                onClick={() => setVisualMode('video')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  visualMode === 'video'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Volume2 size={14} />
                <span>🗣️ 母语者真实原声 (YouGlish 字幕对齐)</span>
              </button>
            </div>

            <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium px-2">
              {visualMode === 'image'
                ? '夸张漫画 / 极简矢量 / 写实情境，快速建立概念锚点'
                : '官方英文字幕精确对齐，自动跳过无关片头'}
            </span>
          </div>

          {visualMode === 'video' ? (
            <YouglishContextViewer initialTerm={entry.normalizedTerm} />
          ) : (
            <div className="space-y-3">
              {/* Header Bar with Style Selectors & Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 uppercase tracking-wider">
                  <Sparkles size={15} className="text-[#1DB954]" />
                  <span>AI 视觉记忆锚点卡 (直观秒记)</span>
                </div>

            {/* Controls: Styles & Next Variation */}
            <div className="flex items-center gap-1.5">
              {/* Style Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-[11px] font-medium">
                <button
                  id="style-comic-btn"
                  type="button"
                  onClick={() => handleRegenerateImage('comic')}
                  disabled={isRegeneratingImage}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    currentStyle === 'comic'
                      ? 'bg-white text-emerald-950 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="夸张联想漫画风：最具记忆冲击力，适合强力联想背词"
                >
                  <Palette size={12} className="text-[#1DB954]" />
                  <span>夸张漫画</span>
                </button>

                <button
                  id="style-vector-btn"
                  type="button"
                  onClick={() => handleRegenerateImage('vector')}
                  disabled={isRegeneratingImage}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    currentStyle === 'vector'
                      ? 'bg-white text-emerald-950 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="现代极简矢量风：线条轮廓清晰锐利，无模糊"
                >
                  <Eye size={12} className="text-teal-600" />
                  <span>极简矢量</span>
                </button>

                <button
                  id="style-cinematic-btn"
                  type="button"
                  onClick={() => handleRegenerateImage('cinematic')}
                  disabled={isRegeneratingImage}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    currentStyle === 'cinematic'
                      ? 'bg-white text-emerald-950 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="真实写实情境照：还原现实生活场景"
                >
                  <Camera size={12} className="text-indigo-600" />
                  <span>写实情境</span>
                </button>
              </div>

              {/* Refresh / Next Variation button */}
              <button
                id="refresh-image-variation-btn"
                type="button"
                onClick={() => handleRegenerateImage()}
                disabled={isRegeneratingImage}
                title="换一个构图角度 / 换一张"
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#1DB954] border border-slate-200 transition-all font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={12} className={isRegeneratingImage ? 'animate-spin text-[#1DB954]' : ''} />
                <span className="hidden sm:inline">换一张</span>
              </button>

              {/* Lightbox button */}
              <button
                id="open-image-lightbox-btn"
                type="button"
                onClick={() => setShowLightbox(true)}
                title="全屏查看 1024px 高清原图"
                className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Main Image Display Box */}
          <div
            id="result-ai-image-container"
            onClick={() => imageLoaded && setShowLightbox(true)}
            className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-950/5 group shadow-xs cursor-zoom-in transition-all"
          >
            {(!imageLoaded || isRegeneratingImage) && !imageError && (
              <div className="h-64 sm:h-72 flex flex-col items-center justify-center text-slate-500 gap-3 bg-gradient-to-br from-emerald-50/60 via-slate-50 to-teal-50/60 animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-emerald-100">
                  <Sparkles size={20} className="text-[#1DB954] animate-spin" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-slate-800">正在生成高精度视觉记忆画面...</p>
                  <p className="text-[11px] text-slate-500">
                    {currentStyle === 'comic' ? '采用生动夸张漫画联想风格' : currentStyle === 'vector' ? '采用清晰锐利矢量构图' : '采用真实生活情境光影'}
                  </p>
                </div>
              </div>
            )}

            {imageError ? (
              <div className="h-52 flex flex-col items-center justify-center text-slate-500 gap-2 p-6 text-center bg-slate-50">
                <AlertCircle size={28} className="text-amber-500" />
                <p className="text-xs font-medium">当前画面载入稍慢</p>
                <button
                  type="button"
                  onClick={() => handleRegenerateImage()}
                  className="px-3 py-1.5 bg-[#1DB954] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#169c46] cursor-pointer"
                >
                  点击重新生成
                </button>
              </div>
            ) : (
              <div className="relative">
                <img
                  id="result-concept-image"
                  src={currentImageUrl}
                  alt={entry.normalizedTerm}
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-full max-h-[420px] aspect-[16/10] object-contain sm:object-cover bg-slate-900/5 transition-transform duration-500 group-hover:scale-[1.01] ${
                    imageLoaded && !isRegeneratingImage ? 'block' : 'hidden'
                  }`}
                />

                {/* Hover overlay prompt */}
                {imageLoaded && !isRegeneratingImage && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
                    <div className="text-white flex items-center justify-between w-full text-xs">
                      <span className="font-medium flex items-center gap-1.5">
                        <Maximize2 size={13} /> 点击展开 1024px 超清全屏查看
                      </span>
                      <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px]">
                        {currentStyle === 'comic' ? '夸张漫画' : currentStyle === 'vector' ? '极简矢量' : '写实情境'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dedicated Visual Memory Anchor Panel (为什么这么画？怎么联想？) */}
          <div
            id="visual-memory-hook-card"
            className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-slate-800 space-y-2.5 transition-all shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Lightbulb size={15} className="text-amber-600 shrink-0" />
                <span>💡 视觉记忆锚点与秒记秘诀</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/60">
                科学图像记忆法
              </span>
            </div>

            {/* Metaphor explanation */}
            <div className="text-xs md:text-sm text-slate-800 leading-relaxed font-medium">
              <span className="font-bold text-amber-950 mr-1.5">🎯 核心隐喻:</span>
              {entry.visualMemoryHook?.metaphor || `将「${entry.normalizedTerm}」的核心内涵具体化为生动的视觉符号。`}
            </div>

            {/* Mnemonic Hook */}
            <div className="text-xs md:text-sm text-slate-800 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
              <span className="font-bold text-emerald-800 mr-1.5">🧠 秒记诀窍:</span>
              {entry.visualMemoryHook?.mnemonicTip || '记住画面中极具冲击力的反差与互动细节，下次看到该词即可在脑中迅速唤醒具象场景！'}
            </div>

            {/* Visual Focal Points Tags */}
            {entry.visualMemoryHook?.focalPoints && entry.visualMemoryHook.focalPoints.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-[11px] font-bold text-amber-900">🔍 画面关键线索:</span>
                {entry.visualMemoryHook.focalPoints.map((point, pIdx) => (
                  <span
                    key={pIdx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100/80 border border-amber-300/70 text-amber-900 text-[11px] font-medium"
                  >
                    <span>•</span>
                    <span>{point}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>

        {/* 4. Two Contextual Example Sentences with Pronunciation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Layers size={14} className="text-[#1DB954]" />
              <span>真实地道例句 (配自然原声朗读)</span>
            </div>
            <span className="text-slate-400 text-[11px] lowercase">0 延迟即点即读</span>
          </div>

          <div className="grid gap-2.5">
            {entry.examples.map((example, idx) => (
              <div
                key={idx}
                id={`example-item-${idx}`}
                className="p-3.5 md:p-4 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-200/80 transition-all flex items-start gap-3 group"
              >
                <div className="pt-0.5 shrink-0">
                  <AudioButton
                    id={`example-audio-${idx}`}
                    text={example.target}
                    bcp47={targetLangObj.bcp47}
                    size="sm"
                    variant="secondary"
                    slow={isSlowMode}
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-sm md:text-base font-semibold text-slate-900 leading-snug group-hover:text-emerald-950">
                    {example.target}
                  </div>
                  <div className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                    {example.translation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Casual, Friend-like Usage Notes (Culture, Scenarios, Tone, Related Words) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Smile size={14} className="text-[#1DB954]" />
            <span>朋友视角：像母语者一样懂它（拒绝教科书）</span>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#1DB954]/10 to-teal-500/10 border border-emerald-200/70 p-4 md:p-5 space-y-3 text-slate-800">
            {/* Cultural Vibe & Context */}
            <div>
              <div className="text-xs font-black text-emerald-950 flex items-center gap-1 mb-1">
                <span>💬 文化语境与感觉：</span>
              </div>
              <p
                id="result-cultural-vibe"
                className="text-sm leading-relaxed text-slate-700"
              >
                {entry.funUsageNotes.culturalVibe}
              </p>
            </div>

            {/* Scenarios & Tone chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-100">
                <div className="text-[11px] font-bold text-slate-500 mb-0.5">
                  🎯 什么时候说 / 适用场景：
                </div>
                <div className="text-xs text-slate-800 font-medium">
                  {entry.funUsageNotes.scenarios}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-100">
                <div className="text-[11px] font-bold text-slate-500 mb-0.5">
                  🎭 说话语气与态度：
                </div>
                <div className="text-xs text-emerald-900 font-semibold">
                  {entry.funUsageNotes.tone}
                </div>
              </div>
            </div>

            {/* Related Words & Confusing Differences */}
            {entry.funUsageNotes.relatedWords &&
              entry.funUsageNotes.relatedWords.length > 0 && (
                <div className="pt-2 border-t border-emerald-200/60">
                  <div className="text-xs font-black text-emerald-950 mb-2 flex items-center gap-1">
                    <span>⚡ 别用混！相似词 / 易混词对比：</span>
                  </div>

                  <div className="space-y-1.5">
                    {entry.funUsageNotes.relatedWords.map((item, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-white/90 border border-emerald-100 text-xs flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2"
                      >
                        <span className="font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md self-start shrink-0">
                          {item.word}
                        </span>
                        <span className="text-slate-600 font-normal">
                          {item.difference}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* 6. Quick Interactive Chat Triggers */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/70 p-4 rounded-2xl">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-800">对这个词还有好奇？</span>{' '}
            AI 导师随时在线为您深入解答
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onOpenChat(entry, '在正式邮件或工作场景能用这个词吗？')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:text-[#1DB954] transition-all cursor-pointer"
            >
              💼 职场适用吗？
            </button>
            <button
              type="button"
              onClick={() => onOpenChat(entry, '能再给我造一个幽默搞笑的日常生活对话例句吗？')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:text-[#1DB954] transition-all cursor-pointer"
            >
              😄 再造个幽默句
            </button>
            <button
              type="button"
              onClick={() => onOpenChat(entry)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1DB954] hover:bg-[#1ed760] text-white shadow-sm transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <MessageCircleQuestion size={14} />
              <span>深度提问</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Full-Screen 1024px High-Res Lightbox Modal */}
      {showLightbox && (
        <div
          id="image-lightbox-modal"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-black text-white">{entry.normalizedTerm}</span>
                {entry.phonetic && (
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
                    {entry.phonetic}
                  </span>
                )}
                <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                  {currentStyle === 'comic' ? '🎨 夸张联想漫画' : currentStyle === 'vector' ? '📐 极简矢量' : '📷 真实情境'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRegenerateImage()}
                  disabled={isRegeneratingImage}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw size={13} className={isRegeneratingImage ? 'animate-spin text-[#1DB954]' : ''} />
                  <span>换一张</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLightbox(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="关闭"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Image Area */}
            <div className="flex-1 min-h-0 bg-black/60 flex items-center justify-center p-2 sm:p-4 overflow-auto">
              <img
                src={currentImageUrl}
                alt={entry.normalizedTerm}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-lg border border-white/5"
              />
            </div>

            {/* Modal Footer: Mnemonic Hook Insight */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Lightbulb size={14} />
                <span>视觉记忆秘诀 (Visual Mnemonic Hook)</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-medium">
                {entry.visualMemoryHook?.mnemonicTip || entry.visualMemoryHook?.metaphor || entry.naturalExplanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
