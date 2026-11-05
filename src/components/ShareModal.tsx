import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Download,
  Printer,
  X,
  MessageCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  question?: string;
  answerText: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  question,
  answerText,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Format clean share text for messaging apps
  const cleanedAnswer = answerText
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .trim();

  const formattedShareText = question
    ? `📚 *જ્ઞાન સહાયક - GSEB ધોરણ ૬ થી ૮ અભ્યાસ સહાયક*\n\n❓ *પ્રશ્ન:* ${question}\n\n💡 *ઉત્તર:*\n${cleanedAnswer}\n\n✨ *જ્ઞાન સહાયક – શુદ્ધ ગુજરાતી શિક્ષણ સહાયક*\n📞 *સહાયક હેલ્પલાઇન:* 1800-233-7965\n🌐 https://ais-pre-ykl5yigfojkuastvcwblsz-26433176493.asia-southeast1.run.app`
    : `📚 *જ્ઞાન સહાયક - GSEB ધોરણ ૬ થી ૮ અભ્યાસ સહાયક*\n\n💡 *ઉત્તર:*\n${cleanedAnswer}\n\n✨ *જ્ઞાન સહાયક – શુદ્ધ ગુજરાતી શિક્ષણ સહાયક*\n📞 *સહાયક હેલ્પલાઇન:* 1800-233-7965\n🌐 https://ais-pre-ykl5yigfojkuastvcwblsz-26433176493.asia-southeast1.run.app`;

  // 1. WhatsApp Share
  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(formattedShareText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  // 2. Native Web Share API
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: question || 'જ્ઞાન સહાયક ઉત્તર',
          text: formattedShareText,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  // 3. Copy Text
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy share text:', e);
    }
  };

  // 4. Download as Text File
  const handleDownloadTxt = () => {
    try {
      const blob = new Blob([formattedShareText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Gyan_Sahayak_Study_Note_${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download text file:', e);
    }
  };

  // 5. Print / Save as PDF
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="gu">
        <head>
          <meta charset="UTF-8">
          <title>જ્ઞાન સહાયક - GSEB અભ્યાસ નોંધ</title>
          <style>
            body { font-family: 'Noto Sans Gujarati', sans-serif, system-ui; padding: 30px; line-height: 1.8; color: #1e293b; }
            h1 { color: #047857; font-size: 20px; border-bottom: 2px solid #047857; padding-bottom: 8px; }
            .question-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; }
            .answer-box { white-space: pre-wrap; font-size: 15px; }
            .footer { margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>જ્ઞાન સહાયક – GSEB ધોરણ ૬ થી ૮ અભ્યાસ સહાયક</h1>
          ${question ? `<div class="question-box">❓ પ્રશ્ન: ${question}</div>` : ''}
          <div class="answer-box"><strong>💡 ઉત્તર:</strong><br><br>${cleanedAnswer.replace(/\n/g, '<br>')}</div>
          <div class="footer">તૈયાર કરનાર: જ્ઞાન સહાયક | ગુજરાત રાજ્ય શાળા પાઠ્યપુસ્તક મંડળ અભ્યાસક્રમ આધારિત | હેલ્પલાઇન: 1800-233-7965</div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-100 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">જવાબ શેર કરો (Share Answer)</h3>
              <p className="text-[11px] text-white/80">મિત્રો, શિક્ષકો અથવા પરિવાર સાથે સરળતાથી શેર કરો</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="બંધ કરો"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Sharing Channels */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* WhatsApp Direct Share Button (Primary) */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all active:scale-98 font-bold text-sm border-b-3 border-emerald-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-extrabold text-sm">વોટ્સએપ પર શેર કરો (WhatsApp)</p>
                <p className="text-[11px] text-white/80 font-normal">૧-ક્લિકમાં મિત્રો અથવા ગ્રૂપમાં મોકલો</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </button>

          {/* Device Native Share (If supported) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all active:scale-98 font-bold text-sm border-b-3 border-blue-900"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-sm">અન્ય એપ્સમાં શેર કરો (All Apps)</p>
                  <p className="text-[11px] text-white/80 font-normal">Telegram, Gmail, Messages વગેરે</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </button>
          )}

          {/* Quick Action Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {/* Copy All */}
            <button
              onClick={handleCopy}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 shadow-2xs ${
                copied
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Copy className="w-5 h-5 text-slate-600" />
              )}
              <span className="text-xs font-bold">{copied ? 'નકલ થઈ ગયું!' : 'લખાણ કોપી'}</span>
            </button>

            {/* Download as .txt file */}
            <button
              onClick={handleDownloadTxt}
              className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-center transition-all flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:border-emerald-300"
            >
              <Download className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold">ફાઇલ ડાઉનલોડ</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={handlePrint}
              className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-center transition-all flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:border-amber-300"
            >
              <Printer className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold">પ્રિન્ટ / PDF</span>
            </button>
          </div>

          {/* Share Preview Card */}
          <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-400 block mb-1">શેર મેસેજ પ્રીવ્યુ (Preview):</span>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 max-h-32 overflow-y-auto text-slate-700 font-mono text-[11px] leading-relaxed select-all">
              {question && <p className="font-bold text-emerald-800 mb-1">❓ {question}</p>}
              <p className="line-clamp-4">{cleanedAnswer}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 font-medium">GSEB અભ્યાસક્રમ અનુસાર પ્રમાણિત</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            બંધ કરો
          </button>
        </div>
      </div>
    </div>
  );
};
