/**
 * Speech Recognition and Speech Synthesis Utilities for Gujarati (gu-IN)
 */

// Define SpeechRecognition interface for browser compatibility
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createSpeechRecognizer(callbacks: {
  onStart?: () => void;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (errorMessage: string) => void;
  onEnd?: () => void;
  lang?: string;
}): { start: () => void; stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    callbacks.onError('તમારા બ્રાઉઝરમાં અવાજ ઓળખવાની સુવિધા (Speech Recognition) ઉપલબ્ધ નથી.');
    return null;
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return null;

  const recognition = new SpeechRec();
  recognition.lang = callbacks.lang || 'gu-IN';
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.onstart = () => {
    callbacks.onStart?.();
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const piece = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += piece;
      } else {
        interimTranscript += piece;
      }
    }

    if (finalTranscript) {
      callbacks.onResult(finalTranscript, true);
    } else if (interimTranscript) {
      callbacks.onResult(interimTranscript, false);
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    let guError = 'અવાજ ઓળખવામાં અડચણ આવી.';
    if (event.error === 'not-allowed') {
      guError = 'માઇક્રોફોનની પરવાનગી નકારી દેવામાં આવી છે. કૃપા કરીને બ્રાઉઝર સેટિંગ્સમાં માઇક્રોફોન મંજૂર કરો.';
    } else if (event.error === 'no-speech') {
      guError = 'કોઈ અવાજ સંભળાયો નથી. કૃપા કરીને સ્પષ્ટ અવાજમાં ફરીથી બોલો.';
    } else if (event.error === 'network') {
      guError = 'નેટવર્ક કનેક્શનની અડચણ છે. કૃપા કરીને ઇન્ટરનેટ તપાસો.';
    } else if (event.error === 'audio-capture') {
      guError = 'માઇક્રોફોન હાર્ડવેર શોધી શકાયું નથી.';
    }
    callbacks.onError(guError);
  };

  recognition.onend = () => {
    callbacks.onEnd?.();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (err) {
        console.error('Speech recognition start error:', err);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (err) {
        console.error('Speech recognition stop error:', err);
      }
    },
  };
}

// Detect language of text for appropriate voice synthesis
export function detectLanguageFromText(text: string): 'gu-IN' | 'hi-IN' | 'en-IN' {
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  const gujaratiCount = (text.match(/[\u0A80-\u0AFF]/g) || []).length;
  const englishCount = (text.match(/[a-zA-Z]/g) || []).length;

  if (devanagariCount > gujaratiCount && devanagariCount > englishCount) {
    return 'hi-IN'; // Hindi or Sanskrit
  }
  if (englishCount > gujaratiCount && englishCount > devanagariCount && englishCount > 15) {
    return 'en-IN'; // English
  }
  return 'gu-IN'; // Gujarati
}

// Speech Synthesis Voice Finder
export function findBestVoiceForLanguage(targetLang: 'gu-IN' | 'hi-IN' | 'en-IN' = 'gu-IN'): {
  voice: SpeechSynthesisVoice | null;
  isNative: boolean;
} {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, isNative: false };
  }

  const allVoices = window.speechSynthesis.getVoices();
  if (allVoices.length === 0) {
    return { voice: null, isNative: false };
  }

  if (targetLang === 'hi-IN') {
    const hiVoice = allVoices.find((v) => {
      const l = (v.lang || '').toLowerCase();
      return l.startsWith('hi') || l === 'hi-in' || v.name.toLowerCase().includes('hindi');
    });
    if (hiVoice) return { voice: hiVoice, isNative: true };
  } else if (targetLang === 'en-IN') {
    const enVoice = allVoices.find((v) => {
      const l = (v.lang || '').toLowerCase();
      return l === 'en-in' || l.startsWith('en');
    });
    if (enVoice) return { voice: enVoice, isNative: true };
  } else {
    // Gujarati
    const guVoice = allVoices.find((v) => {
      const l = (v.lang || '').toLowerCase();
      return l.startsWith('gu') || l === 'gu-in' || v.name.toLowerCase().includes('gujarati');
    });
    if (guVoice) return { voice: guVoice, isNative: true };
  }

  // Fallback to Indian English or Hindi
  const fallbackIndic = allVoices.find((v) => {
    const l = (v.lang || '').toLowerCase();
    return l === 'hi-in' || l.startsWith('hi') || l === 'en-in';
  });
  if (fallbackIndic) return { voice: fallbackIndic, isNative: false };

  const defaultVoice = allVoices.find((v) => v.default) || allVoices[0] || null;
  return { voice: defaultVoice, isNative: false };
}

