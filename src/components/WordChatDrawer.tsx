import React, { useState, useRef, useEffect } from 'react';
import { DictionaryEntry, Language, ChatMessage } from '../types';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import { AudioButton } from './AudioButton';

interface WordChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entry: DictionaryEntry | null;
  sourceLangObj: Language;
  targetLangObj: Language;
  initialPrompt?: string;
}

export const WordChatDrawer: React.FC<WordChatDrawerProps> = ({
  isOpen,
  onClose,
  entry,
  sourceLangObj,
  targetLangObj,
  initialPrompt = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or update messages when entry changes
  useEffect(() => {
    if (entry && isOpen) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `你好！我是你的 AI 语伴。关于 “${entry.normalizedTerm}”，你可以随时问我任何问题——比如造句练习、不同语境的潜台词、母语者的日常小习惯等等！`,
          timestamp: Date.now(),
        },
      ]);
      if (initialPrompt) {
        handleSend(initialPrompt);
      }
    }
  }, [entry?.id, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen || !entry) return null;

  const quickPrompts = [
    '母语者在日常口语中最常怎么用它？',
    '跟同义词相比，它的情绪色彩更强烈吗？',
    '给我出两道带有这个词的趣味填空小测试！',
    '如果用在职场汇报，会不会显得不够专业？',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/dictionary/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: entry.normalizedTerm,
          wordContext: {
            naturalExplanation: entry.naturalExplanation,
            examples: entry.examples,
            funUsageNotes: entry.funUsageNotes,
          },
          messages: [...messages, userMsg],
          newMessage: text,
          sourceLangName: sourceLangObj.name,
          targetLangName: targetLangObj.name,
        }),
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        role: 'assistant',
        content: data.reply || '抱歉，暂时没有理解，请换个问题试试～',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          content: '网络有点小波动，请稍后再试～',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="word-chat-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
    >
      <div
        id="word-chat-drawer-container"
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-slate-100"
      >
        {/* Drawer Header */}
        <div className="p-4 bg-[#1DB954] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-emerald-100 tracking-wider">
                深入探讨词汇
              </div>
              <div className="text-lg font-black truncate max-w-[200px]">
                {entry.normalizedTerm}
              </div>
            </div>
          </div>

          <button
            id="close-chat-drawer-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="p-2.5 bg-emerald-50/70 border-b border-emerald-100/80 overflow-x-auto scrollbar-none flex gap-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${idx}`}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-xs shrink-0 px-2.5 py-1 rounded-full bg-white text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100/60 font-medium transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div
          id="chat-messages-scroll"
          className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 text-[#1DB954] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1DB954] text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.role === 'assistant' && (
                  <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles size={11} className="text-[#1DB954]" />
                      <span>AI 词伴解析</span>
                    </span>
                    <AudioButton
                      text={msg.content}
                      bcp47={sourceLangObj.bcp47}
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-slate-600 p-1"
                    />
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 text-[#1DB954] flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2 rounded-tl-none shadow-xs">
                <Loader2 size={15} className="animate-spin text-[#1DB954]" />
                <span>AI 正在思考解答...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="chat-input-field"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`向 AI 咨询关于 “${entry.normalizedTerm}” 的任何问题...`}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 focus:bg-white border border-transparent focus:border-[#1DB954] text-sm text-slate-900 focus:outline-none transition-all"
            />
            <button
              id="send-chat-btn"
              type="submit"
              disabled={!inputValue.trim() || loading}
              className={`p-2.5 rounded-2xl font-bold transition-all cursor-pointer ${
                inputValue.trim() && !loading
                  ? 'bg-[#1DB954] text-white shadow-sm hover:bg-[#1ed760] active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
