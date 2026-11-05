import React, { useState } from 'react';
import {
  Copy,
  Check,
  Volume2,
  Square,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Maximize2,
  X,
  Type,
  BookOpen,
  Share2,
} from 'lucide-react';
import { Message } from '../types/chat';
import { ShareModal } from './ShareModal';

interface ChatMessageProps {
  message: Message;
  userQuestion?: string;
  isSpeakingThis: boolean;
  onSpeak: (text: string, messageId: string) => void;
  onStopSpeak: () => void;
  onRetry?: (message: Message) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  userQuestion,
  isSpeakingThis,
  onSpeak,
  onStopSpeak,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeakingThis) {
      onStopSpeak();
    } else {
      onSpeak(message.text, message.id);
    }
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString('gu-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Cycle font size for optimal reading comfort
  const cycleFontSize = () => {
    setFontSize((prev) => (prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal'));
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-base sm:text-lg leading-relaxed';
      case 'xlarge':
        return 'text-lg sm:text-xl leading-loose';
      default:
        return 'text-sm sm:text-base leading-relaxed';
    }
  };

  // Helper for bold and italic formatting
  const renderInlineFormatting = (text: string) => {
    // Split by bold (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-extrabold text-slate-950 bg-amber-50/70 px-1 py-0.5 rounded text-[1.02em]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Parse markdown tables if present
  const renderTable = (tableLines: string[], key: string | number) => {
    if (tableLines.length < 2) return null;
    const headerLine = tableLines[0];
    const headers = headerLine
      .split('|')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const bodyLines = tableLines.slice(2); // Skip header and separator row

    return (
      <div key={key} className="my-3.5 overflow-x-auto rounded-xl border border-emerald-200/90 shadow-2xs bg-white">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/90 to-teal-50 text-emerald-950 font-bold border-b border-emerald-200">
              {headers.map((h, hIdx) => (
                <th key={hIdx} className="py-2.5 px-3 font-extrabold border-r last:border-r-0 border-emerald-200/60">
                  {renderInlineFormatting(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bodyLines.map((row, rIdx) => {
              const cells = row
                .split('|')
                .map((c) => c.trim())
                .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
              return (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2.5 px-3 text-slate-800 border-r last:border-r-0 border-slate-100">
                      {renderInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Robust line-by-line formatter so 100% of the answer is always readable without omission
  const renderFormattedContent = (content: string) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: { number?: string; bullet?: boolean; text: string; sublines: string[] }[] = [];
    let currentTable: string[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];

    const flushList = (key: string) => {
      if (currentList.length === 0) return;
      elements.push(
        <ul key={key} className="space-y-2.5 my-3 list-none pl-0.5">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[24px] h-[24px] rounded-lg bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-900 font-extrabold text-xs shrink-0 mt-0.5 shadow-2xs border border-emerald-200/80">
                {item.number ? item.number : '•'}
              </span>
              <div className="flex-1 text-slate-850 font-medium leading-relaxed">
                <div>{renderInlineFormatting(item.text)}</div>
                {item.sublines.length > 0 && (
                  <div className="mt-1 space-y-1 text-slate-700 pl-2.5 border-l-2 border-emerald-300 text-[0.95em]">
                    {item.sublines.map((sub, sIdx) => (
                      <p key={sIdx}>{renderInlineFormatting(sub)}</p>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    };

    const flushTable = (key: string) => {
      if (currentTable.length === 0) return;
      elements.push(renderTable(currentTable, key));
      currentTable = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code blocks
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const code = codeLines.join('\n');
          elements.push(
            <div key={`code_${i}`} className="my-3.5 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-100 text-xs shadow-md">
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-800 text-[11px] text-slate-300 font-mono border-b border-slate-700">
                <span>સંગણક કોડ / લિપિ</span>
                <button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="hover:text-emerald-400 transition-colors font-sans text-xs"
                >
                  નકલ કરો
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto font-mono text-xs leading-relaxed text-emerald-300">{code}</pre>
            </div>
          );
          codeLines = [];
        } else {
          flushList(`list_pre_code_${i}`);
          flushTable(`table_pre_code_${i}`);
          inCodeBlock = true;
          codeLines = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Markdown Tables
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushList(`list_pre_table_${i}`);
        currentTable.push(trimmed);
        continue;
      } else if (currentTable.length > 0) {
        flushTable(`table_${i}`);
      }

      // Blank line
      if (!trimmed) {
        flushList(`list_empty_${i}`);
        continue;
      }

      // Headings
      if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
        flushList(`list_head_${i}`);
        if (trimmed.startsWith('### ')) {
          elements.push(
            <h3 key={`h3_${i}`} className="text-base sm:text-lg font-black text-slate-900 mt-4 mb-2 pb-1 border-b border-emerald-100 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block shrink-0"></span>
              <span>{renderInlineFormatting(trimmed.replace(/^###\s+/, ''))}</span>
            </h3>
          );
        } else if (trimmed.startsWith('## ')) {
          elements.push(
            <h2 key={`h2_${i}`} className="text-lg sm:text-xl font-black text-emerald-950 mt-5 mb-2.5 flex items-center gap-2 pb-1 border-b-2 border-emerald-200">
              <span className="w-2 h-5 bg-gradient-to-b from-amber-500 to-emerald-600 rounded-full inline-block shrink-0"></span>
              <span>{renderInlineFormatting(trimmed.replace(/^##\s+/, ''))}</span>
            </h2>
          );
        } else if (trimmed.startsWith('# ')) {
          elements.push(
            <h1 key={`h1_${i}`} className="text-xl sm:text-2xl font-black text-slate-900 mt-5 mb-3">
              {renderInlineFormatting(trimmed.replace(/^#\s+/, ''))}
            </h1>
          );
        } else {
          elements.push(
            <h4 key={`h4_${i}`} className="text-sm sm:text-base font-bold text-emerald-800 mt-3 mb-1.5">
              {renderInlineFormatting(trimmed.replace(/^####\s+/, ''))}
            </h4>
          );
        }
        continue;
      }

      // Callout box / Note / Formula
      if (trimmed.startsWith('> ') || trimmed.startsWith('💡') || trimmed.startsWith('નોંધ:') || trimmed.startsWith('**સૂત્ર:**') || trimmed.startsWith('સૂત્ર:')) {
        flushList(`list_call_${i}`);
        elements.push(
          <div key={`callout_${i}`} className="my-3.5 p-3.5 rounded-xl bg-gradient-to-r from-amber-50/90 via-emerald-50/40 to-teal-50/30 border-l-4 border-amber-500 text-slate-800 shadow-2xs font-medium">
            {renderInlineFormatting(trimmed.replace(/^>\s*/, ''))}
          </div>
        );
        continue;
      }

      // Check List items (Numbered or Bullet)
      const listMatch = trimmed.match(/^(\d+|[૧-૯]+)\.\s+(.*)/);
      const bulletMatch = trimmed.match(/^[\-\*•]\s+(.*)/);

      if (listMatch) {
        currentList.push({
          number: listMatch[1],
          text: listMatch[2],
          sublines: [],
        });
        continue;
      } else if (bulletMatch) {
        currentList.push({
          bullet: true,
          text: bulletMatch[1],
          sublines: [],
        });
        continue;
      } else if (currentList.length > 0 && (line.startsWith('   ') || line.startsWith('\t') || line.startsWith('  '))) {
        currentList[currentList.length - 1].sublines.push(trimmed);
        continue;
      } else {
        flushList(`list_nonlist_${i}`);
      }

      // Step-by-Step Math highlight
      if (trimmed.includes('પગથિયું') || trimmed.includes('Step') || trimmed.includes('રીત:')) {
        elements.push(
          <div key={`step_${i}`} className="my-2 p-3 rounded-xl bg-slate-50 border border-slate-200/90 font-medium text-slate-800">
            {renderInlineFormatting(trimmed)}
          </div>
        );
        continue;
      }

      // Standard Paragraph
      elements.push(
        <p key={`p_${i}`} className="my-2 leading-relaxed text-slate-850 break-words font-medium">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    }

    flushList('list_final');
    flushTable('table_final');

    return elements;
  };

  if (message.error) {
    return (
      <div className="flex justify-start my-3.5">
        <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 shadow-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold mb-1">ભૂલ સંદેશ</p>
              <p className="text-xs text-red-700 leading-relaxed">{message.text}</p>
              {onRetry && (
                <button
                  onClick={() => onRetry(message)}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ફરી પ્રયાસ કરો</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex w-full my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex gap-3 max-w-[95%] md:max-w-3xl lg:max-w-4xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar with 3D Depth */}
          <div className="shrink-0 mt-0.5">
            {isUser ? (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-md border-b-2 border-emerald-900">
                આપ
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 p-0.5 shadow-md border-b-2 border-emerald-900">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <span className="text-sm font-black bg-gradient-to-r from-emerald-800 to-amber-600 bg-clip-text text-transparent">
                    જ્ઞા
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Message Bubble Container with 3D Pop Shadow */}
          <div className="flex flex-col flex-1 min-w-0">
            <div
              className={`rounded-2xl px-4 py-3.5 transition-all relative border ${
                isUser
                  ? 'bg-gradient-to-br from-emerald-700 to-emerald-800 text-white border-emerald-800 shadow-[0_4px_12px_rgba(5,150,105,0.22)] rounded-tr-xs'
                  : 'bg-white border-slate-200/90 text-slate-800 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.07)] rounded-tl-xs'
              } ${isSpeakingThis ? 'ring-2 ring-amber-400 bg-amber-50/30' : ''}`}
            >
              {/* Header info inside bubble for AI */}
              {!isUser && (
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs text-slate-400">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold flex-wrap">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>જ્ઞાન સહાયક</span>
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300 rounded-md px-2 py-0.5 flex items-center gap-1 shadow-2xs">
                      <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                      <span>૧૦૦% GSEB પ્રમાણિત ઉત્તર</span>
                    </span>
                    {isSpeakingThis && (
                      <div className="flex items-center gap-1.5 ml-1 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full shadow-2xs">
                        <span className="flex items-center gap-0.5 h-3">
                          <span className="w-0.5 h-2 bg-amber-600 animate-pulse" />
                          <span className="w-0.5 h-3 bg-amber-600 animate-pulse delay-75" />
                          <span className="w-0.5 h-2.5 bg-amber-600 animate-pulse delay-150" />
                        </span>
                        <span className="text-[10px] text-amber-900 font-bold">
                          બોલાઈ રહ્યું છે...
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Font Size Adjuster Button */}
                    <button
                      onClick={cycleFontSize}
                      title={`ફોન્ટનું કદ બદલો: હાલ ${fontSize === 'normal' ? 'સામાન્ય' : fontSize === 'large' ? 'મોટું' : 'ખૂબ મોટું'}`}
                      className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Type className="w-3 h-3" />
                      <span className="font-semibold">{fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}</span>
                    </button>

                    {/* Reader Mode (Fullscreen Modal) Button */}
                    <button
                      onClick={() => setIsReaderModalOpen(true)}
                      title="આખો જવાબ મોટા અક્ષરે સંપૂર્ણ વાંચો (Full Reader Mode)"
                      className="p-1 rounded-md hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    <span>{formattedTime}</span>
                  </div>
                </div>
              )}

              {/* Message Body with complete readability */}
              <div className={`${isUser ? 'text-white text-sm sm:text-base leading-relaxed' : getFontSizeClass()}`}>
                {isUser ? (
                  <p className="whitespace-pre-wrap font-medium">{message.text}</p>
                ) : (
                  renderFormattedContent(message.text)
                )}

                {/* Streaming pulse indicator */}
                {message.isStreaming && (
                  <span className="inline-block w-2.5 h-4 ml-1 bg-emerald-600 animate-pulse align-middle rounded-xs" />
                )}
              </div>

              {/* User message time */}
              {isUser && (
                <div className="text-[10px] text-emerald-200 text-right mt-1.5 font-medium">
                  {formattedTime}
                </div>
              )}
            </div>

            {/* Action Bar for AI Responses (3D Tactile Buttons) */}
            {!isUser && !message.isStreaming && (
              <div className="flex items-center gap-1.5 mt-2 px-1 text-slate-500">
                {/* Copy response */}
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/70 text-slate-700 hover:text-emerald-800 transition-all shadow-2xs active:scale-95"
                  title="જવાબ નકલ કરો"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] text-emerald-700 font-bold">નકલ થઈ ગયું!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[11px]">નકલ કરો</span>
                    </>
                  )}
                </button>

                {/* Speak / Stop Button */}
                <button
                  onClick={handleToggleSpeak}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-2xs active:scale-95 border ${
                    isSpeakingThis
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-amber-200'
                      : 'bg-white border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/70 text-slate-700 hover:text-amber-800'
                  }`}
                  title={isSpeakingThis ? 'અવાજ બંધ કરો' : 'મોટેથી સાંભળો'}
                >
                  {isSpeakingThis ? (
                    <>
                      <Square className="w-3.5 h-3.5 text-amber-800 fill-amber-800" />
                      <span className="text-[11px]">અવાજ રોકો</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-[11px]">સાંભળો</span>
                    </>
                  )}
                </button>

                {/* Replay button */}
                {!isSpeakingThis && (
                  <button
                    onClick={() => onSpeak(message.text, message.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition-all shadow-2xs active:scale-95"
                    title="ફરીથી સાંભળો"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                    <span className="text-[11px]">ફરીથી</span>
                  </button>
                )}

                {/* Share Button (WhatsApp / All Apps / Print) */}
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 hover:border-emerald-300 transition-all shadow-2xs active:scale-95"
                  title="જવાબ વોટ્સએપ કે અન્ય એપમાં શેર કરો"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[11px]">શેર કરો</span>
                </button>

                {/* Read Fullscreen Modal trigger */}
                <button
                  onClick={() => setIsReaderModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 transition-all shadow-2xs active:scale-95 ml-auto"
                  title="આખો જવાબ મોટા અક્ષરે વાંચો"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] hidden sm:inline">આખો જવાબ વાંચો</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Reading Mode Modal: 100% full readability */}
      {isReaderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:px-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-b border-emerald-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center shadow-sm">
                  જ્ઞા
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>જ્ઞાન સહાયક – સંપૂર્ણ વાચન મોડ</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100/80 rounded-full px-2 py-0.2">
                      GSEB સિલેબસ
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    આખો જવાબ સરળતાથી અને મોટા અક્ષરોમાં વાંચો અથવા સાંભળો
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio button inside modal */}
                <button
                  onClick={handleToggleSpeak}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs border ${
                    isSpeakingThis
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white border-slate-200 hover:border-amber-400 text-slate-700 hover:bg-amber-50'
                  }`}
                  title={isSpeakingThis ? 'અવાજ રોકો' : 'મોટેથી સાંભળો'}
                >
                  {isSpeakingThis ? <Square className="w-4 h-4 fill-white" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
                  <span className="hidden sm:inline">{isSpeakingThis ? 'રોકો' : 'સાંભળો'}</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsReaderModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="બંધ કરો"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable with Large, Comfortable Font */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 text-slate-900 font-gujarati text-base sm:text-lg leading-relaxed sm:leading-loose">
              {renderFormattedContent(message.text)}
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-3.5 sm:px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'નકલ થઈ ગયું!' : 'જવાબ નકલ કરો'}</span>
                </button>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="વોટ્સએપ કે અન્ય જગ્યાએ શેર કરો"
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>શેર કરો</span>
                </button>
              </div>

              <button
                onClick={() => setIsReaderModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs"
              >
                વાંચી લીધું / બંધ કરો
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        question={userQuestion}
        answerText={message.text}
      />
    </>
  );
};
