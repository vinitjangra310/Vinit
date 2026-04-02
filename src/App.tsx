import React, { useState, useMemo } from 'react';
import { 
  Brain, 
  Target, 
  GraduationCap, 
  TrendingUp, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Loader2, 
  CheckCircle2,
  BarChart3,
  BookOpen,
  Briefcase,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { UserData, CareerRecommendation } from './types';
import { getCareerRecommendation } from './lib/gemini';

const STEPS = [
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'skills', title: 'Skills', icon: Brain },
  { id: 'interests', title: 'Interests', icon: Target },
  { id: 'performance', title: 'Performance', icon: BarChart3 },
];

const SKILL_OPTIONS = [
  "Programming", "Mathematics", "Public Speaking", "Writing", "Design", 
  "Problem Solving", "Leadership", "Data Analysis", "Critical Thinking", 
  "Creativity", "Teamwork", "Research", "Marketing", "Financial Literacy"
];

const INTEREST_OPTIONS = [
  "Technology", "Healthcare", "Business", "Arts & Culture", "Environment", 
  "Social Work", "Law & Justice", "Space Exploration", "Gaming", "Education",
  "Sports", "Music", "Politics", "Entrepreneurship"
];

export default function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<CareerRecommendation | null>(null);
  const [userData, setUserData] = useState<UserData>({
    skills: [],
    interests: [],
    academicPerformance: {
      math: 70,
      science: 70,
      language: 70,
      arts: 70,
      socialStudies: 70,
    },
    educationLevel: 'High School (Class X-XII)',
  });

  const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const toggleItem = (list: string[], item: string, key: 'skills' | 'interests') => {
    setUserData(prev => ({
      ...prev,
      [key]: list.includes(item) 
        ? list.filter(i => i !== item) 
        : [...list, item]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await getCareerRecommendation(userData);
      setRecommendation(result);
    } catch (error) {
      console.error("Failed to get recommendation:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const radarData = useMemo(() => [
    { subject: 'Math', A: userData.academicPerformance.math, fullMark: 100 },
    { subject: 'Science', A: userData.academicPerformance.science, fullMark: 100 },
    { subject: 'Language', A: userData.academicPerformance.language, fullMark: 100 },
    { subject: 'Arts', A: userData.academicPerformance.arts, fullMark: 100 },
    { subject: 'Social', A: userData.academicPerformance.socialStudies, fullMark: 100 },
  ], [userData.academicPerformance]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">TalentGro AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
          </nav>
          <button 
            onClick={() => {
              setRecommendation(null);
              setStep(0);
            }}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Reset Assessment
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {!recommendation ? (
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between mb-4">
                {STEPS.map((s, i) => (
                  <div 
                    key={s.id} 
                    className={cn(
                      "flex flex-col items-center gap-2 transition-all duration-300",
                      i <= step ? "text-indigo-600" : "text-slate-400"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                      i < step ? "bg-indigo-600 border-indigo-600 text-white" : 
                      i === step ? "border-indigo-600 bg-white" : "border-slate-200 bg-white"
                    )}>
                      {i < step ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{s.title}</span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100 p-8 min-h-[400px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1"
                >
                  {step === 0 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-slate-900">Where are you in your journey?</h2>
                      <p className="text-slate-500">Select your current education level to help us tailor recommendations.</p>
                      <div className="grid gap-4">
                        {['High School (Class X-XII)', 'Undergraduate Student', 'Graduate Student', 'Working Professional'].map((level) => (
                          <button
                            key={level}
                            onClick={() => setUserData(d => ({ ...d, educationLevel: level }))}
                            className={cn(
                              "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                              userData.educationLevel === level 
                                ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" 
                                : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                            )}
                          >
                            <span className="font-semibold">{level}</span>
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                              userData.educationLevel === level ? "border-indigo-600 bg-indigo-600" : "border-slate-200"
                            )}>
                              {userData.educationLevel === level && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-slate-900">What are you good at?</h2>
                      <p className="text-slate-500">Select at least 3 skills that define you.</p>
                      <div className="flex flex-wrap gap-3">
                        {SKILL_OPTIONS.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => toggleItem(userData.skills, skill, 'skills')}
                            className={cn(
                              "px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200",
                              userData.skills.includes(skill)
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-200"
                            )}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-slate-900">What excites you?</h2>
                      <p className="text-slate-500">Select areas you are naturally curious about.</p>
                      <div className="flex flex-wrap gap-3">
                        {INTEREST_OPTIONS.map((interest) => (
                          <button
                            key={interest}
                            onClick={() => toggleItem(userData.interests, interest, 'interests')}
                            className={cn(
                              "px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200",
                              userData.interests.includes(interest)
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-200"
                            )}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8">
                      <h2 className="text-2xl font-bold text-slate-900">Academic Performance</h2>
                      <p className="text-slate-500">Rate your proficiency in these core subjects (0-100).</p>
                      
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                          {Object.entries(userData.academicPerformance).map(([subject, value]) => (
                            <div key={subject} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-bold capitalize text-slate-700">{subject.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="text-indigo-600 font-mono">{value}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={value}
                                onChange={(e) => setUserData(d => ({
                                  ...d,
                                  academicPerformance: {
                                    ...d.academicPerformance,
                                    [subject]: parseInt(e.target.value)
                                  }
                                }))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                          ))}
                        </div>
                        
                        <div className="h-[300px] bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                              <Radar
                                name="Performance"
                                dataKey="A"
                                stroke="#4f46e5"
                                fill="#4f46e5"
                                fillOpacity={0.3}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                    step === 0 ? "opacity-0 pointer-events-none" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                
                {step === STEPS.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || userData.skills.length < 2 || userData.interests.length < 2}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Profile...
                      </>
                    ) : (
                      <>
                        Get Recommendations
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Recommendation Header */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-indigo-100/50 border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-indigo-200">
                  <Briefcase className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">Top Recommendation</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      recommendation.marketDemand === 'High' ? "bg-emerald-100 text-emerald-700" :
                      recommendation.marketDemand === 'Medium' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                    )}>
                      {recommendation.marketDemand} Demand
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                    {recommendation.careerTitle}
                  </h1>
                  <p className="text-xl text-slate-500 font-medium">{recommendation.salaryRange} (Avg. Annual Salary)</p>
                </div>
                <div className="flex flex-col items-center gap-1 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <span className="text-5xl font-black text-indigo-600">{recommendation.matchPercentage}%</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Match Score</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Reasoning */}
                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Lightbulb className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Why this fits you?</h2>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown>{recommendation.reasoning}</ReactMarkdown>
                  </div>
                </section>

                {/* Roadmap */}
                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Your Success Roadmap</h2>
                  </div>
                  <div className="space-y-6 relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
                    {recommendation.roadmap.map((step, i) => (
                      <div key={i} className="flex gap-6 relative">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm z-10 shrink-0 shadow-lg shadow-indigo-100">
                          {i + 1}
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl flex-1 border border-slate-100">
                          <p className="font-semibold text-slate-700">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Sidebar */}
              <div className="space-y-8">
                {/* Skills Required */}
                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-600" />
                    Skills to Master
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.requiredSkills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Performance Chart */}
                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Your Profile Fit</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={radarData}>
                        <XAxis dataKey="subject" hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="A" radius={[4, 4, 0, 0]}>
                          {radarData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Alternatives */}
                <section className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Other Great Options
                  </h3>
                  <ul className="space-y-4">
                    {recommendation.alternativeCareers.map((career) => (
                      <li key={career} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 group-hover:bg-white transition-colors" />
                        <span className="font-semibold text-indigo-100 group-hover:text-white transition-colors">{career}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <button 
                  onClick={() => {
                    setRecommendation(null);
                    setStep(0);
                  }}
                  className="w-full py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all"
                >
                  Retake Assessment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-lg text-slate-900">TalentGro AI</span>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Empowering students with AI-driven insights to navigate their future career paths with confidence.
          </p>
          <div className="flex justify-center gap-6 text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          <p className="text-slate-400 text-xs pt-8">
            © 2026 TalentGro Global. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
