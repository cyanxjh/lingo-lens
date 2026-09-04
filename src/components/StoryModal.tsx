import React, { useState } from 'react';
import { DictionaryEntry, Language, StoryResult } from '../types';
import {
  BookOpen,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Check,
  RefreshCw,
  Copy,
  ChevronRight,
  Layers,
  Lightbulb,
} from 'lucide-react';
import { playSpeech, stopSpeech } from '../utils/speech';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedEntries: DictionaryEntry[];
  sourceLangObj: Language;
  targetLangObj: Language;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  isOpen,
  onClose,
  savedEntries,
  sourceLangObj,
  targetLangObj,
}) => {
  const [selectedWordIds, setSelectedWordIds] = useState<Set<string>>(
    new Set(savedEntries.slice(0, 8).map((e) => e.id))
  );
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<StoryResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'bilingual' | 'target' | 'source'>('bilingual');
  const [storyError, setStoryError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    const next = new Set(selectedWordIds);
    if (next.has(id)) {
      if (next.size <= 1) return; // keep at least 1
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedWordIds(next);
  };

  const handleGenerateStory = async () => {
    const selectedEntries = savedEntries.filter((e) => selectedWordIds.has(e.id));
    const words = selectedEntries.map((e) => e.normalizedTerm);

    if (words.length === 0) return;

    setLoading(true);
    setStoryError(null);
    try {
      const response = await fetch('/api/dictionary/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words,
          sourceLangName: sourceLangObj.name,
          targetLangName: targetLangObj.name,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `故事生成失败 (${response.status})`);
      }

      const data = await response.json();
      setStory(data);
    } catch (err: any) {
      console.error('Failed to generate story:', err);
      setStoryError(err?.message || '生成故事时遇网络或 AI 繁忙，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlayAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    if (!story?.storyTarget) return;

    // Remove markdown asterisks for clean speech
    const cleanSpeech = story.storyTarget.replace(/\*\*/g, '');
    setIsPlayingAudio(true);
    playSpeech(cleanSpeech, targetLangObj.bcp47, {
      rate: 0.9,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleCopy = () => {
    if (!story) return;
    const text = `${story.title}\n\n${story.storyTarget.replace(/\*\*/g, '')}\n\n${story.storySource.replace(/\*\*/g, '')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render bold words nicely
  const formatStoryText = (rawText: string, isTarget: boolean) => {
    const parts = rawText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const word = part.slice(2, -2);
        return (
          <span
            key={index}
            className={`font-bold px-1.5 py-0.5 rounded-md inline-block my-0.5 ${
              isTarget
                ? 'bg-emerald-100 text-emerald-950 ring-1 ring-emerald-300'
                : 'bg-emerald-50 text-emerald-900'
            }`}
          >
            {word}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      id="story-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        id="story-modal-container"
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-100"
      >
        {/* Header */}
        <div className="p-5 bg-[#1DB954] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-white/20">
              <BookOpen size={22} className="text-white" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-emerald-100 tracking-wider">
                记忆黑科技
              </div>
              <h2 className="text-xl font-black">AI 单词编故事串联</h2>
            </div>
          </div>

          <button
            id="close-story-modal-btn"
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Word Selection Chips */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span>选择要串联的单词或短语（已选 {selectedWordIds.size} 个）：</span>
              <button
                type="button"
                onClick={() => {
                  if (selectedWordIds.size === savedEntries.length) {
                    setSelectedWordIds(new Set([savedEntries[0]?.id].filter(Boolean)));
                  } else {
                    setSelectedWordIds(new Set(savedEntries.map((e) => e.id)));
                  }
                }}
                className="text-[#1DB954] hover:underline cursor-pointer"
              >
                {selectedWordIds.size === savedEntries.length ? '取消全选' : '全选'}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-slate-50 rounded-2xl border border-slate-200/70">
              {savedEntries.map((item) => {
                const isSelected = selectedWordIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSelect(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1DB954] text-white shadow-xs scale-100'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.normalizedTerm}</span>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Generate Button */}
          {!story && (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#1DB954] flex items-center justify-center mx-auto border border-emerald-200">
                <Sparkles size={28} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  一键将生词编织成生动故事
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  告别孤立死记硬背！AI 将根据选中的生词自动编写情节跌宕、趣味满满的情境小故事。
                </p>
              </div>
              {storyError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold max-w-sm mx-auto flex items-center justify-center gap-2">
                  <span>{storyError}</span>
                </div>
              )}
              <button
                id="generate-story-btn"
                disabled={loading || selectedWordIds.size === 0}
                onClick={handleGenerateStory}
                className="px-6 py-3 rounded-2xl bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>AI 正在酝酿趣味故事...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>开始编织故事 ({selectedWordIds.size} 词)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Generated Story Display */}
          {story && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-black text-slate-900">
                  {story.title || '生词情境小故事'}
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    id="read-story-audio-btn"
                    type="button"
                    onClick={handleTogglePlayAudio}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-[#1DB954] text-white animate-pulse'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{isPlayingAudio ? '暂停朗读' : '朗读故事'}</span>
                  </button>

                  <button
                    id="copy-story-btn"
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="复制故事全文"
                  >
                    {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Display Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('bilingual')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'bilingual' ? 'bg-white text-[#1DB954] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  双语对照
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('target')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'target' ? 'bg-white text-[#1DB954] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  纯目标语 ({targetLangObj.name})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('source')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'source' ? 'bg-white text-[#1DB954] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  纯母语翻译 ({sourceLangObj.name})
                </button>
              </div>

              {/* Story Content */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-4">
                {(activeTab === 'bilingual' || activeTab === 'target') && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-emerald-900 uppercase">
                      📖 {targetLangObj.name} 原文
                    </div>
                    <div className="text-base text-slate-900 leading-relaxed">
                      {formatStoryText(story.storyTarget, true)}
                    </div>
                  </div>
                )}

                {(activeTab === 'bilingual' || activeTab === 'source') && (
                  <div className="pt-3 border-t border-emerald-200/60 space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">
                      🇨🇳 {sourceLangObj.name} 对照翻译
                    </div>
                    <div className="text-sm text-slate-700 leading-relaxed">
                      {formatStoryText(story.storySource, false)}
                    </div>
                  </div>
                )}
              </div>

              {/* Vocabulary Tips in Story */}
              {story.vocabularyTips && story.vocabularyTips.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <Lightbulb size={14} className="text-[#1DB954]" />
                    <span>故事巧妙用法解析：</span>
                  </div>
                  <div className="grid gap-2">
                    {story.vocabularyTips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-start gap-2"
                      >
                        <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                          {tip.word}
                        </span>
                        <span className="text-slate-600 pt-0.5">
                          {tip.inStoryContext}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Re-generate button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGenerateStory}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                  <span>换个故事情节</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
