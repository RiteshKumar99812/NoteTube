import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface FrontLandingLoginProps {
  onLogin: (name: string, email: string) => void;
}

const TYPEWRITER_PHRASES = [
  'Turn YouTube, Coursera & Udemy lectures into structured study monographs.',
  'Interactive video timestamps jump directly to exact spoken moments.',
  'Generate self-testing quizzes and active recall flashcards in seconds.',
  'Export publication-grade PDFs and formatted Markdown with one click.',
  'Extract core definitions, key equations, and complete transcripts.',
];

export const FrontLandingLogin: React.FC<FrontLandingLoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('Alex Chen');
  const [email, setEmail] = useState('alex.chen@stanford.edu');
  const [password, setPassword] = useState('••••••••');
  const [activeTab, setActiveTab] = useState<'signin' | 'guest'>('signin');

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
    } else {
      const delta = isDeleting ? 25 : 55;
      timeout = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentPhrase.substring(0, prev.length - 1)
            : currentPhrase.substring(0, prev.length + 1)
        );
      }, delta);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  const triggerTransitionLogin = (targetName: string, targetEmail: string) => {
    setIsTransitioning(true);
    setTransitionStep(0);
    setProgressPercent(25);

    setTimeout(() => {
      setTransitionStep(1);
      setProgressPercent(65);
    }, 750);

    setTimeout(() => {
      setTransitionStep(2);
      setProgressPercent(100);
    }, 1500);

    setTimeout(() => {
      onLogin(targetName, targetEmail);
    }, 2400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTransitioning) return;
    if (activeTab === 'guest') {
      triggerTransitionLogin('Guest User', 'guest@notetube.app');
    } else {
      triggerTransitionLogin(name.trim() || 'Alex Chen', email.trim() || 'alex.chen@stanford.edu');
    }
  };

  const handleQuickDemo = () => {
    if (isTransitioning) return;
    triggerTransitionLogin('Alex Chen', 'alex.chen@stanford.edu');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ECEEF2] text-[#0F172A] relative overflow-hidden">
      <header className="w-full bg-white border-b border-neutral-200 px-6 sm:px-10 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs">
            <svg
              className="w-4 h-4 fill-current ml-0.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-2xl font-bold text-neutral-900 tracking-tight leading-none">
              NoteTube
            </span>
            <span className="text-[11px] text-neutral-500 font-medium mt-0.5 hidden sm:block">
              Video to Study Notes
            </span>
          </div>
        </div>

        <button
          onClick={handleQuickDemo}
          disabled={isTransitioning}
          className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all cursor-pointer btn-spring shadow-xs"
        >
          Quick Demo
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-red-600 block mb-1.5">
                Lecture Study Studio
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-neutral-900 leading-[1.2]">
                Turn video lectures into{' '}
                <span className="italic font-normal underline decoration-red-600 decoration-2 underline-offset-6">
                  solid study notes.
                </span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl">
                Paste links from YouTube, Coursera, Udemy, and edX. Generate full study notes, timestamped chapters, and active recall practice quizzes.
              </p>
            </div>

            <div className="bg-neutral-950 text-neutral-100 rounded-2xl border border-neutral-800 shadow-xl overflow-hidden font-mono">
              <div className="px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="ml-2 text-[11px] text-neutral-400 font-sans font-medium">
                    notetube-synthesizer • live overview
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  ENGINE READY
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-3.5">
                <div className="flex items-start gap-2.5 min-h-[58px] text-sm sm:text-base font-sans text-neutral-100 leading-relaxed">
                  <span className="text-red-500 font-mono text-sm select-none font-bold shrink-0 mt-0.5">&gt;</span>
                  <p className="flex-1 font-medium">
                    {displayText}
                    <span className="inline-block w-2 h-4.5 bg-red-500 ml-1 translate-y-0.5 animate-pulse" />
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-sans text-neutral-300">
                  <div className="flex items-center gap-1.5 bg-neutral-900/70 p-2 rounded-lg border border-neutral-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Timestamp Markers</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-900/70 p-2 rounded-lg border border-neutral-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Recall Quizzes</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 bg-neutral-900/70 p-2 rounded-lg border border-neutral-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">PDF &amp; MD Export</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs text-neutral-600 font-medium">
              <span className="font-bold text-neutral-900">Supported:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs font-semibold">
                YouTube
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs font-semibold">
                Coursera
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs font-semibold">
                Udemy
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs font-semibold">
                edX
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 shadow-sm transition-all relative overflow-hidden">
              {isTransitioning ? (
                <div className="py-8 px-2 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="relative w-16 h-16 mx-auto">
                    <svg className="w-16 h-16 animate-spin text-red-600" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-20"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-80"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-neutral-900">
                      {progressPercent}%
                    </div>
                  </div>

                  <div>
                    <h3 className="font-editorial text-xl font-bold text-neutral-900">
                      Welcome, {name.trim() || 'Alex'}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1.5 transition-all">
                      {transitionStep === 0 && 'Authenticating user session...'}
                      {transitionStep === 1 && 'Connecting video synthesis engine...'}
                      {transitionStep === 2 && 'Opening your study workspace...'}
                    </p>
                  </div>

                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Preparing interactive workspace</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h2 className="font-editorial text-2xl font-bold text-neutral-900 tracking-tight">
                      Sign in to NoteTube
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Access your lecture notes, summaries, and quizzes.
                    </p>
                  </div>

                  <div className="flex p-1 bg-neutral-100 rounded-xl mb-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'signin'
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Account Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('guest')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'guest'
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Continue as Guest
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {activeTab === 'signin' ? (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 font-medium"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 font-medium"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Password
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 font-medium"
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs text-neutral-600 space-y-1.5">
                        <p className="font-semibold text-neutral-900">
                          Instant Guest Access
                        </p>
                        <p>
                          Generate full notes, watch timestamp jumps, and export PDFs immediately without creating an account.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-md shadow-red-600/30 btn-spring"
                    >
                      <span>{activeTab === 'signin' ? 'Sign In & Open Workspace' : 'Continue as Guest'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-neutral-400">or</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickDemo}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-xl border border-neutral-200 transition-all cursor-pointer btn-spring"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-neutral-200 py-4 px-6 text-center text-xs text-neutral-500">
        <span>NoteTube • Free Video Lecture Notes & Quizzes</span>
      </footer>
    </div>
  );
};
