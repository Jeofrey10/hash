import React, { useEffect, useState } from 'react';
import { HashFullLogo } from './HashFullLogo';

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
  maxDuration?: number;
}

const STATUS_STAGES = [
  { progress: 20, label: 'INITIALISING EXPERIENCE' },
  { progress: 45, label: 'LOADING ASSETS' },
  { progress: 75, label: 'PREPARING INTERFACE' },
  { progress: 100, label: 'EXPERIENCE READY' },
];

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  minDuration = 500,
  maxDuration = 1500,
}) => {
  const isReducedMotion =
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const [progress, setProgress] = useState(isReducedMotion ? 100 : 0);
  const [status, setStatus] = useState(isReducedMotion ? 'EXPERIENCE READY' : STATUS_STAGES[0].label);
  const [isExiting, setIsExiting] = useState(isReducedMotion);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isReducedMotion) {
      const timer = setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
      }, 50);
      return () => clearTimeout(timer);
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const restoreOverflowSafely = () => {
      // If mobile drawer or a modal opened while preloader was fading, do not wipe out their scroll lock
      const hasModalOrDrawer = document.querySelector('[role="dialog"], [aria-modal="true"]');
      if (!hasModalOrDrawer) {
        document.body.style.overflow = originalOverflow;
      }
    };

    const startTime = performance.now();
    let animationFrameId: number;
    let isFontLoaded = false;

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        isFontLoaded = true;
      }).catch(() => {
        isFontLoaded = true;
      });
    } else {
      isFontLoaded = true;
    }

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const timeRatio = Math.min(elapsed / minDuration, 1);
      
      let targetProgress = timeRatio * 90;
      if (isFontLoaded && elapsed >= 250) {
        targetProgress = Math.max(targetProgress, 95);
      }
      if (elapsed >= minDuration) {
        targetProgress = 100;
      }

      setProgress((prev) => {
        const next = Math.min(100, Math.max(prev, targetProgress));
        for (let i = STATUS_STAGES.length - 1; i >= 0; i--) {
          if (next >= STATUS_STAGES[i].progress) {
            setStatus(STATUS_STAGES[i].label);
            break;
          }
        }
        return next;
      });

      if (elapsed < minDuration || targetProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setStatus('EXPERIENCE READY');
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            restoreOverflowSafely();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('hashdevs-viewport-check'));
            }
            setIsDone(true);
            if (onComplete) onComplete();
          }, 350);
        }, 100);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    const safetyTimeout = setTimeout(() => {
      setProgress(100);
      setStatus('EXPERIENCE READY');
      setIsExiting(true);
      setTimeout(() => {
        restoreOverflowSafely();
        setIsDone(true);
        if (onComplete) onComplete();
      }, 350);
    }, maxDuration);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(safetyTimeout);
      restoreOverflowSafely();
    };
  }, [isReducedMotion, minDuration, maxDuration, onComplete]);

  if (isDone) return null;

  return (
    <aside
      aria-label="Experience Preloader"
      role="status"
      aria-live="polite"
      data-testid="cinematic-preloader"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white transition-opacity duration-300 ease-out select-none ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Background ambient noise & radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(53, 232, 91, 0.08) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Center Brand Identity */}
      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="transform transition-transform duration-700 ease-out scale-100 animate-pulse">
          <HashFullLogo className="w-56 sm:w-72 md:w-80 h-auto text-white drop-shadow-[0_0_24px_rgba(53,232,91,0.25)]" />
        </div>

        {/* Technical progress bar */}
        <div className="mt-8 w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[var(--brand-neon-green,#35E85B)] rounded-full transition-all duration-150 ease-out shadow-[0_0_8px_var(--brand-neon-green,#35E85B)] min-w-[4px]"
            style={{ width: `${Math.max(2, Math.round(progress))}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Minimal status readouts */}
        <div className="mt-4 flex items-center justify-between w-48 sm:w-64 font-mono text-[10px] tracking-widest text-[#8F9A92] uppercase">
          <span className="truncate">{status}</span>
          <span className="tabular-nums text-white/90">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Corner Technical Deco */}
      <div className="absolute top-6 left-6 font-mono text-[9px] text-[#4F5651] tracking-widest uppercase hidden sm:block">
        SYS.BOOT // CLOUD.INTERFACE
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[9px] text-[#4F5651] tracking-widest uppercase hidden sm:block">
        HASH.DEVS // SECURE PRODUCTION
      </div>
    </aside>
  );
};
