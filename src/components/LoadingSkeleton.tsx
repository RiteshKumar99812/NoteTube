import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  const steps = [
    { label: 'Connecting to lecture audio stream...', detail: 'Validating video track & timestamp markers' },
    { label: 'Transcribing speech & analyzing content...', detail: 'Mapping chronological topic milestones' },
    { label: 'Synthesizing executive TL;DR summary...', detail: 'Distilling high-yield academic takeaways' },
    { label: 'Structuring key concepts & definitions...', detail: 'Tagging timestamp jumps & glossary items' },
    { label: 'Generating active recall revision quiz...', detail: 'Formulating questions and model answers' },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(interval);
  }, [steps.length]);

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16 animate-in fade-in duration-300">
      <div className="mb-8 bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200/60 flex items-center justify-center gap-0.5 px-2">
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                Synthesizing Study Notes
              </p>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 mt-0.5">
                {steps[currentStepIndex].label}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-mono font-bold text-neutral-900">
              {progressPercent}%
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Complete</p>
          </div>
        </div>

        <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden mb-5 relative">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-neutral-100">
          {steps.map((_step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-red-600 text-white'
                      : isCurrent
                      ? 'border-2 border-red-600 text-red-600 animate-pulse'
                      : 'border border-neutral-300 text-neutral-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[9px] font-bold">{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`truncate ${
                    isCurrent
                      ? 'font-bold text-neutral-900'
                      : isCompleted
                      ? 'text-neutral-700'
                      : 'text-neutral-400'
                  }`}
                >
                  Step {idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-12 shadow-xs space-y-8 animate-pulse">
        <div className="space-y-3 pb-6 border-b border-neutral-100">
          <div className="h-4 w-32 bg-neutral-200 rounded-full" />
          <div className="h-9 w-3/4 bg-neutral-200 rounded-xl" />
          <div className="h-4 w-48 bg-neutral-100 rounded-full" />
        </div>

        <div className="p-6 rounded-xl bg-neutral-50/70 border border-neutral-200/80 space-y-3">
          <div className="h-4 w-28 bg-neutral-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-neutral-200 rounded-full" />
            <div className="h-3.5 w-5/6 bg-neutral-200 rounded-full" />
            <div className="h-3.5 w-4/6 bg-neutral-200 rounded-full" />
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <div className="h-6 w-56 bg-neutral-200 rounded-full" />
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-xl border border-neutral-200 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-5 w-1/3 bg-neutral-200 rounded-lg" />
                <div className="h-5 w-16 bg-neutral-100 rounded-full" />
              </div>
              <div className="space-y-2.5 pl-4">
                <div className="h-3.5 w-full bg-neutral-100 rounded-full" />
                <div className="h-3.5 w-11/12 bg-neutral-100 rounded-full" />
                <div className="h-3.5 w-4/5 bg-neutral-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
