import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Calculator,
  Microscope,
  Compass,
  BookOpen,
  Languages,
  ScrollText,
  FileText,
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  Flame,
  Award,
  Volume2,
  Phone,
} from 'lucide-react';
import { StandardGrade, SubjectCategory, PromptSuggestion } from '../types/chat';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  filterTopic: string | null;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt, filterTopic }) => {
  const [selectedGrade, setSelectedGrade] = useState<StandardGrade>('all');
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory | 'all'>('all');

  const handlePromptClick = (prompt: string) => {
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#059669', '#d97706', '#2563eb', '#e11d48', '#8b5cf6'],
      });
    } catch (e) {
      // ignore
    }
    onSelectPrompt(prompt);
  };

  const subjectsList: Array<{
    id: SubjectCategory | 'all';
    name: string;
    icon: any;
    accentColor: string;
    bgGradient: string;
    borderAccent: string;
    note?: string;
  }> = [
    {
      id: 'all',
      name: 'બધા વિષયો',
      icon: GraduationCap,
      accentColor: 'text-indigo-600',
      bgGradient: 'from-indigo-500 to-purple-600',
      borderAccent: 'border-b-indigo-700',
      note: 'સંપૂર્ણ GSEB સિલેબસ',
    },
    {
      id: 'maths',
      name: 'ગણિત',
      icon: Calculator,
      accentColor: 'text-blue-600',
      bgGradient: 'from-blue-600 to-cyan-600',
      borderAccent: 'border-b-blue-800',
      note: 'સ્ટેપ-બાય-સ્ટેપ દાખલા',
    },
    {
      id: 'science',
      name: 'વિજ્ઞાન',
      icon: Microscope,
      accentColor: 'text-emerald-600',
      bgGradient: 'from-emerald-600 to-teal-600',
      borderAccent: 'border-b-emerald-800',
      note: 'પ્રયોગો & વ્યાખ્યા',
    },
    {
      id: 'social',
      name: 'સામાજિક વિજ્ઞાન',
      icon: Compass,
      accentColor: 'text-amber-600',
      bgGradient: 'from-amber-500 to-orange-600',
      borderAccent: 'border-b-amber-700',
      note: 'ઇતિહાસ & ભૂગોળ',
    },
    {
      id: 'hindi',
      name: 'હિન્દી (Hindi)',
      icon: FileText,
      accentColor: 'text-rose-600',
      bgGradient: 'from-rose-500 to-pink-600',
      borderAccent: 'border-b-rose-700',
      note: 'વ્યાકરણ, કવિતા & પાઠ',
    },
    {
      id: 'english',
      name: 'અંગ્રેજી (English)',
      icon: Languages,
      accentColor: 'text-violet-600',
      bgGradient: 'from-violet-600 to-indigo-600',
      borderAccent: 'border-b-violet-800',
      note: 'Grammar & Vocabulary',
    },
    {
      id: 'sanskrit',
      name: 'સંસ્કૃત (Sanskrit)',
      icon: ScrollText,
      accentColor: 'text-orange-600',
      bgGradient: 'from-orange-500 to-amber-600',
      borderAccent: 'border-b-orange-700',
      note: 'શ્લોક + ભાવાર્થ',
    },
    {
      id: 'gujarati',
      name: 'ગુજરાતી',
      icon: BookOpen,
      accentColor: 'text-emerald-700',
      bgGradient: 'from-emerald-600 to-lime-600',
      borderAccent: 'border-b-emerald-800',
      note: 'વ્યાકરણ & સાહિત્ય',
    },
    {
      id: 'computer',
      name: 'કમ્પ્યુટર',
      icon: Cpu,
      accentColor: 'text-cyan-600',
      bgGradient: 'from-cyan-600 to-blue-600',
      borderAccent: 'border-b-cyan-800',
      note: 'ટેકનોલોજી & સાયબર',
    },
  ];

  const standardStudyQuestions: PromptSuggestion[] = [
    // Standard 6 (ધોરણ ૬)
    {
      category: 'maths',
      categoryLabel: 'ગણિત',
      grade: 'std6',
      gradeLabel: 'ધોરણ ૬',
      prompt: 'ધોરણ ૬ ગણિત: પૂર્ણાંક સંખ્યાઓ (Integers) ના સરવાળા અને બાદબાકીના નિયમો ઉદાહરણ સાથે સમજાવો.',
      iconName: 'Calculator',
    },
    {
      category: 'science',
      categoryLabel: 'વિજ્ઞાન',
      grade: 'std6',
      gradeLabel: 'ધોરણ ૬',
      prompt: 'ધોરણ ૬ વિજ્ઞાન: પ્રકાશસંશ્લેષણ (Photosynthesis) એટલે શું? વનસ્પતિમાં ખોરાક બનવાની પ્રક્રિયા મુદ્દાસર સમજાવો.',
      iconName: 'Microscope',
    },
    {
      category: 'social',
      categoryLabel: 'સામાજિક વિજ્ઞાન',
      grade: 'std6',
      gradeLabel: 'ધોરણ ૬',
      prompt: 'ધોરણ ૬ સામાજિક વિજ્ઞાન: હડપ્પીય સભ્યતા અને લોથલ બંદરના નગર આયોજનની મુખ્ય વિશેષતાઓ જણાવો.',
      iconName: 'Compass',
    },
    {
      category: 'hindi',
      categoryLabel: 'હિન્દી',
      grade: 'std6',
      gradeLabel: 'ધોરણ ૬',
      prompt: 'कक्षा 6 हिंदी: "वह चिड़िया जो" કવિતાનો મુખ્ય સાર અને કવિ કેદારનાથ અગ્રવાલનો સંદેશ ગુજરાતીમાં સરળ રીતે સમજાવો.',
      iconName: 'FileText',
    },
    {
      category: 'hindi',
      categoryLabel: 'હિન્દી',
      grade: 'std6',
      gradeLabel: 'ધોરણ ૬',
      prompt: 'कक्षा 6 हिंदी व्याकरण: संज्ञा (Noun) અને તેના મુખ્ય પ્રકારો (વ્યક્તિવાચક, જાતિવાચક, ભાવવાચક) હિન્દી ઉદાહરણો અને ગુજરાતી સમજૂતી સાથે શીખવો.',
      iconName: 'FileText',
    },
    {
      category: 'english',
      categoryLabel: 'અંગ્રેજી',
      grade: 'std6',
      gradeLabel: 'ધોરણ ૬',
      prompt: 'Class 6 English: Simple Present Tense ના નિયમો અને ૫ દૈનિક ક્રિયાઓના ઉદાહરણો ગુજરાતી સમજૂતી સાથે આપો.',
      iconName: 'Languages',
    },
    {
      category: 'sanskrit',
      categoryLabel: 'સંસ્કૃત',
      grade: 'std6',
      gradeLabel: 'ધોરણ ૬',
      prompt: 'ધોરણ ૬ સંસ્કૃત: "વિદ્યા દદાતિ વિનયમ્" સુભાષિતનો સંસ્કૃત શ્લોક, શબ્દાર્થ અને ગુજરાતીમાં ભાવાર્થ સમજાવો.',
      iconName: 'ScrollText',
    },
    {
      category: 'gujarati',
      categoryLabel: 'ગુજરાતી',
      grade: 'std6',
      gradeLabel: 'ધોરણ ૬',
      prompt: 'ધોરણ ૬ ગુજરાતી: સંજ્ઞા (નામ) એટલે શું? સંજ્ઞાના મુખ્ય પ્રકારો (વ્યક્તિવાચક, જાતિવાચક, દ્રવ્યવાચક) ઉદાહરણ સાથે સમજાવો.',
      iconName: 'BookOpen',
    },

    // Standard 7 (ધોરણ ૭)
    {
      category: 'maths',
      categoryLabel: 'ગણિત',
      grade: 'std7',
      gradeLabel: 'ધોરણ ૭',
      prompt: 'ધોરણ ૭ ગણિત: સુરેખ સમીકરણ (Linear Equations) ઉકેલવાની સ્ટેપ-બાય-સ્ટેપ રીત સરળ ઉદાહરણ સાથે શીખવો.',
      iconName: 'Calculator',
    },
    {
      category: 'science',
      categoryLabel: 'વિજ્ઞાન',
      grade: 'std7',
      gradeLabel: 'ધોરણ ૭',
      prompt: 'ધોરણ ૭ વિજ્ઞાન: એસિડ, બેઇઝ અને ક્ષાર (Acids, Bases & Salts) વચ્ચેનો તફાવત અને લિટમસ પત્ર પર તેમની અસર સમજાવો.',
      iconName: 'Microscope',
    },
    {
      category: 'social',
      categoryLabel: 'સામાજિક વિજ્ઞાન',
      grade: 'std7',
      gradeLabel: 'ધોરણ ૭',
      prompt: 'ધોરણ ૭ સામાજિક વિજ્ઞાન: પૃથ્વીના આંતરિક સ્તરો (ભૂગર્ભ, મેન્ટલ અને પોપડો) ની રચના મુદ્દાવાર સમજાવો.',
      iconName: 'Compass',
    },
    {
      category: 'hindi',
      categoryLabel: 'હિન્દી',
      grade: 'std7',
      gradeLabel: 'ધોરણ ૭',
      prompt: 'कक्षा 7 हिंदी व्याकरण: कारक (Case) એટલે શું? કર્તા, કર્મ અને કરણ કારકના નિયમો હિન્દી ઉદાહરણ અને ગુજરાતી સમજૂતી સાથે જણાવો.',
      iconName: 'FileText',
    },
    {
      category: 'hindi',
      categoryLabel: 'હિન્દી',
      grade: 'std7',
      gradeLabel: 'ધોરણ ૭',
      prompt: 'कक्षा 7 हिंदी: मुहावरे (દા.ત. આંખો કા તારા, ફૂલે ન સમાના, હાથ બટાના) ના અર્થ, હિન્દી વાક્ય પ્રયોગ અને ગુજરાતી ભાવાર્થ આપો.',
      iconName: 'FileText',
    },
    {
      category: 'english',
      categoryLabel: 'અંગ્રેજી',
      grade: 'std7',
      gradeLabel: 'ધોરણ ૭',
      prompt: 'Class 7 English: Prepositions (in, on, at, under, between) નો ઉપયોગ ક્યારે કરવો? ઉદાહરણો સાથે ગુજરાતીમાં સમજાવો.',
      iconName: 'Languages',
    },
    {
      category: 'sanskrit',
      categoryLabel: 'સંસ્કૃત',
      grade: 'std7',
      gradeLabel: 'ધોરણ ૭',
      prompt: 'ધોરણ ૭ સંસ્કૃત: પઠ્ (પઢવું) ધાતુના વર્તમાનકાળ (લટ્ લકાર) ના રૂપો કોષ્ટક સાથે અને ગુજરાતી અર્થ સાથે લખો.',
      iconName: 'ScrollText',
    },

    // Standard 8 (ધોરણ ૮)
    {
      category: 'maths',
      categoryLabel: 'ગણિત',
      grade: 'std8',
      gradeLabel: 'ધોરણ ૮',
      prompt: 'ધોરણ ૮ ગણિત: વર્ગ અને વર્ગમૂળ (Square and Square Roots) શોધવાની અવિભાજ્ય અવયવની રીત ઉદાહરણ સાથે ગણો.',
      iconName: 'Calculator',
    },
    {
      category: 'science',
      categoryLabel: 'વિજ્ઞાન',
      grade: 'std8',
      gradeLabel: 'ધોરણ ૮',
      prompt: 'ધોરણ ૮ વિજ્ઞાન: બળ અને દબાણ (Force and Pressure) એટલે શું? વાતાવરણનું દબાણ આપણા જીવનમાં કેવી રીતે કામ કરે છે?',
      iconName: 'Microscope',
    },
    {
      category: 'social',
      categoryLabel: 'સામાજિક વિજ્ઞાન',
      grade: 'std8',
      gradeLabel: 'ધોરણ ૮',
      prompt: 'ધોરણ ૮ સામાજિક વિજ્ઞાન: ભારતના બંધારણના મુખ્ય લક્ષણો અને નાગરિકોના ૬ મૂળભૂત અધિકારો સમજાવો.',
      iconName: 'Compass',
    },
    {
      category: 'hindi',
      categoryLabel: 'હિન્દી',
      grade: 'std8',
      gradeLabel: 'ધોરણ ૮',
      prompt: 'कक्षा 8 हिंदी: "दीवानों की हस्ती" કવિતાનો ભાવાર્થ અને કવિ ભગવતી ચરણ વર્માનો જીવન સંદેશ સરળ ગુજરાતીમાં સમજાવો.',
      iconName: 'FileText',
    },
    {
      category: 'hindi',
      categoryLabel: 'હિન્દી',
      grade: 'std8',
      gradeLabel: 'ધોરણ ૮',
      prompt: 'कक्षा 8 हिंदी व्याकरण: संधि અને સમાસ વચ્ચેનો તફાવત હિન્દી ઉદાહરણો તથા ગુજરાતી સમજૂતી સાથે સ્પષ્ટ કરો.',
      iconName: 'FileText',
    },
    {
      category: 'gujarati',
      categoryLabel: 'ગુજરાતી',
      grade: 'std8',
      gradeLabel: 'ધોરણ ૮',
      prompt: 'ધોરણ ૮ ગુજરાતી વ્યાકરણ: દ્વન્દ્વ સમાસ અને તત્પુરુષ સમાસ વચ્ચેનો ભેદ ઉદાહરણો આપી વિગ્રહ સાથે સમજાવો.',
      iconName: 'BookOpen',
    },
    {
      category: 'english',
      categoryLabel: 'અંગ્રેજી',
      grade: 'std8',
      gradeLabel: 'ધોરણ ૮',
      prompt: 'Class 8 English: Active Voice and Passive Voice ના ફેરફારના મુખ્ય નિયમો ગુજરાતીમાં ઉદાહરણ સાથે શીખવો.',
      iconName: 'Languages',
    },
    {
      category: 'sanskrit',
      categoryLabel: 'સંસ્કૃત',
      grade: 'std8',
      gradeLabel: 'ધોરણ ૮',
      prompt: 'ધોરણ ૮ સંસ્કૃત: "સર્વે ભવન્તુ સુખિનઃ" મહામંત્રનો સંપૂર્ણ શ્લોક, અન્વય અને જીવનમાં તેનું મહત્ત્વ ગુજરાતીમાં સમજાવો.',
      iconName: 'ScrollText',
    },
    {
      category: 'computer',
      categoryLabel: 'કમ્પ્યુટર',
      grade: 'std8',
      gradeLabel: 'ધોરણ ૮',
      prompt: 'ધોરણ ૮ કમ્પ્યુટર: ઇન્ટરનેટ, વેબ બ્રાઉઝર અને સાયબર સુરક્ષા (Cyber Security) ના મૂળભૂત નિયમો ગુજરાતીમાં જણાવો.',
      iconName: 'Cpu',
    },
  ];

  // Filtering by Grade & Subject
  const filtered = standardStudyQuestions.filter((item) => {
    const matchGrade = selectedGrade === 'all' || item.grade === selectedGrade;
    const matchSubject = selectedSubject === 'all' || item.category === selectedSubject;
    const matchTopicProp = !filterTopic || item.category === filterTopic;
    return matchGrade && matchSubject && matchTopicProp;
  });

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-4 h-4 text-blue-600" />;
      case 'Microscope':
        return <Microscope className="w-4 h-4 text-emerald-600" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-amber-600" />;
      case 'Languages':
        return <Languages className="w-4 h-4 text-violet-600" />;
      case 'ScrollText':
        return <ScrollText className="w-4 h-4 text-orange-600" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-rose-600" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-cyan-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6">
      {/* 3D Pop Hero Card with Vibrant Mesh Gradients */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-amber-600 p-1 sm:p-1.5 shadow-[0_20px_50px_-10px_rgba(5,150,105,0.35)] mb-8 transition-all">
        {/* Animated background highlights */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-300/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative bg-white/95 backdrop-blur-xl rounded-[22px] px-5 sm:px-8 py-7 sm:py-9 text-center">
          {/* 3D Floating Badge Element */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-300/60 text-xs font-bold text-amber-900 shadow-sm mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
            </span>
            <span className="tracking-wide">ગુજરાત બોર્ડ (GSEB / GCERT) લેટેસ્ટ અભ્યાસક્રમ ૨૦૨૪-૨૫ / ૨૦૨૫-૨૬</span>
            <Award className="w-3.5 h-3.5 text-amber-600" />
          </div>

          {/* 3D Pop Logo with Deep Perspective Shadow */}
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 p-1 shadow-[0_12px_24px_-4px_rgba(5,150,105,0.4)] border-b-4 border-emerald-900 hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-[14px] sm:rounded-[20px] flex items-center justify-center shadow-inner">
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-600 bg-clip-text text-transparent">
                  જ્ઞા
                </span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            ધોરણ ૬ થી ૮ અભ્યાસ સહાયક –{' '}
            <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 bg-clip-text text-transparent">
              જ્ઞાન સહાયક
            </span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed mb-5 font-medium">
            ગુજરાત બોર્ડના <strong>તમામ વિષયો</strong>ના પ્રશ્નો પૂછો અથવા બોલો. AI સંપૂર્ણ જવાબ શુદ્ધ ગુજરાતીમાં તથા
            વિષય મુજબ <strong>લાગુ પડતી ભાષા (હિન્દી, અંગ્રેજી, સંસ્કૃત)</strong> માં તાત્કાલિક અવાજ સાથે સમજાવશે.
          </p>

          {/* 3D Pop Gyan Sahayak Helpline & Support Banner */}
          <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-left max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Phone className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-amber-950">જ્ઞાન સહાયક / વિદ્યાર્થી હેલ્પલાઇન નંબર:</span>
                  <span className="text-[10px] bg-emerald-700 text-white font-extrabold px-2 py-0.5 rounded-full">ટોલ-ફ્રી</span>
                </div>
                <div className="text-sm sm:text-base font-black text-emerald-900 tracking-wide mt-0.5 flex items-center gap-2">
                  <span>📞 ૧૮૦૦-૨૩૩-૭૯૬૫</span>
                  <span className="text-xs text-slate-600 font-normal">(1800-233-7965)</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  વિદ્યા સમીક્ષા કેન્દ્ર (VSK) & ગાંધીનગર શિક્ષણ બોર્ડ વિદ્યાર્થી સહાય સેવા
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:18002337965"
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>કૉલ કરો</span>
              </a>
              <button
                onClick={() => onSelectPrompt('જ્ઞાન સહાયક હેલ્પલાઇન નંબર (1800-233-7965) અને શિક્ષણ સહાય સેવાઓ વિશે વિગતવાર માહિતી આપો.')}
                className="px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95"
              >
                વિગતો પૂછો
              </button>
            </div>
          </div>

          {/* 3D Feature Pills Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>GSEB પાઠ્યપુસ્તક મુજબ</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>સ્ટેપ-બાય-સ્ટેપ દાખલા</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 shadow-2xs">
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>જવાબ આપતાં જ બોલશે</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-200 shadow-2xs">
              <Languages className="w-3.5 h-3.5 text-rose-600" />
              <span>ગુજ / હિન્દી / English</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3D Pop Grade Selector Tabs (ધોરણ પસંદગી - Tactile 3D Buttons) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span>ધોરણ પસંદ કરો (Select Standard):</span>
          </span>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
            GSEB / NCERT માન્ય
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 bg-slate-200/70 rounded-2xl shadow-inner">
          {[
            {
              id: 'all',
              label: 'બધા ધોરણ (Std 6-8)',
              sub: 'સમગ્ર પ્રાથમિક અભ્યાસક્રમ',
              activeGradient: 'from-emerald-700 to-teal-800 text-white border-b-4 border-emerald-900',
            },
            {
              id: 'std6',
              label: 'ધોરણ ૬ (Class 6)',
              sub: 'પલાશ, ગણિત, વિજ્ઞાન...',
              activeGradient: 'from-blue-600 to-indigo-700 text-white border-b-4 border-blue-900',
            },
            {
              id: 'std7',
              label: 'ધોરણ ૭ (Class 7)',
              sub: 'ગણિત, વિજ્ઞાન, સામાજિક...',
              activeGradient: 'from-emerald-600 to-teal-700 text-white border-b-4 border-emerald-900',
            },
            {
              id: 'std8',
              label: 'ધોરણ ૮ (Class 8)',
              sub: 'બોર્ડ તૈયારી & વિભાવનાઓ',
              activeGradient: 'from-amber-600 to-orange-700 text-white border-b-4 border-amber-900',
            },
          ].map((g) => {
            const isSelected = selectedGrade === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGrade(g.id as StandardGrade)}
                className={`py-2.5 px-3 rounded-xl text-left transition-all relative ${
                  isSelected
                    ? `bg-gradient-to-r ${g.activeGradient} shadow-md -translate-y-0.5`
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-b-2 border-slate-300 hover:border-slate-400 hover:-translate-y-0.5 shadow-2xs'
                }`}
              >
                <p className="text-xs sm:text-sm font-extrabold truncate">{g.label}</p>
                <p className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {g.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Colorful 3D Subject Filter Carousel */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>વિષય પસંદ કરો (Subjects):</span>
          </span>
          <span className="text-xs text-slate-400 font-medium">ક્લિક કરીને ફિલ્ટર કરો</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none">
          {subjectsList.map((sub) => {
            const Icon = sub.icon;
            const isSelected = selectedSubject === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? `bg-gradient-to-r ${sub.bgGradient} text-white shadow-md border-b-4 ${sub.borderAccent} -translate-y-1`
                    : 'bg-white text-slate-700 border border-slate-200 border-b-3 border-b-slate-300 hover:border-emerald-300 hover:bg-emerald-50/40 hover:-translate-y-0.5 shadow-2xs'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 ' + sub.accentColor
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span>{sub.name}</span>
                  {sub.note && (
                    <span className={`text-[9px] font-normal ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {sub.note}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Pop Spotlight Question of the Day */}
      <div className="mb-7 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.3)]">
        <div className="bg-white rounded-[22px] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md border-b-2 border-amber-700">
              <Flame className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  આજનો ખાસ પરીક્ષા પ્રશ્ન
                </span>
                <span className="text-xs text-slate-400 font-medium">GSEB વિજ્ઞાન & ગણિત</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                "ધોરણ ૮ વિજ્ઞાન: પાક ઉત્પાદન અને વ્યવસ્થાપનમાં સિંચાઈની ફુવારા પદ્ધતિ અને ટપક પદ્ધતિ સમજાવો."
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              handlePromptClick(
                'ધોરણ ૮ વિજ્ઞાન: પાક ઉત્પાદન અને વ્યવસ્થાપન - સિંચાઈની આધુનિક પદ્ધતિઓ (ફુવારા પદ્ધતિ અને ટપક પદ્ધતિ) GSEB પાઠ્યપુસ્તક મુજબ મુદ્દાસર સમજાવો.'
              )
            }
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-md hover:shadow-lg border-b-3 border-orange-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span>જવાબ મેળવો & સાંભળો</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Colorful 3D Study Questions Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3.5 px-1">
          <h2 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
            <span>મહત્વના પાઠ્યપુસ્તક પ્રશ્નો ({filtered.length})</span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">એક ક્લિકમાં સંપૂર્ણ ઉત્તર મેળવો</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filtered.slice(0, 10).map((item, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(item.prompt)}
              className="group text-left p-4 sm:p-5 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-white hover:via-emerald-50/30 hover:to-amber-50/20 border border-slate-200/90 hover:border-emerald-400 border-b-4 border-b-slate-200 hover:border-b-emerald-600 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-6px_rgba(5,150,105,0.18)] hover:-translate-y-1.5 active:translate-y-0 active:border-b-2 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-emerald-100 transition-colors shadow-2xs">
                      {getSubjectIcon(item.iconName)}
                    </div>
                    <span className="text-xs font-black text-slate-800 group-hover:text-emerald-900 transition-colors">
                      {item.categoryLabel}
                    </span>
                  </div>

                  {item.gradeLabel && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-lg px-2 py-0.5 shadow-2xs">
                      {item.gradeLabel}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-800 font-semibold group-hover:text-slate-950 leading-relaxed line-clamp-3">
                  "{item.prompt}"
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  લાગુ પડતી ભાષા + શુદ્ધ ગુજરાતી
                </span>
                <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 group-hover:translate-x-1 transition-transform">
                  જવાબ વાંચો & સાંભળો <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Pop Study Features Grid */}
      <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-200/80 shadow-md">
        <h3 className="text-xs sm:text-sm font-black text-emerald-950 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>ધોરણ ૬ થી ૮ ના વિદ્યાર્થીઓ માટે જ્ઞાન સહાયક ની ૪ ખાસ વિશેષતાઓ:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-700">
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 border-b-3 border-b-emerald-400 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mb-2 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <p className="font-extrabold text-slate-900 text-xs sm:text-sm">GSEB લેટેસ્ટ અભ્યાસક્રમ</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              ગાંધીનગર પાઠ્યપુસ્તક મંડળના તાજેતરના સ્વાધ્યાય અને પરીક્ષા પદ્ધતિ આધારિત.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-blue-100 border-b-3 border-b-blue-400 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center mb-2 shadow-2xs">
              <Calculator className="w-5 h-5 text-blue-700" />
            </div>
            <p className="font-extrabold text-slate-900 text-xs sm:text-sm">સ્ટેપ-બાય-સ્ટેપ ગણિત</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              દરેક દાખલાનું સ્પષ્ટ પગથિયું, જરૂરી સૂત્રો અને પદ્ધતિસરની ગણતરી.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-rose-100 border-b-3 border-b-rose-400 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 font-bold flex items-center justify-center mb-2 shadow-2xs">
              <Languages className="w-5 h-5 text-rose-700" />
            </div>
            <p className="font-extrabold text-slate-900 text-xs sm:text-sm">લાગુ પડતી ભાષામાં ઉત્તર</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              હિન્દીમાં પૂછો તો હિન્દીમાં, અંગ્રેજીમાં તો અંગ્રેજીમાં અને સંસ્કૃતમાં તો સંસ્કૃતમાં!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-amber-100 border-b-3 border-b-amber-400 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center mb-2 shadow-2xs">
              <Volume2 className="w-5 h-5 text-amber-700" />
            </div>
            <p className="font-extrabold text-slate-900 text-xs sm:text-sm">તાત્કાલિક અવાજ (Auto-Speech)</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              ન્યુરલ અવાજ દ્વારા જવાબ પૂર્ણ થતાં જ આપમેળે બોલાઈને સંભળાશે.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
