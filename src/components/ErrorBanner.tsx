import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorBannerProps {
  title: string;
  message: string;
  isBackendError?: boolean;
  onRetry?: () => void;
  onLoadFallback?: () => void;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title,
  message,
  onRetry,
  onLoadFallback,
  onDismiss,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-6">
      <div className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-xs transition-all card-interactive">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-neutral-100 rounded-full text-red-600 shrink-0 border border-neutral-200">
            <AlertCircle className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-neutral-900">{title}</h4>
            <p className="mt-1 text-xs text-neutral-600 leading-relaxed font-sans">
              {message}
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
              {onLoadFallback && (
                <button
                  onClick={onLoadFallback}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all duration-200 shadow-xs cursor-pointer btn-spring"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-white" />
                  <span>Explore with Sample Notes</span>
                </button>
              )}

              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-full transition-all duration-200 cursor-pointer btn-spring"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Retry Analysis</span>
                </button>
              )}
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
