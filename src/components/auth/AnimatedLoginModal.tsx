import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  LogIn,
} from 'lucide-react';

interface AnimatedLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
}

const TYPEWRITER_PHRASES = [
  'Turn YouTube, Coursera & Udemy lectures into clear study notes.',
  'Jump to key moments with interactive video timestamps.',
  'Test your knowledge with auto-generated practice quizzes.',
  'Export formatted PDFs and Markdown files in one click.',
];

export const AnimatedLoginModal: React.FC<AnimatedLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [name, setName] = useState('Alex Chen');
  const [email, setEmail] = useState('alex.chen@stanford.edu');
  const [password, setPassword] = useState('••••••••');
  const [activeTab, setActiveTab] = useState<'signin' | 'guest'>('signin');

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(25);

  useEffect(() => {
    if (!isOpen) return;

    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
    } else {
      const delta = isDeleting ? 30 : 60;
      timeout = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentPhrase.substring(0, prev.length - 1)
            : currentPhrase.substring(0, prev.length + 1)
        );
      }, delta);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, isOpen]);

  if (!isOpen) return null;

  const triggerTransitionLogin = (targetName: string, targetEmail: string) => {
    setIsTransitioning(true);
    setTransitionStep(0);
    setProgressPercent(25);

    setTimeout(() => {
      setTransitionStep(1);
      setProgressPercent(65);
    }, 700);

    setTimeout(() => {
      setTransitionStep(2);
      setProgressPercent(100);
    }, 1400);

    setTimeout(() => {
      onLogin(targetName, targetEmail);
      setIsTransitioning(false);
      onClose();
    }, 2100);
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
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-neutral-900/60 transition-opacity animate-in fade-in duration-300"
        onClick={isTransitioning ? undefined : onClose}
      />

      <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-300">
        <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </div>
            <div>
              <h2 className="font-editorial text-2xl font-bold text-neutral-900 leading-none">
                NoteTube Login
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                Video Lecture Notes & Quizzes
              </span>
            </div>
          </div>

          {!isTransitioning && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              title="Close window"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="my-4 p-3 bg-neutral-50 border border-neutral-200 rounded-2xl min-h-[56px] flex items-center">
          <div className="flex items-center gap-2.5 w-full">
            <div className="w-2 h-2 rounded-full bg-red-600 shrink-0 animate-ping" />
            <p className="text-xs sm:text-sm text-neutral-700 font-medium font-sans">
              <span>{displayText}</span>
              <span className="inline-block w-1.5 h-4 bg-red-600 ml-0.5 align-middle animate-pulse" />
            </p>
          </div>
        </div>

        {isTransitioning ? (
          <div className="py-6 text-center space-y-5 animate-in fade-in duration-300">
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
                Logging you in, {name.trim() || 'Alex'}
              </h3>
              <p className="text-xs text-neutral-500 mt-1 transition-all">
                {transitionStep === 0 && 'Authenticating user session...'}
                {transitionStep === 1 && 'Connecting video synthesis engine...'}
                {transitionStep === 2 && 'Opening NoteTube workspace...'}
              </p>
            </div>

            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Preparing study workspace</span>
            </div>
          </div>
        ) : (
          <>
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
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 font-medium"
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
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 font-medium"
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
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 font-medium"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs text-neutral-600 space-y-1">
                  <p className="font-semibold text-neutral-900">
                    Guest Mode
                  </p>
                  <p>
                    Full access to video notes, timestamps, quiz generation, and PDF export without an account.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-md shadow-red-600/30 btn-spring"
              >
                <LogIn className="w-4 h-4" />
                <span>{activeTab === 'signin' ? 'Log In & Open Workspace' : 'Continue as Guest'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative my-3.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-neutral-400">or</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-xl border border-neutral-200 transition-all cursor-pointer btn-spring"
              >
                <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
                <span>Quick Demo</span>
              </button>

              <button
                type="button"
                onClick={handleQuickDemo}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-xl border border-neutral-200 transition-all cursor-pointer btn-spring"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span>Google Login</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
