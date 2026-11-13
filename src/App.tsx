import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroInput } from './components/HeroInput';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorBanner } from './components/ErrorBanner';
import { NotesWorkspace } from './components/notes/NotesWorkspace';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Footer } from './components/Footer';
import { LeftSidebar } from './components/dashboard/LeftSidebar';
import { RightPanel } from './components/dashboard/RightPanel';
import { UserProfileModal } from './components/profile/UserProfileModal';
import type { VideoNotes, SavedNoteRecord, LecturePlatform, NoteSynthesisStyle } from './types/notes';
import { extractYouTubeVideoId, getYouTubeWatchUrl, extractLectureSource } from './utils/youtube';
import {
  generateNotesFromApi,
  generateMockNotes,
} from './services/api';
import {
  getSavedNotes,
  saveNoteRecord,
  deleteSavedNoteRecord,
  clearAllSavedNotes,
} from './services/storage';
import { SAMPLE_NOTES } from './data/sampleNotes';
import { generateNotesPdf } from './utils/pdf';
import {
  Bookmark,
  HelpCircle,
  Clock,
  Play,
  FileDown,
  Search,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { FrontLandingLogin } from './components/auth/FrontLandingLogin';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';

export function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = sessionStorage.getItem('notetube_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState<boolean>(false);
  const [isDemoModeActive, setIsDemoModeActive] = useState<boolean>(false);

  const [urlInput, setUrlInput] = useState<string>('');
  const [activeNotes, setActiveNotes] = useState<VideoNotes | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<LecturePlatform>('youtube');
  const [synthesisStyle, setSynthesisStyle] = useState<NoteSynthesisStyle>('full');
  const [tabFont, setTabFont] = useState<'normal' | 'cursive'>('normal');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'workspace' | 'library' | 'quiz' | 'timestamps'>('workspace');
  const [synthesisMode, setSynthesisMode] = useState<'academic' | 'executive' | 'revision'>('academic');
  const [librarySearch, setLibrarySearch] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState<SavedNoteRecord[]>([]);
  const [apiError, setApiError] = useState<{
    title: string;
    message: string;
    pendingVideoId?: string;
    pendingPlatform?: LecturePlatform;
  } | null>(null);

  useEffect(() => {
    const list = getSavedNotes();
    setSavedNotes(list);
    setActiveNotes(null);
    setActiveVideoId(null);
    setUrlInput('');
  }, []);

  const detectedVideoId = useMemo(() => {
    const parsed = extractLectureSource(urlInput);
    if (parsed) return parsed.id;
    return extractYouTubeVideoId(urlInput);
  }, [urlInput]);

  const handleGenerate = async (
    videoId: string,
    platform: LecturePlatform = 'youtube',
    style: NoteSynthesisStyle = 'full',
    forceMock: boolean = false
  ) => {
    setApiError(null);
    setIsLoading(true);
    setActiveTab('workspace');
    setActivePlatform(platform);
    setSynthesisStyle(style);

    try {
      if (forceMock || platform !== 'youtube') {
        const matchingSample = SAMPLE_NOTES.find((s) => s.videoId === videoId || s.platform === platform);
        if (matchingSample) {
          commitSuccessfulNotes(videoId, matchingSample.notes, platform, style);
          return;
        }
        const mockData = await generateMockNotes(videoId, 1000);
        commitSuccessfulNotes(videoId, mockData, platform, style);
        return;
      }

      const { data, error } = await generateNotesFromApi(videoId);

      if (error) {
        setApiError({
          title: 'Synthesis Service Notice',
          message:
            'Unable to reach live video transcription service. You can explore the complete study guide features with our sample lecture notes.',
          pendingVideoId: videoId,
          pendingPlatform: platform,
        });
        setIsLoading(false);
        return;
      }

      if (data) {
        commitSuccessfulNotes(videoId, data, platform, style);
      }
    } catch {
      setApiError({
        title: 'Synthesis Notice',
        message: 'Could not complete transcription. Try exploring with sample lecture notes.',
        pendingVideoId: videoId,
        pendingPlatform: platform,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const commitSuccessfulNotes = (
    videoId: string,
    notes: VideoNotes,
    platform: LecturePlatform = 'youtube',
    style: NoteSynthesisStyle = 'full'
  ) => {
    const enrichedNotes: VideoNotes = {
      ...notes,
      platform,
    };
    setActiveNotes(enrichedNotes);
    setActiveVideoId(videoId);
    setActivePlatform(platform);
    setIsLoading(false);
    setApiError(null);

    const record: SavedNoteRecord = {
      id: `${videoId}-${Date.now()}`,
      videoId,
      videoUrl: urlInput || `https://www.youtube.com/watch?v=${videoId}`,
      platform,
      noteStyle: style,
      savedAt: new Date().toISOString(),
      notes: enrichedNotes,
    };
    const updated = saveNoteRecord(record);
    setSavedNotes(updated);
  };

  const handleUseMockFallback = () => {
    const videoId = apiError?.pendingVideoId || detectedVideoId || SAMPLE_NOTES[0].videoId;
    const platform = apiError?.pendingPlatform || activePlatform || 'youtube';
    handleGenerate(videoId, platform, synthesisStyle, true);
  };

  const handleReset = () => {
    setActiveNotes(null);
    setActiveVideoId(null);
    setUrlInput('');
    setApiError(null);
    setActiveTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryNote = (record: SavedNoteRecord) => {
    setUrlInput(record.videoUrl);
    setActiveNotes(record.notes);
    setActiveVideoId(record.videoId);
    if (record.platform) setActivePlatform(record.platform);
    if (record.noteStyle) setSynthesisStyle(record.noteStyle);
    setApiError(null);
    setActiveTab('workspace');
  };

  const handleDeleteHistoryNote = (id: string) => {
    const updated = deleteSavedNoteRecord(id);
    setSavedNotes(updated);
  };

  const handleClearHistory = () => {
    clearAllSavedNotes();
    setSavedNotes([]);
  };

  const filteredLibrary = useMemo(() => {
    if (!librarySearch.trim()) return savedNotes;
    const term = librarySearch.toLowerCase();
    return savedNotes.filter(
      (n) =>
        n.notes.title.toLowerCase().includes(term) ||
        n.videoId.toLowerCase().includes(term) ||
        n.notes.tldr.toLowerCase().includes(term) ||
        (n.platform && n.platform.toLowerCase().includes(term))
    );
  }, [savedNotes, librarySearch]);

  const fontClass = tabFont === 'cursive' ? 'tab-font-cursive' : 'tab-font-normal';

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    setActiveNotes(null);
    setActiveVideoId(null);
    setUrlInput('');
    try {
      sessionStorage.setItem('notetube_user', JSON.stringify(newUser));
      localStorage.setItem('notetube_user', JSON.stringify(newUser));
    } catch {}
  };

  const handleLogout = () => {
    setUser(null);
    setActiveNotes(null);
    setActiveVideoId(null);
    setUrlInput('');
    setIsDemoModeActive(false);
    try {
      sessionStorage.removeItem('notetube_user');
      localStorage.removeItem('notetube_user');
    } catch {}
  };

  const handleToggleDemoFiles = () => {
    const nextState = !isDemoModeActive;
    setIsDemoModeActive(nextState);

    if (nextState) {
      const userNotes = getSavedNotes();
      const demoRecords: SavedNoteRecord[] = SAMPLE_NOTES.map((sample, idx) => ({
        id: `demo-${sample.videoId}`,
        videoId: sample.videoId,
        videoUrl:
          sample.platform === 'coursera'
            ? `https://www.coursera.org/learn/${sample.videoId}`
            : sample.platform === 'udemy'
            ? `https://www.udemy.com/course/${sample.videoId}`
            : sample.platform === 'edx'
            ? `https://www.edx.org/course/${sample.videoId}`
            : `https://www.youtube.com/watch?v=${sample.videoId}`,
        platform: sample.platform,
        noteStyle: 'full',
        savedAt: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
        notes: sample.notes,
      }));

      const combined = [
        ...userNotes,
        ...demoRecords.filter((d) => !userNotes.some((u) => u.videoId === d.videoId)),
      ];
      setSavedNotes(combined);
      setActiveNotes(SAMPLE_NOTES[0].notes);
      setActiveVideoId(SAMPLE_NOTES[0].videoId);
      setUrlInput(`https://www.youtube.com/watch?v=${SAMPLE_NOTES[0].videoId}`);
    } else {
      const userNotes = getSavedNotes();
      setSavedNotes(userNotes);
      if (activeVideoId && SAMPLE_NOTES.some((s) => s.videoId === activeVideoId)) {
        setActiveNotes(null);
        setActiveVideoId(null);
        setUrlInput('');
      }
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_NOTES[0]) => {
    const url =
      sample.platform === 'coursera'
        ? `https://www.coursera.org/learn/${sample.videoId}`
        : sample.platform === 'udemy'
        ? `https://www.udemy.com/course/${sample.videoId}`
        : sample.platform === 'edx'
        ? `https://www.edx.org/course/${sample.videoId}`
        : `https://www.youtube.com/watch?v=${sample.videoId}`;
    setUrlInput(url);
    setActivePlatform(sample.platform);
    setActiveNotes(sample.notes);
    setActiveVideoId(sample.videoId);
    setActiveTab('workspace');
  };

  if (!user) {
    return <FrontLandingLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative w-full text-[#111827]">
      <Navbar
        savedCount={savedNotes.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        hasActiveNote={Boolean(activeNotes)}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenProfile={() => setIsProfileOpen(true)}
        currentUser={user}
        onLogout={() => setIsLogoutConfirmOpen(true)}
        onOpenLogin={() => setUser(null)}
      />

      <div className="flex-1 flex w-full relative z-10">
        {!isZenMode && (
          <LeftSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            savedNotes={savedNotes}
            activeVideoId={activeVideoId || undefined}
            onSelectNote={handleSelectHistoryNote}
            onNewVideo={handleReset}
            synthesisMode={synthesisMode}
            setSynthesisMode={setSynthesisMode}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onOpenProfile={() => setIsProfileOpen(true)}
            tabFont={tabFont}
            currentUser={user}
            onLogout={() => setIsLogoutConfirmOpen(true)}
            onOpenLogin={() => setUser(null)}
          />
        )}

        <main className={`flex-1 min-w-0 w-full py-5 pb-20 overflow-x-hidden transition-all duration-300 ${
          isZenMode ? 'px-4 sm:px-10 lg:px-16 max-w-7xl mx-auto' : 'px-4 sm:px-8 lg:px-10'
        }`}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl px-5 py-3 shadow-xs transition-all">
            <div className="flex items-center gap-2.5 text-xs text-neutral-600">
              <span className="font-semibold text-neutral-900">
                Mode: {synthesisMode === 'academic'
                  ? 'Detailed Notes'
                  : synthesisMode === 'executive'
                  ? 'Quick Summary'
                  : 'Practice Quiz'}
              </span>
              <span className="text-neutral-300 hidden sm:inline">•</span>
              <span className="text-neutral-500 hidden sm:inline">
                {savedNotes.length} saved notes
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setActiveTab('workspace')}
                className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer btn-spring ${fontClass} ${
                  activeTab === 'workspace'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-neutral-700 hover:text-red-700 hover:bg-red-50'
                }`}
              >
                Workspace
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer btn-spring ${fontClass} ${
                  activeTab === 'library'
                    ? 'bg-[#0F766E] text-white shadow-md shadow-teal-700/30'
                    : 'text-neutral-700 hover:text-teal-700 hover:bg-teal-50'
                }`}
              >
                Saved Notes ({savedNotes.length})
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer btn-spring ${fontClass} ${
                  activeTab === 'quiz'
                    ? 'bg-[#D97706] text-white shadow-md shadow-amber-600/30'
                    : 'text-neutral-700 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                Practice Quiz
              </button>

              <button
                onClick={() => setIsZenMode(!isZenMode)}
                className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer btn-spring ml-1 ${fontClass} ${
                  isZenMode
                    ? 'bg-[#1E293B] text-white shadow-md shadow-slate-900/30'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title={isZenMode ? 'Exit Focus Mode' : 'Focus Mode'}
              >
                {isZenMode ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Exit Focus</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Focus Mode</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-xl p-1 ml-1">
                <button
                  onClick={() => setTabFont('normal')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    tabFont === 'normal'
                      ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="Switch to Normal Font"
                >
                  Normal Font
                </button>
                <button
                  onClick={() => setTabFont('cursive')}
                  className={`px-3 py-1 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                    tabFont === 'cursive'
                      ? 'bg-neutral-900 text-white shadow-2xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  style={{ fontFamily: "'Caveat', cursive, serif", fontSize: '15px' }}
                  title="Switch to Cursive Font"
                >
                  Cursive Font
                </button>
              </div>

              <button
                type="button"
                onClick={handleToggleDemoFiles}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer btn-spring ml-1 ${
                  isDemoModeActive
                    ? 'bg-red-50 text-red-700 border-red-300 shadow-2xs font-bold'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:text-neutral-900 hover:bg-neutral-200/70'
                }`}
                title={isDemoModeActive ? 'Unload demo files' : 'Reload all demo files'}
              >
                <span className={`w-2 h-2 rounded-full transition-colors ${isDemoModeActive ? 'bg-red-600' : 'bg-neutral-400'}`} />
                <span>{isDemoModeActive ? 'Demo Files: Loaded' : 'Demo Files: Off'}</span>
              </button>
            </div>
          </div>

          {activeTab === 'workspace' && (
            <>
              <HeroInput
                urlInput={urlInput}
                setUrlInput={setUrlInput}
                detectedVideoId={detectedVideoId}
                onGenerate={(id, plat, st) => handleGenerate(id, plat || 'youtube', st || synthesisStyle, false)}
                isLoading={isLoading}
                synthesisStyle={synthesisStyle}
                setSynthesisStyle={setSynthesisStyle}
                tabFont={tabFont}
                showDemoSection={isDemoModeActive}
                onSelectSample={handleSelectSample}
              />

              {apiError && (
                <ErrorBanner
                  title={apiError.title}
                  message={apiError.message}
                  onRetry={
                    apiError.pendingVideoId
                      ? () => handleGenerate(apiError.pendingVideoId!, apiError.pendingPlatform || 'youtube', synthesisStyle, false)
                      : undefined
                  }
                  onLoadFallback={handleUseMockFallback}
                  onDismiss={() => setApiError(null)}
                />
              )}

              {isLoading && <LoadingSkeleton />}

              {!isLoading && activeNotes && activeVideoId && (
                <NotesWorkspace
                  notes={activeNotes}
                  videoId={activeVideoId}
                  onReset={handleReset}
                  isZenMode={isZenMode}
                  onToggleZenMode={() => setIsZenMode(!isZenMode)}
                  initialStyle={synthesisStyle}
                  tabFont={tabFont}
                  setTabFont={setTabFont}
                />
              )}
            </>
          )}

          {activeTab === 'library' && (
            <div className="space-y-6 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
                <div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-neutral-900">
                    Saved Notes
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    Search and export your saved study guides and notes.
                  </p>
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder="Search titles, platforms or IDs..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-full focus:outline-hidden focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {filteredLibrary.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500 shadow-xs">
                  <Bookmark className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-base font-bold text-neutral-800">No notes found</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Try adjusting your search or generate a new study note.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredLibrary.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        handleSelectHistoryNote(item);
                        setActiveTab('workspace');
                      }}
                      className="group bg-white border border-neutral-200 hover:border-neutral-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between card-interactive"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-500 mb-2.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white font-bold uppercase text-[10px]">
                            {item.platform || 'youtube'}
                          </span>
                          <span>{new Date(item.savedAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-editorial text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                          {item.notes.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 line-clamp-3 leading-relaxed font-sans">
                          {item.notes.tldr}
                        </p>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-xs text-neutral-500">
                          {item.notes.key_concepts.length} Concepts · {item.notes.revision_questions.length} Quiz Qs
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              generateNotesPdf(item.notes, item.videoId);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-full border border-red-200 transition-colors cursor-pointer btn-spring"
                            title="Download PDF"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6 w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center border border-neutral-200 shadow-2xs">
                    <HelpCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="font-editorial text-2xl font-bold text-neutral-900">
                      Practice Quiz
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Target Video: {activeNotes?.title || 'No active video'}
                    </p>
                  </div>
                </div>
              </div>

              {activeNotes?.revision_questions && activeNotes.revision_questions.length > 0 ? (
                <div className="space-y-4">
                  {activeNotes.revision_questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs hover:border-neutral-400 transition-all space-y-4 card-interactive"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-full bg-[#D97706] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs shadow-amber-600/30">
                          Q{idx + 1}
                        </span>
                        <h4 className="font-sans text-base sm:text-lg font-semibold text-neutral-900 leading-snug">
                          {q.question}
                        </h4>
                      </div>

                      <details className="group">
                        <summary className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold cursor-pointer select-none transition-all duration-200 shadow-xs btn-spring">
                          <span>Show Answer</span>
                        </summary>
                        <div className="mt-3.5 p-4.5 rounded-xl bg-neutral-50 border border-neutral-200 text-sm sm:text-base text-neutral-800 leading-relaxed font-sans animate-in fade-in slide-in-from-top-1 duration-200">
                          {q.answer}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500 shadow-xs">
                  <p className="text-base font-bold text-neutral-800">No active quiz questions</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Select a note from your library or generate notes from a video first.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timestamps' && (
            <div className="space-y-6 w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center border border-neutral-200 shadow-2xs">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="font-editorial text-2xl font-bold text-neutral-900">
                      Video Timestamps
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Click any timestamp to jump to that moment in the video.
                    </p>
                  </div>
                </div>
              </div>

              {activeNotes?.key_concepts && activeVideoId ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {activeNotes.key_concepts.map((concept, idx) => (
                    <a
                      key={idx}
                      href={getYouTubeWatchUrl(activeVideoId, concept.timestamp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white border border-neutral-200 hover:border-red-400 rounded-2xl p-4 shadow-xs hover:shadow-sm transition-all flex items-center justify-between cursor-pointer card-interactive"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span className="w-7 h-7 rounded-full bg-neutral-900 text-xs font-bold text-white flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 group-hover:text-red-700 transition-colors truncate">
                            {concept.heading}
                          </h4>
                          <span className="text-xs text-neutral-500">
                            {concept.bullets.length} points
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#1E293B] border border-slate-900 shrink-0 group-hover:bg-red-600 transition-colors shadow-2xs btn-spring">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>{concept.timestamp || '00:00'}</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500 shadow-xs">
                  <p className="text-base font-bold text-neutral-800">No active timestamps</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Load a video note to view its timestamps.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {!isZenMode && (
          <RightPanel
            notes={activeNotes}
            videoId={activeVideoId}
            tabFont={tabFont}
          />
        )}
      </div>

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedNotes={savedNotes}
        onSelectNote={handleSelectHistoryNote}
        onDeleteNote={handleDeleteHistoryNote}
        onClearAll={handleClearHistory}
        activeVideoId={activeVideoId || undefined}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        savedNotesCount={savedNotes.length}
      />

      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />

      <Footer />
    </div>
  );
}

export default App;
