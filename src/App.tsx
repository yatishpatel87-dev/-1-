import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { QuickPrompts } from './components/QuickPrompts';
import { Sidebar } from './components/Sidebar';
import { Toast, ToastMessage } from './components/Toast';
import { RobotVoiceGeneratorModal } from './components/RobotVoiceGeneratorModal';
import { Conversation, Message } from './types/chat';
import {
  speakGujarati,
  speakGujaratiSmart,
  stopSpeaking,
  isCurrentlySpeaking,
  findBestVoiceForGujarati,
  VoiceSettings,
} from './utils/speech';
import { playSentSound, playReceivedSound, playRobotBeep } from './utils/audioEffects';
import { Sparkles, MessageSquarePlus, Bot } from 'lucide-react';

const STORAGE_KEY = 'varta_ai_conversations_v1';
const AUTO_SPEECH_KEY = 'varta_ai_auto_speech';
const SOUND_EFFECTS_KEY = 'varta_ai_sound_effects';
const VOICE_SETTINGS_KEY = 'varta_ai_voice_settings';

function createNewConversation(): Conversation {
  return {
    id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: 'નવી વાતચીત',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  };
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading conversations:', e);
    }
    return [createNewConversation()];
  });

  const [currentId, setCurrentId] = useState<string>(() => {
    return conversations[0]?.id || '';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hasNotifiedVoiceStatus, setHasNotifiedVoiceStatus] = useState(false);

  // Gujarati voice settings (defaults to Sarvam Neural AI audio)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    try {
      const saved = localStorage.getItem(VOICE_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          style: parsed.style || 'natural',
          engine: parsed.engine || 'sarvam_neural',
          speaker: parsed.speaker || 'aditya',
          pitch: parsed.pitch !== undefined ? parsed.pitch : 0.5,
          rate: parsed.rate !== undefined ? parsed.rate : 1.0,
        };
      }
    } catch (e) {
      console.error('Error loading voice settings:', e);
    }
    return {
      style: 'natural',
      engine: 'sarvam_neural',
      speaker: 'aditya',
      pitch: 0.5,
      rate: 1.0,
    };
  });

  // Auto speech enabled by default as requested: "javab avya pachi taraj boline sambhdave"
  const [autoSpeechEnabled, setAutoSpeechEnabled] = useState<boolean>(() => {
    const val = localStorage.getItem(AUTO_SPEECH_KEY);
    return val !== 'false';
  });

  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState<boolean>(() => {
    const val = localStorage.getItem(SOUND_EFFECTS_KEY);
    return val !== 'false';
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Current active conversation
  const currentConversation =
    conversations.find((c) => c.id === currentId) || conversations[0] || createNewConversation();

  // Save conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save conversations to storage:', e);
    }
  }, [conversations]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(AUTO_SPEECH_KEY, String(autoSpeechEnabled));
  }, [autoSpeechEnabled]);

  useEffect(() => {
    localStorage.setItem(SOUND_EFFECTS_KEY, String(soundEffectsEnabled));
  }, [soundEffectsEnabled]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom(isLoading ? 'auto' : 'smooth');
  }, [currentConversation?.messages, isLoading]);

  // Toast manager
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Create new chat
  const handleNewChat = () => {
    stopSpeaking();
    setSpeakingMessageId(null);
    const newConv = createNewConversation();
    setConversations((prev) => [newConv, ...prev]);
    setCurrentId(newConv.id);
    setActiveTopic(null);
  };

  // Delete chat
  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (updated.length === 0) {
        const fresh = createNewConversation();
        setCurrentId(fresh.id);
        return [fresh];
      }
      if (currentId === id) {
        setCurrentId(updated[0].id);
      }
      return updated;
    });
    showToast('info', 'વાતચીત ભૂંસી નાખવામાં આવી.');
  };

  // Clear all chats
  const handleClearAllConversations = () => {
    stopSpeaking();
    setSpeakingMessageId(null);
    const fresh = createNewConversation();
    setConversations([fresh]);
    setCurrentId(fresh.id);
    showToast('info', 'બધી જૂની વાતચીતો સાફ કરવામાં આવી.');
  };

  // Text-to-Speech handler
  const handleSpeak = async (text: string, messageId: string) => {
    setSpeakingMessageId(messageId);

    // Play robot activation sound if in robot engine or deep robotic pitch
    if (voiceSettings.engine === 'browser_robot' || voiceSettings.pitch <= 0.6) {
      playRobotBeep();
    }

    const { success } = await speakGujaratiSmart(text, {
      engine: voiceSettings.engine,
      speaker: voiceSettings.speaker,
      style: voiceSettings.style,
      pitch: voiceSettings.pitch,
      rate: voiceSettings.rate,
      onStart: () => {
        setSpeakingMessageId(messageId);
      },
      onEnd: () => {
        setSpeakingMessageId(null);
      },
      onError: (err) => {
        setSpeakingMessageId(null);
        console.warn('Speech error:', err);
      },
    });

    if (!success) {
      showToast('error', 'અવાજ શરૂ કરી શકાયો નથી.');
      setSpeakingMessageId(null);
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setSpeakingMessageId(null);
  };

  // Send message to backend Gemini API
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    if (soundEffectsEnabled) {
      playSentSound();
    }

    // Stop previous speaking
    stopSpeaking();
    setSpeakingMessageId(null);

    const userMessage: Message = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      text: userText.trim(),
      timestamp: Date.now(),
    };

    const botMessageId = `msg_b_${Date.now()}`;
    const initialBotMessage: Message = {
      id: botMessageId,
      role: 'model',
      text: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    // Update conversation state with user message and streaming bot placeholder
    const isFirstMessage = currentConversation.messages.length === 0;
    const conversationTitle = isFirstMessage
      ? userText.trim().slice(0, 32) + (userText.trim().length > 32 ? '...' : '')
      : currentConversation.title;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === currentConversation.id) {
          return {
            ...c,
            title: conversationTitle,
            updatedAt: Date.now(),
            messages: [...c.messages, userMessage, initialBotMessage],
          };
        }
        return c;
      })
    );

    setIsLoading(true);

    try {
      // Build history for backend
      const historyPayload = currentConversation.messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText.trim(),
          history: historyPayload,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'સર્વર તરફથી ભૂલ આવી.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              try {
                const payload = JSON.parse(trimmed.slice(6));
                if (payload.chunk) {
                  accumulatedText += payload.chunk;
                  setConversations((prev) =>
                    prev.map((c) => {
                      if (c.id === currentConversation.id) {
                        return {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === botMessageId
                              ? { ...m, text: accumulatedText, isStreaming: true }
                              : m
                          ),
                        };
                      }
                      return c;
                    })
                  );
                } else if (payload.done) {
                  accumulatedText = payload.fullText || accumulatedText;
                } else if (payload.error) {
                  throw new Error(payload.error);
                }
              } catch (e) {
                // ignore SSE parse errors
              }
            }
          }
        }

        // Process any trailing chunk remaining in the buffer
        if (buffer.trim()) {
          const lines = buffer.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              try {
                const payload = JSON.parse(trimmed.slice(6));
                if (payload.chunk) {
                  accumulatedText += payload.chunk;
                } else if (payload.done && payload.fullText) {
                  accumulatedText = payload.fullText;
                }
              } catch (e) {
                // ignore parse error
              }
            }
          }
        }
      }

      // Mark streaming as completed
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConversation.id) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === botMessageId
                  ? {
                      ...m,
                      text: accumulatedText || 'હું આપને કેવી રીતે મદદ કરી શકું?',
                      isStreaming: false,
                    }
                  : m
              ),
            };
          }
          return c;
        })
      );

      if (soundEffectsEnabled) {
        playReceivedSound();
      }

      // If auto-speech is enabled, speak the answer
      if (autoSpeechEnabled && accumulatedText) {
        handleSpeak(accumulatedText, botMessageId);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errText =
        err?.message ||
        'નેટવર્ક અથવા સર્વરમાં અડચણ આવી છે. કૃપા કરીને થોડીવાર પછી ફરીથી પ્રયાસ કરો.';

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConversation.id) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === botMessageId
                  ? {
                      ...m,
                      text: errText,
                      isStreaming: false,
                      error: true,
                    }
                  : m
              ),
            };
          }
          return c;
        })
      );

      showToast('error', errText);
    } finally {
      setIsLoading(false);
    }
  };

  // Retry failed message
  const handleRetry = (failedMsg: Message) => {
    // Find preceding user message
    const msgs = currentConversation.messages;
    const failedIndex = msgs.findIndex((m) => m.id === failedMsg.id);
    if (failedIndex > 0) {
      const prevUserMsg = msgs[failedIndex - 1];
      if (prevUserMsg && prevUserMsg.role === 'user') {
        // Remove failed message
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === currentConversation.id) {
              return {
                ...c,
                messages: c.messages.filter((m) => m.id !== failedMsg.id),
              };
            }
            return c;
          })
        );
        handleSendMessage(prevUserMsg.text);
      }
    }
  };

  const hasMessages = currentConversation.messages.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/15 to-amber-50/15 text-slate-900 font-gujarati antialiased">
      {/* Top Header */}
      <Header
        onNewChat={handleNewChat}
        onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
        isHistoryOpen={isHistoryOpen}
        historyCount={conversations.length}
        autoSpeechEnabled={autoSpeechEnabled}
        onToggleAutoSpeech={() => {
          const next = !autoSpeechEnabled;
          setAutoSpeechEnabled(next);
          showToast(
            'info',
            next
              ? 'સ્વયંચાલિત અવાજ ચાલુ કર્યો: હવે AI જવાબો મોટેથી બોલશે.'
              : 'સ્વયંચાલિત અવાજ બંધ કર્યો.'
          );
        }}
        soundEffectsEnabled={soundEffectsEnabled}
        onToggleSoundEffects={() => setSoundEffectsEnabled((prev) => !prev)}
        activeTopic={activeTopic}
        onSelectTopic={(topic) => setActiveTopic(topic)}
        onOpenVoiceGenerator={() => setIsVoiceModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative max-w-5xl w-full mx-auto">
        {/* Messages Container or Welcome Quick Prompts with ample bottom padding for 100% full answer readability */}
        <main className={`flex-1 px-3 sm:px-6 py-6 ${hasMessages ? 'pb-36 sm:pb-44' : 'pb-8'}`}>
          {!hasMessages ? (
            <QuickPrompts
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              filterTopic={activeTopic}
            />
          ) : (
            <div className="space-y-2">
              {/* Active Subject Breadcrumb bar */}
              <div className="flex items-center justify-between px-2 py-1.5 bg-white/80 backdrop-blur-md rounded-xl border border-emerald-100 text-xs text-slate-500 mb-2 shadow-2xs">
                <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>ધોરણ ૬ થી ૮ GSEB અભ્યાસ સહાયક</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  સંપૂર્ણ ઉત્તર & સ્વયંચાલિત અવાજ
                </span>
              </div>

              {currentConversation.messages.map((message, idx) => {
                const prevUserMsg =
                  idx > 0 && currentConversation.messages[idx - 1]?.role === 'user'
                    ? currentConversation.messages[idx - 1].text
                    : undefined;

                return (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    userQuestion={prevUserMsg}
                    isSpeakingThis={speakingMessageId === message.id}
                    onSpeak={handleSpeak}
                    onStopSpeak={handleStopSpeaking}
                    onRetry={handleRetry}
                  />
                );
              })}

              {/* Thinking Indicator when waiting for stream chunks */}
              {isLoading &&
                currentConversation.messages[currentConversation.messages.length - 1]?.role ===
                  'user' && (
                  <div className="flex items-center gap-3 my-4 p-4 bg-white border border-emerald-200/90 rounded-2xl max-w-md shadow-md animate-pulse">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      જ્ઞા
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                      <span className="text-xs sm:text-sm font-bold text-emerald-950">
                        જ્ઞાન સહાયક સંપૂર્ણ અને શુદ્ધ ઉત્તર તૈયાર કરી રહ્યું છે...
                      </span>
                    </div>
                  </div>
                )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Sticky Chat Input at Bottom */}
        <div className="sticky bottom-0 z-20">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isSpeaking={speakingMessageId !== null || isCurrentlySpeaking()}
            onStopSpeaking={handleStopSpeaking}
            autoSpeechEnabled={autoSpeechEnabled}
            onToggleAutoSpeech={() => setAutoSpeechEnabled((prev) => !prev)}
            onRecognitionError={(err) => showToast('error', err)}
          />
        </div>
      </div>

      {/* Sidebar Conversation History */}
      <Sidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        conversations={conversations}
        currentConversationId={currentConversation.id}
        onSelectConversation={(id) => {
          stopSpeaking();
          setSpeakingMessageId(null);
          setCurrentId(id);
          setActiveTopic(null);
        }}
        onNewConversation={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onClearAllConversations={handleClearAllConversations}
      />

      {/* Gujarati Robotic Voice Generator Modal */}
      <RobotVoiceGeneratorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentSettings={voiceSettings}
        onApplySettings={(newSettings) => {
          setVoiceSettings(newSettings);
          try {
            localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(newSettings));
          } catch (e) {
            console.error('Failed to save voice settings:', e);
          }
          showToast('success', 'રોબોટિક અવાજ સેટિંગ્સ સફળતાપૂર્વક સાચવવામાં આવ્યા!');
        }}
      />

      {/* Floating Feedback Toasts */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