export function findBestVoiceForGujarati(): { voice: SpeechSynthesisVoice | null; isNativeGujarati: boolean } {
  const result = findBestVoiceForLanguage('gu-IN');
  return { voice: result.voice, isNativeGujarati: result.isNative };
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let currentAudio: HTMLAudioElement | null = null;

export function stopSpeaking(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {
      // ignore
    }
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function isCurrentlySpeaking(): boolean {
  const isSynthesisSpeaking = typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking;
  const isAudioPlaying = currentAudio !== null && !currentAudio.paused;
  return isSynthesisSpeaking || isAudioPlaying;
}

/**
 * Clean markdown symbols for cleaner TTS speech synthesis
 */
export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
    .replace(/\*(.*?)\*/g, '$1') // remove italic
    .replace(/#{1,6}\s+/g, '') // remove headings
    .replace(/```[\s\S]*?```/g, 'કોડ બ્લોક') // replace code blocks
    .replace(/`([^`]+)`/g, '$1') // remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove markdown links
    .replace(/[•\-\*]\s+/g, '') // remove list bullets
    .trim();
}

export type VoiceEngine = 'sarvam_neural' | 'browser_robot';
export type VoiceStyle = 'robot' | 'natural' | 'smart' | 'deep' | 'custom';
export type SarvamSpeaker = 'aditya' | 'ritu' | 'priya' | 'rahul' | 'kavya' | 'pooja';

export interface VoiceSettings {
  style: VoiceStyle;
  pitch: number;
  rate: number;
  engine: VoiceEngine;
  speaker: SarvamSpeaker;
}

export const SARVAM_SPEAKERS: Record<SarvamSpeaker, { label: string; desc: string; gender: 'male' | 'female' }> = {
  aditya: {
    label: 'આદિત્ય (Aditya)',
    desc: 'કુદરતી, ગંભીર અને સ્પષ્ટ પુરુષ અવાજ',
    gender: 'male',
  },
  ritu: {
    label: 'ઋતુ (Ritu)',
    desc: 'શાંત, શિષ્ટ અને મધુર સ્ત્રી અવાજ',
    gender: 'female',
  },
  priya: {
    label: 'પ્રિયા (Priya)',
    desc: 'સ્પષ્ટ અને ઉત્સાહી સ્ત્રી અવાજ',
    gender: 'female',
  },
  rahul: {
    label: 'રાહુલ (Rahul)',
    desc: 'યુવાન અને સક્રિય પુરુષ અવાજ',
    gender: 'male',
  },
  kavya: {
    label: 'કાવ્યા (Kavya)',
    desc: 'મૃદુ વાર્તાકાર સ્ત્રી અવાજ',
    gender: 'female',
  },
  pooja: {
    label: 'પૂજા (Pooja)',
    desc: 'સહાયક અને વિનમ્ર સ્ત્રી અવાજ',
    gender: 'female',
  },
};

export const VOICE_PRESETS: Record<VoiceStyle, { pitch: number; rate: number; label: string; desc: string }> = {
  robot: {
    pitch: 0.5,
    rate: 0.9,
    label: 'રોબોટિક અવાજ',
    desc: 'ઊંડો, યાંત્રિક અને રોબોટ જેવો અવાજ (Pitch 0.5, Speed 0.9)',
  },
  natural: {
    pitch: 1.0,
    rate: 0.95,
    label: 'કુદરતી / શાંત',
    desc: 'સામાન્ય માનવ જેવો શાંત અને સ્પષ્ટ ઉચ્ચાર',
  },
  smart: {
    pitch: 1.2,
    rate: 1.1,
    label: 'ઝડપી સ્માર્ટ',
    desc: 'ઉત્સાહી અને ઝડપી સહાયક અવાજ',
  },
  deep: {
    pitch: 0.65,
    rate: 0.85,
    label: 'ગંભીર વાર્તાકાર',
    desc: 'ધીમો, ભારી અને વાર્તા કહેતો ગંભીર અવાજ',
  },
  custom: {
    pitch: 0.5,
    rate: 0.9,
    label: 'કસ્ટમ અવાજ',
    desc: 'તમારા મનપસંદ સ્વર અને ઝડપ મુજબ',
  },
};

/**
 * Play base64 audio generated from Sarvam AI
 */
export function playSarvamBase64Audio(
  base64Audio: string,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): HTMLAudioElement {
  stopSpeaking();

  const audioSrc = `data:audio/wav;base64,${base64Audio}`;
  const audio = new Audio(audioSrc);
  currentAudio = audio;

  audio.onplay = () => {
    options?.onStart?.();
  };

  audio.onended = () => {
    currentAudio = null;
    options?.onEnd?.();
  };

  audio.onerror = (e) => {
    currentAudio = null;
    console.warn('Sarvam audio playback error:', e);
    options?.onError?.(e);
  };

  audio.play().catch((err) => {
    currentAudio = null;
    options?.onError?.(err);
  });

  return audio;
}

/**
 * Intelligent Gujarati speech dispatcher: uses Sarvam AI Neural audio when available
 * or falls back to Web Speech synthesis
 */
export async function speakGujaratiSmart(
  text: string,
  options?: {
    engine?: VoiceEngine;
    speaker?: SarvamSpeaker;
    style?: VoiceStyle;
    rate?: number;
    pitch?: number;
    language?: 'gu-IN' | 'hi-IN' | 'en-IN';
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): Promise<{ success: boolean; isNeural: boolean }> {
  stopSpeaking();

  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) {
    options?.onEnd?.();
    return { success: false, isNeural: false };
  }

  const targetLanguage = options?.language || detectLanguageFromText(cleanedText);

  // If user selected Sarvam Neural Engine (or default)
  if (options?.engine !== 'browser_robot') {
    try {
      const pace = options?.rate || 1.0;
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanedText,
          speaker: options?.speaker || 'aditya',
          pace,
          languageCode: targetLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.audio) {
          playSarvamBase64Audio(data.audio, {
            onStart: options?.onStart,
            onEnd: options?.onEnd,
            onError: options?.onError,
          });
          return { success: true, isNeural: true };
        }
      }
    } catch (e) {
      console.warn('Sarvam TTS API call failed, falling back to Web Speech:', e);
    }
  }

  // Fallback to local browser Web Speech synthesis / Robot modulator
  const fallbackRes = speakGujarati(cleanedText, {
    pitch: options?.pitch,
    rate: options?.rate,
    style: options?.style,
    language: targetLanguage,
    onStart: options?.onStart,
    onEnd: options?.onEnd,
    onError: options?.onError,
  });

  return { success: fallbackRes.success, isNeural: false };
}

/**
 * Speak text in Gujarati, Hindi or English
 */
export function speakGujarati(
  text: string,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
    rate?: number;
    pitch?: number;
    style?: VoiceStyle;
    language?: 'gu-IN' | 'hi-IN' | 'en-IN';
  }
): { isNativeGujarati: boolean; success: boolean } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onError?.('તમારા બ્રાઉઝરમાં સ્પીચ સિન્થેસિસ (TTS) ઉપલબ્ધ નથી.');
    return { isNativeGujarati: false, success: false };
  }

  stopSpeaking();

  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) {
    options?.onEnd?.();
    return { isNativeGujarati: false, success: false };
  }

  const targetLang = options?.language || detectLanguageFromText(cleanedText);
  const { voice, isNative } = findBestVoiceForLanguage(targetLang);

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  utterance.lang = targetLang;
  if (voice) {
    utterance.voice = voice;
  }

  // Determine pitch and rate
  const pitch = options?.pitch !== undefined ? options.pitch : (options?.style ? VOICE_PRESETS[options.style].pitch : 0.5);
  const rate = options?.rate !== undefined ? options.rate : (options?.style ? VOICE_PRESETS[options.style].rate : 0.9);

  utterance.pitch = Math.max(0.1, Math.min(2.0, pitch));
  utterance.rate = Math.max(0.1, Math.min(2.0, rate));

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    activeUtterance = null;
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    console.warn('Speech synthesis error:', e);
    options?.onError?.(e);
  };

  activeUtterance = utterance;

  try {
    window.speechSynthesis.speak(utterance);
    return { isNativeGujarati: isNative, success: true };
  } catch (err) {
    console.error('TTS Speak call failed:', err);
    return { isNativeGujarati: false, success: false };
  }
}
