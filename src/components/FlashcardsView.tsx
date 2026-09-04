import React, { useState } from 'react';
import { DictionaryEntry, Language } from '../types';
import { AudioButton } from './AudioButton';
import {
  RotateCw,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Sparkles,
  Layers,
  Volume2,
  RefreshCw,
} from 'lucide-react';

interface FlashcardsViewProps {
  cards: DictionaryEntry[];
  targetLangObj: Language;
  sourceLangObj: Language;
  onExit: () => void;
  onToggleMastered: (id: string, mastered: boolean) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  cards,
  targetLangObj,
  sourceLangObj,
  onExit,
  onToggleMastered,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(
    new Set(cards.filter((c) => c.mastered).map((c) => c.id))
  );
  const [isFinished, setIsFinished] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-4 max-w-md mx-auto my-8">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
          <Layers size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-900">笔记本中暂无闪卡</h3>
        <p className="text-sm text-slate-500">
          在词典查词后，点击“存笔记”按钮收藏任意词汇或短语，即可在这里启动智能翻转闪卡学习！
        </p>
        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          去查词添加
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (mastered?: boolean) => {
    if (typeof mastered === 'boolean' && currentCard) {
      const nextSet = new Set(masteredIds);
      if (mastered) {
        nextSet.add(currentCard.id);
        onToggleMastered(currentCard.id, true);
      } else {
        nextSet.delete(currentCard.id);
        onToggleMastered(currentCard.id, false);
      }
      setMasteredIds(nextSet);
    }

    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  };

  if (isFinished) {
    const totalMastered = cards.filter((c) => masteredIds.has(c.id)).length;
    const masteryRate = Math.round((totalMastered / cards.length) * 100);

    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl text-center space-y-6 max-w-md mx-auto my-8 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-[#1DB954] text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
          <Trophy size={40} />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
            学习完成！
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            太棒了！本轮复习圆满结束
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            坚持让知识形成长期记忆，AI 随时陪伴你的多语种进阶！
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-black text-[#1DB954]">{cards.length}</div>
            <div className="text-xs text-slate-500">已学习词汇</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-[#1DB954]">{masteryRate}%</div>
            <div className="text-xs text-slate-500">掌握率</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            id="restart-flashcards-btn"
            type="button"
            onClick={handleRestart}
            className="flex-1 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-sm border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>再练一轮</span>
          </button>
          <button
            id="finish-flashcards-exit-btn"
            type="button"
            onClick={onExit}
            className="flex-1 py-3 rounded-2xl bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            返回笔记本
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-10">
      {/* Top Controls & Progress Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="exit-flashcards-btn"
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>退出学习</span>
        </button>

        <div className="flex-1 px-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
            <span>
              卡片 {currentIndex + 1} / {cards.length}
            </span>
            <span className="text-[#1DB954]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#1DB954] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        id="flashcard-interactive-box"
        className="w-full h-[460px] md:h-[500px] perspective-1000 cursor-pointer select-none"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card FRONT: Target Term, Phonetic, AI Concept Image, Audio, Hint */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col justify-between overflow-hidden">
            {/* Front Header */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 flex items-center gap-1">
                <span>{targetLangObj.flag}</span>
                <span>正面 · 目标词</span>
              </span>

              <AudioButton
                text={currentCard.normalizedTerm}
                bcp47={targetLangObj.bcp47}
                size="md"
                variant="secondary"
              />
            </div>

            {/* Front Content: Concept Image & Term */}
            <div className="my-auto text-center space-y-4">
              {currentCard.imageUrl && (
                <div className="w-full h-44 md:h-52 rounded-2xl overflow-hidden shadow-inner border border-slate-100 mx-auto bg-slate-100 relative group">
                  <img
                    src={currentCard.imageUrl}
                    alt={currentCard.normalizedTerm}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-lg bg-black/60 text-[10px] text-white backdrop-blur-xs">
                    AI 概念构图
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  {currentCard.normalizedTerm}
                </h2>
                {currentCard.phonetic && (
                  <p className="text-sm font-mono text-emerald-800 mt-1">
                    {currentCard.phonetic}
                  </p>
                )}
                {currentCard.partOfSpeech && (
                  <span className="inline-block mt-1 text-xs text-slate-400 font-medium">
                    {currentCard.partOfSpeech}
                  </span>
                )}
              </div>
            </div>

            {/* Front Footer: Tap to flip hint */}
            <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
              <RotateCw size={13} className="text-[#1DB954] animate-spin-slow" />
              <span>点击卡片任意处翻至背面查看释义</span>
            </div>
          </div>

          {/* Card BACK: Native Explanation, Examples, Audio */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-[#1DB954]/5 via-emerald-500/10 to-teal-500/5 rounded-3xl p-6 shadow-xl border border-emerald-200/80 flex flex-col justify-between overflow-y-auto">
            {/* Back Header */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1DB954] text-white flex items-center gap-1">
                <span>{sourceLangObj.flag}</span>
                <span>背面 · 母语释义</span>
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-700">
                  {currentCard.normalizedTerm}
                </span>
                <AudioButton
                  text={currentCard.normalizedTerm}
                  bcp47={targetLangObj.bcp47}
                  size="sm"
                  variant="primary"
                />
              </div>
            </div>

            {/* Back Content: Explanation & Examples */}
            <div className="my-auto space-y-4 text-left py-2">
              <div className="p-4 rounded-2xl bg-white/90 border border-emerald-100 shadow-xs">
                <div className="text-[11px] font-bold text-emerald-800 mb-1">
                  💡 母语自然解释
                </div>
                <div className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                  {currentCard.naturalExplanation}
                </div>
              </div>

              {currentCard.examples && currentCard.examples.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">
                    例句回放
                  </div>
                  {currentCard.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/80 border border-slate-200/80 text-xs space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900 leading-tight">
                          {ex.target}
                        </span>
                        <AudioButton
                          text={ex.target}
                          bcp47={targetLangObj.bcp47}
                          size="sm"
                          variant="ghost"
                          className="p-1 shrink-0"
                        />
                      </div>
                      <div className="text-slate-600">{ex.translation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Back Footer: Flip back hint */}
            <div className="text-center pt-2 border-t border-emerald-200/60 flex items-center justify-center gap-1 text-xs text-emerald-800 font-medium">
              <RotateCw size={13} />
              <span>点击翻回正面</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Response Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          id="review-again-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext(false);
          }}
          className="py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold text-sm shadow-sm hover:shadow active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <HelpCircle size={18} className="text-amber-500" />
          <span>还需复习</span>
        </button>

        <button
          id="mastered-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext(true);
          }}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 size={18} />
          <span>已经掌握</span>
        </button>
      </div>

      {/* Card Navigation Arrows */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={handlePrev}
          className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>上一个</span>
        </button>

        <span>按空格或点击卡片翻面</span>

        <button
          type="button"
          onClick={() => handleNext()}
          className="p-2 rounded-xl hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
        >
          <span>跳过</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
