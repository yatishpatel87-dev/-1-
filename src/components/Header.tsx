import React from 'react';
import { PlusCircle, History, Volume2, VolumeX, Sparkles, MessageSquare, Bot, Phone } from 'lucide-react';

interface HeaderProps {
  onNewChat: () => void;
  onToggleHistory: () => void;
  isHistoryOpen: boolean;
  historyCount: number;
  autoSpeechEnabled: boolean;
  onToggleAutoSpeech: () => void;
  soundEffectsEnabled: boolean;
  onToggleSoundEffects: () => void;
  activeTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
  onOpenVoiceGenerator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
  onToggleHistory,
  isHistoryOpen,
  historyCount,
  autoSpeechEnabled,
  onToggleAutoSpeech,
  soundEffectsEnabled,
  onToggleSoundEffects,
  activeTopic,
  onSelectTopic,
  onOpenVoiceGenerator,
}) => {
  const topics = [
    { id: 'maths', label: 'ગણિત' },
    { id: 'science', label: 'વિજ્ઞાન' },
    { id: 'social', label: 'સામાજિક વિજ્ઞાન' },
    { id: 'hindi', label: 'હિન્દી' },
    { id: 'english', label: 'અંગ્રેજી' },
    { id: 'sanskrit', label: 'સંસ્કૃત' },
    { id: 'gujarati', label: 'ગુજરાતી' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark & Icon - જ્ઞાન સહાયક */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTopic(null)}
              className="group flex items-center gap-3 text-left focus:outline-hidden"
              title="જ્ઞાન સહાયક – GSEB ધોરણ ૬ થી ૮ શિક્ષણ સહાયક"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-amber-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <span className="text-xl font-black bg-gradient-to-r from-emerald-800 to-amber-600 bg-clip-text text-transparent">
                    જ્ઞા
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                    જ્ઞાન સહાયક
                  </span>
                  <span className="text-[10px] font-semibold tracking-wide text-amber-700 bg-amber-50 border border-amber-200/60 rounded px-1.5 py-0.2">
                    GSEB AI
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  ધોરણ ૬ થી ૮ શિક્ષણ સહાયક
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation & Quick Topics (Clean single line links) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
            {topics.map((t) => {
              const isActive = activeTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTopic(isActive ? null : t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Interactive Controls & New Chat Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Gyan Sahayak Helpline Number button */}
            <a
              href="tel:18002337965"
              title="શિક્ષણ સહાયક હેલ્પલાઇન નંબર: 1800-233-7965 (વિદ્યા સમીક્ષા કેન્દ્ર)"
              className="p-2 sm:px-2.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
              <span className="hidden xl:inline text-[11px] font-bold">નંબર: ૧૮૦૦-૨૩૩-૭૯૬૫</span>
              <span className="xl:hidden hidden sm:inline text-[11px] font-bold">સહાયક નંબર</span>
            </a>

            {/* Robot Voice Generator Modal Trigger */}
            <button
              onClick={onOpenVoiceGenerator}
              title="ગુજરાતી રોબોટિક વોઈસ જનરેટર"
              className="p-2 sm:px-3 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Bot className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">રોબોટ અવાજ</span>
            </button>

            {/* Auto speech toggle */}
            <button
              onClick={onToggleAutoSpeech}
              title={autoSpeechEnabled ? 'સ્વયંચાલિત અવાજ ચાલુ છે (બંધ કરવા ક્લિક કરો)' : 'જવાબ મોટેથી સાંભળવા માટે ચાલુ કરો'}
              className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                autoSpeechEnabled
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden xl:inline text-xs">
                {autoSpeechEnabled ? 'અવાજ: ચાલુ' : 'અવાજ'}
              </span>
            </button>

            {/* Conversation History Drawer Toggle */}
            <button
              onClick={onToggleHistory}
              title="વાતચીત ઇતિહાસ"
              className={`p-2 rounded-lg text-xs font-medium transition-all relative flex items-center gap-1.5 ${
                isHistoryOpen
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden lg:inline text-xs">ઇતિહાસ</span>
              {historyCount > 0 && (
                <span className="text-[10px] bg-emerald-600 text-white font-semibold rounded-full px-1.5 py-0.2 min-w-[16px] text-center">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Primary Action Button: New Chat */}
            <button
              onClick={onNewChat}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>નવી વાતચીત</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
