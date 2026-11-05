import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Square, Sparkles, X, Volume2, VolumeX } from 'lucide-react';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speech';
import { playMicPing } from '../utils/audioEffects';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  autoSpeechEnabled: boolean;
  onToggleAutoSpeech: () => void;
  onRecognitionError: (msg: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isSpeaking,
  onStopSpeaking,
  autoSpeechEnabled,
  onToggleAutoSpeech,
  onRecognitionError,
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [listeningInterim, setListeningInterim] = useState('');
  const [micLang, setMicLang] = useState<'gu-IN' | 'hi-IN' | 'en-IN'>('gu-IN');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognizerRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  // Quick prompt chips
  const quickChips = [
    'કક્ષા 7 हिंदी कारक',
    'Class 8 English Tense',
    'દાખલો સ્ટેપ-બાય-સ્ટેપ ગણો',
    'સંસ્કૃત શ્લોક અને ભાવાર્થ',
    'સરળ શબ્દોમાં કહો',
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  // Initialize Speech Recognition
  const toggleSpeechRecognition = () => {
    if (!isSpeechRecognitionSupported()) {
      onRecognitionError('તમારા બ્રાઉઝરમાં અવાજથી બોલવાની સુવિધા (Speech Recognition) સપોર્ટ કરતી નથી.');
      return;
    }

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
      setListeningInterim('');
      return;
    }

    playMicPing();
    const recognizer = createSpeechRecognizer({
      lang: micLang,
      onStart: () => {
        setIsListening(true);
        setListeningInterim('');
      },
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setListeningInterim('');
          setIsListening(false);
        } else {
          setListeningInterim(transcript);
        }
      },
      onError: (errMsg) => {
        setIsListening(false);
        setListeningInterim('');
        onRecognitionError(errMsg);
      },
      onEnd: () => {
        setIsListening(false);
        setListeningInterim('');
      },
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      recognizer.start();
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    }

    onSendMessage(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addChipToInput = (chip: string) => {
    setText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} (${chip})` : chip;
    });
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-3 pb-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Quick Helper Phrases */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium mr-1">ઝડપી શબ્દો:</span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => addChipToInput(chip)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-full border border-slate-200/80 text-[11px] whitespace-nowrap transition-colors shadow-2xs"
            >
              + {chip}
            </button>
          ))}
        </div>

        {/* Listening Status Banner */}
        {isListening && (
          <div className="mb-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-amber-900">
                  {micLang === 'hi-IN'
                    ? 'હું હિન્દી/સંસ્કૃતમાં સાંભળી રહ્યો છું (Listening in Hindi/Sanskrit)...'
                    : micLang === 'en-IN'
                    ? 'હું અંગ્રેજીમાં સાંભળી રહ્યો છું (Listening in English)...'
                    : 'હું ગુજરાતીમાં સાંભળી રહ્યો છું, બોલો...'}
                </span>
                {listeningInterim && (
                  <span className="text-xs text-amber-700 italic">
                    "{listeningInterim}"
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={toggleSpeechRecognition}
              className="text-xs px-2.5 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-900 rounded-lg font-medium transition-colors"
            >
              પૂર્ણ કરો
            </button>
          </div>
        )}

        {/* Main Input Box Container */}
        <div className="relative rounded-2xl bg-white border border-slate-200 shadow-md focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <div className="flex items-end p-2 sm:p-2.5 gap-2">
            {/* Microphone button & Language Selector */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                title={
                  isListening
                    ? 'અવાજ રેકોર્ડિંગ બંધ કરો'
                    : `અવાજથી બોલો (${micLang === 'gu-IN' ? 'ગુજરાતી' : micLang === 'hi-IN' ? 'હિન્દી' : 'અંગ્રેજી'})`
                }
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                  isListening
                    ? 'bg-amber-500 text-white shadow-md animate-pulse'
                    : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMicLang((prev) => (prev === 'gu-IN' ? 'hi-IN' : prev === 'hi-IN' ? 'en-IN' : 'gu-IN'));
                }}
                title="માઇક્રોફોનની ભાષા બદલો (ગુજરાતી / हिन्दी / English)"
                className="px-1.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 transition-colors shadow-2xs"
              >
                {micLang === 'gu-IN' ? 'ગુજ' : micLang === 'hi-IN' ? 'हिं' : 'Eng'}
              </button>
            </div>

            {/* Textarea */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ધોરણ ૬ થી ૮ ના કોઈ પણ વિષય (ગણિત, વિજ્ઞાન, હિન્દી, અંગ્રેજી...) નો પ્રશ્ન પૂછો અથવા બોલો..."
                rows={1}
                disabled={isLoading}
                className="w-full resize-none border-0 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-0 py-1.5 px-1 max-h-36 leading-relaxed"
              />
            </div>

            {/* Clear button if text exists */}
            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg shrink-0 mb-1"
                title="સાફ કરો"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Stop speaking button if AI is currently reading aloud */}
            {isSpeaking && (
              <button
                type="button"
                onClick={onStopSpeaking}
                title="જ્ઞાન સહાયક નો અવાજ બંધ કરો"
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-semibold shrink-0 mb-0.5 transition-colors shadow-2xs"
              >
                <Square className="w-3.5 h-3.5 fill-amber-900" />
                <span className="hidden sm:inline">રોકો</span>
              </button>
            )}

            {/* Send button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() || isLoading}
              title="સંદેશ મોકલો (Enter)"
              className={`p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center shadow-xs ${
                text.trim() && !isLoading
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20 active:scale-95'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Footer bar inside input card */}
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>જ્ઞાન સહાયક – GSEB ધોરણ ૬ થી ૮ અધિકૃત AI માર્ગદર્શક</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleAutoSpeech}
                className="hover:text-slate-600 flex items-center gap-1 transition-colors"
                title="જવાબ આપ્યા બાદ આપમેળે બોલવું કે નહીં"
              >
                {autoSpeechEnabled ? (
                  <span className="flex items-center gap-1.5 text-amber-800 font-semibold bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-full">
                    <Volume2 className="w-3 h-3 text-amber-600 animate-pulse" />
                    <span>જવાબ આવતાં જ બોલશે: ચાલુ</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 hover:text-slate-600">
                    <VolumeX className="w-3 h-3" />
                    <span>આપમેળે બોલવાનું: બંધ</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
