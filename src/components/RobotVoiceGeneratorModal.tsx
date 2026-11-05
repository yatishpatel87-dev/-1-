import React, { useState } from 'react';
import { X, Bot, Volume2, Square, Sparkles, Check, Sliders, RefreshCw, AudioWaveform, Zap } from 'lucide-react';
import {
  VoiceSettings,
  VoiceStyle,
  VoiceEngine,
  SarvamSpeaker,
  VOICE_PRESETS,
  SARVAM_SPEAKERS,
  speakGujaratiSmart,
  stopSpeaking,
  isCurrentlySpeaking,
} from '../utils/speech';
import { playRobotBeep } from '../utils/audioEffects';

interface RobotVoiceGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: VoiceSettings;
  onApplySettings: (settings: VoiceSettings) => void;
}

export const RobotVoiceGeneratorModal: React.FC<RobotVoiceGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onApplySettings,
}) => {
  const [engine, setEngine] = useState<VoiceEngine>(currentSettings.engine || 'sarvam_neural');
  const [speaker, setSpeaker] = useState<SarvamSpeaker>(currentSettings.speaker || 'aditya');
  const [selectedStyle, setSelectedStyle] = useState<VoiceStyle>(currentSettings.style || 'robot');
  const [pitch, setPitch] = useState<number>(currentSettings.pitch || 0.5);
  const [rate, setRate] = useState<number>(currentSettings.rate || 0.9);
  const [text, setText] = useState('નમસ્તે! હું એક રોબોટિક અવાજ છું.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const samplePhrases = [
    'નમસ્તે! હું એક રોબોટિક અવાજ છું.',
    'જ્ઞાન સહાયક માં આપનું સ્વાગત છે. હું શુદ્ધ ગુજરાતીમાં વાત કરું છું.',
    'સિસ્ટમ સક્રિય છે. કૃપા કરીને તમારો પ્રશ્ન પૂછો.',
    'શિક્ષણ અને ખેતીવાડી અંગે કોઈપણ માર્ગદર્શન મેળવો.',
  ];

  const handleSelectPreset = (style: VoiceStyle) => {
    setSelectedStyle(style);
    if (style !== 'custom') {
      setPitch(VOICE_PRESETS[style].pitch);
      setRate(VOICE_PRESETS[style].rate);
    }
  };

  const handlePlayVoice = async () => {
    if (isPlaying || isCurrentlySpeaking()) {
      stopSpeaking();
      setIsPlaying(false);
      setIsGenerating(false);
      return;
    }

    if (!text.trim()) return;

    if (engine === 'browser_robot' || pitch <= 0.6) {
      playRobotBeep();
    }

    setIsGenerating(true);

    try {
      await speakGujaratiSmart(text.trim(), {
        engine,
        speaker,
        style: selectedStyle,
        pitch,
        rate,
        onStart: () => {
          setIsGenerating(false);
          setIsPlaying(true);
        },
        onEnd: () => {
          setIsGenerating(false);
          setIsPlaying(false);
        },
        onError: () => {
          setIsGenerating(false);
          setIsPlaying(false);
        },
      });
    } catch (e) {
      setIsGenerating(false);
      setIsPlaying(false);
    }
  };

  const handleSaveToChatbot = () => {
    onApplySettings({
      engine,
      speaker,
      style: selectedStyle,
      pitch,
      rate,
    });
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <Bot className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                ગુજરાતી રોબોટિક વોઈસ જનરેટર
              </h2>
              <p className="text-xs text-emerald-100/90">
                Sarvam AI Neural અને રોબોટિક સિન્થેસાઇઝર સાથે ગુજરાતી અવાજ સાંભળો
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 text-white/70 hover:text-white rounded-lg transition-colors"
            title="બંધ કરો"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Voice Engine Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ઓડિયો એન્જિન (Voice Technology)
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setEngine('sarvam_neural')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  engine === 'sarvam_neural'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>સર્વમ ન્યુરલ AI (કુદરતી અવાજ)</span>
              </button>
              <button
                type="button"
                onClick={() => setEngine('browser_robot')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  engine === 'browser_robot'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-emerald-600" />
                <span>રોબોટિક મોડ્યુલેટર</span>
              </button>
            </div>
          </div>

          {/* Text Input Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              બોલવા માટેનું ગુજરાતી લખાણ (Text Input)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="અહીં ગુજરાતીમાં લખાણ લખો..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all resize-none leading-relaxed"
            />

            {/* Quick Sample Phrases */}
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">નમૂના:</span>
              {samplePhrases.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => setText(phrase)}
                  className="px-2.5 py-0.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 rounded-full text-[11px] whitespace-nowrap transition-colors border border-slate-200/70"
                >
                  {phrase.slice(0, 24)}...
                </button>
              ))}
            </div>
          </div>

          {/* Sarvam AI Speaker Selector */}
          {engine === 'sarvam_neural' ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  ગુજરાતી સ્પિકર (Sarvam Neural Speakers)
                </label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  સર્વમ AI દ્વારા સક્રિય
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(SARVAM_SPEAKERS) as SarvamSpeaker[]).map((spkKey) => {
                  const spk = SARVAM_SPEAKERS[spkKey];
                  const isSelected = speaker === spkKey;
                  return (
                    <button
                      key={spkKey}
                      type="button"
                      onClick={() => setSpeaker(spkKey)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-slate-900">{spk.label}</span>
                        <span className="text-[10px] text-slate-400">
                          {spk.gender === 'male' ? '👨 પુરુષ' : '👩 સ્ત્રી'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight line-clamp-1">{spk.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Browser Robotic Synthesizer Presets */
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                રોબોટિક અવાજ શૈલી (Presets)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['robot', 'natural', 'smart', 'deep'] as VoiceStyle[]).map((style) => {
                  const preset = VOICE_PRESETS[style];
                  const isSelected = selectedStyle === style;
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => handleSelectPreset(style)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 font-semibold text-xs">
                        {style === 'robot' && '🤖'}
                        {style === 'natural' && '🌿'}
                        {style === 'smart' && '⚡'}
                        {style === 'deep' && '🎙️'}
                        <span>{preset.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight line-clamp-1">
                        {preset.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sliders for Pitch and Rate Tuning */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 border-b border-slate-200/60 pb-2">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                <span>ગતિ અને સ્વર કંટ્રોલ (Fine Tuning)</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setPitch(0.5);
                  setRate(0.9);
                  setSelectedStyle('robot');
                }}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>રોબોટ રીસેટ</span>
              </button>
            </div>

            {/* Pitch Slider (Available for Robot Modulator) */}
            {engine === 'browser_robot' && (
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-600 font-medium">
                    સ્વર / પિચ (Pitch): <span className="font-bold text-slate-900">{pitch.toFixed(2)}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {pitch <= 0.6 ? 'ઊંડો રોબોટિક' : pitch >= 1.2 ? 'તીણો / હળવો' : 'સામાન્ય'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.8"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => {
                    setPitch(parseFloat(e.target.value));
                    setSelectedStyle('custom');
                  }}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 px-0.5 mt-0.5">
                  <span>0.2 (ખૂબ ઊંડો)</span>
                  <span>0.5 (રોબોટ)</span>
                  <span>1.0 (માનવ)</span>
                  <span>1.8 (તીણો)</span>
                </div>
              </div>
            )}

            {/* Speed Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-600 font-medium">
                  ઝડપ / ગતિ (Speed / Pace): <span className="font-bold text-slate-900">{rate.toFixed(2)}x</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {rate < 0.8 ? 'ધીમી' : rate > 1.1 ? 'ઝડપી' : 'સામાન્ય'}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={rate}
                onChange={(e) => {
                  setRate(parseFloat(e.target.value));
                  setSelectedStyle('custom');
                }}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 px-0.5 mt-0.5">
                <span>0.5x (ધીમી)</span>
                <span>0.9x (રોબોટિક)</span>
                <span>1.0x (સામાન્ય)</span>
                <span>1.5x (ઝડપી)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Test / Speak Button */}
          <button
            type="button"
            onClick={handlePlayVoice}
            disabled={!text.trim() || isGenerating}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : isGenerating
                ? 'bg-emerald-600 text-white opacity-80 cursor-wait'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>અવાજ રોકો (Stop)</span>
              </>
            ) : isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>ઓડિયો તૈયાર થાય છે...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>અવાજે બોલો (Speak Voice)</span>
              </>
            )}
          </button>

          {/* Set as Chatbot Voice Button */}
          <button
            type="button"
            onClick={handleSaveToChatbot}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            {applied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">સેટિંગ્સ સચવાયા!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>ચેટબોટના અવાજ તરીકે સેટ કરો</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
