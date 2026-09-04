import React, { useState } from 'react';
import { TOP_LANGUAGES, Language } from '../types';
import { Globe, ArrowRight, ArrowLeftRight, Check, Sparkles, X } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose?: () => void;
  sourceLang: Language;
  targetLang: Language;
  onSelectLanguages: (source: Language, target: Language) => void;
  isInitialSetup?: boolean;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  sourceLang,
  targetLang,
  onSelectLanguages,
  isInitialSetup = false,
}) => {
  const [selectedSource, setSelectedSource] = useState<Language>(sourceLang);
  const [selectedTarget, setSelectedTarget] = useState<Language>(targetLang);
  const [activeStep, setActiveStep] = useState<'source' | 'target'>('source');

  if (!isOpen) return null;

  const handleSwap = () => {
    const temp = selectedSource;
    setSelectedSource(selectedTarget);
    setSelectedTarget(temp);
  };

  const handleConfirm = () => {
    if (selectedSource.id === selectedTarget.id) {
      return;
    }
    onSelectLanguages(selectedSource, selectedTarget);
    if (onClose) onClose();
  };

  return (
    <div
      id="language-selector-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#1DB954] p-6 text-white relative">
          {!isInitialSetup && onClose && (
            <button
              id="close-lang-modal-btn"
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Globe size={20} className="text-white" />
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-white/90">
              全球 10 大常用语言
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {isInitialSetup ? '欢迎使用 AI 词典' : '语言设置'}
          </h2>
          <p className="text-emerald-100 text-sm mt-1">
            设定您的母语与目标语言，AI 将以最自然亲切的方式为您定制地道释义与配图
          </p>

          {/* Quick preview bar */}
          <div className="mt-4 p-3 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedSource.flag}</span>
              <div>
                <div className="text-[10px] text-white/80 font-medium">我的母语</div>
                <div className="text-sm font-bold">{selectedSource.name}</div>
              </div>
            </div>

            <button
              id="swap-languages-btn"
              type="button"
              onClick={handleSwap}
              title="对调语言"
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-transform active:rotate-180 cursor-pointer"
            >
              <ArrowLeftRight size={16} />
            </button>

            <div className="flex items-center gap-2 text-right">
              <div>
                <div className="text-[10px] text-white/80 font-medium">目标学习语言</div>
                <div className="text-sm font-bold">{selectedTarget.name}</div>
              </div>
              <span className="text-xl">{selectedTarget.flag}</span>
            </div>
          </div>
        </div>

        {/* Tab selector for step */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            id="tab-source-lang"
            onClick={() => setActiveStep('source')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStep === 'source'
                ? 'bg-white text-[#1DB954] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>1. 我的母语</span>
            <span className="text-base">{selectedSource.flag}</span>
          </button>
          <button
            id="tab-target-lang"
            onClick={() => setActiveStep('target')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStep === 'target'
                ? 'bg-white text-[#1DB954] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>2. 目标语言</span>
            <span className="text-base">{selectedTarget.flag}</span>
          </button>
        </div>

        {/* Language Grid */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          <div className="text-xs font-bold text-slate-400 px-1">
            {activeStep === 'source' ? '请选择您的母语（解释将用该语言呈现）：' : '请选择您想学习的目标语言：'}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {TOP_LANGUAGES.map((lang) => {
              const isSource = selectedSource.id === lang.id;
              const isTarget = selectedTarget.id === lang.id;
              const isCurrentStepSelected =
                activeStep === 'source' ? isSource : isTarget;
              const isDisabled =
                activeStep === 'source' ? isTarget : isSource;

              return (
                <button
                  key={lang.id}
                  id={`lang-choice-${activeStep}-${lang.id}`}
                  disabled={isDisabled}
                  onClick={() => {
                    if (activeStep === 'source') {
                      setSelectedSource(lang);
                      // Auto advance to target if target is currently the same
                      if (selectedTarget.id === lang.id) {
                        const fallback = TOP_LANGUAGES.find((l) => l.id !== lang.id);
                        if (fallback) setSelectedTarget(fallback);
                      }
                      setActiveStep('target');
                    } else {
                      setSelectedTarget(lang);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isCurrentStepSelected
                      ? 'border-[#1DB954] bg-emerald-50/70 shadow-sm ring-1 ring-[#1DB954]'
                      : isDisabled
                      ? 'border-slate-100 bg-slate-100/60 opacity-40 cursor-not-allowed'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-800 leading-snug">
                        {lang.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lang.englishName}
                      </div>
                    </div>
                  </div>
                  {isCurrentStepSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#1DB954] text-white flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {selectedSource.id === selectedTarget.id ? (
              <span className="text-rose-500 font-medium">母语与目标语言不能相同</span>
            ) : (
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <span>{selectedSource.name}</span>
                <ArrowRight size={13} className="text-[#1DB954]" />
                <span>{selectedTarget.name}</span>
              </span>
            )}
          </div>

          <button
            id="confirm-languages-btn"
            disabled={selectedSource.id === selectedTarget.id}
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              selectedSource.id === selectedTarget.id
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-[#1DB954] hover:bg-[#1ed760] text-white shadow-md hover:shadow-lg active:scale-95'
            }`}
          >
            <Sparkles size={16} />
            <span>{isInitialSetup ? '开始探索 AI 词典' : '保存设置'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
