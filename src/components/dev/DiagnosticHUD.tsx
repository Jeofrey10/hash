import React, { useEffect, useState, useRef } from 'react';

interface DiagnosticState {
  scrollY: number;
  viewportHeight: number;
  viewportWidth: number;
  visualViewportHeight?: number;
  theme: string;
  preloaderDone: boolean;
  drawerOpen: boolean;
  modalOpen: boolean;
  bodyOverflow: string;
  rootInert: boolean;
  canvasActive: boolean;
  canvasDims: string;
  fps: number;
  errors: string[];
  sections: {
    name: string;
    inViewport: boolean;
    opacity: string;
    visibility: string;
    box: string;
    blankDetected: boolean;
  }[];
  incidents: {
    timestamp: string;
    section: string;
    reason: string;
    state: any;
  }[];
}

export const DiagnosticHUD: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState<DiagnosticState | null>(null);
  const errorLogRef = useRef<string[]>([]);
  const incidentsRef = useRef<any[]>([]);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsRef = useRef(60);

  useEffect(() => {
    // Only enable if query param ?diag=1 or localStorage has hashdevs-diag
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const isDiag = urlParams.get('diag') === '1' || localStorage.getItem('hashdevs-diag') === '1';
    if (!isDiag) return;

    setEnabled(true);

    // Global error handlers
    const handleError = (e: ErrorEvent) => {
      const msg = `[Error] ${e.message} at ${e.filename}:${e.lineno}`;
      errorLogRef.current = [...errorLogRef.current.slice(-9), msg];
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      const msg = `[Rejection] ${String(e.reason)}`;
      errorLogRef.current = [...errorLogRef.current.slice(-9), msg];
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    // FPS loop
    let rafId: number;
    const fpsLoop = (now: number) => {
      frameCountRef.current++;
      if (now - lastTimeRef.current >= 500) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      rafId = requestAnimationFrame(fpsLoop);
    };
    rafId = requestAnimationFrame(fpsLoop);

    // Telemetry sampling interval
    const interval = setInterval(() => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const sy = window.scrollY;
      const theme = document.documentElement.getAttribute('data-theme') || 'unknown';
      const bodyOverflow = document.body.style.overflow || 'auto';
      const rootEl = document.getElementById('root');
      const rootInert = rootEl ? rootEl.hasAttribute('inert') : false;
      const drawerEl = document.getElementById('mobile-navigation-drawer');
      const drawerOpen = !!drawerEl;
      const modalEl = document.querySelector('[role="dialog"][aria-modal="true"]');
      const modalOpen = !!modalEl && modalEl !== drawerEl;
      const preloaderEl = document.querySelector('[data-testid="cinematic-preloader"]');
      const preloaderDone = !preloaderEl;

      const canvasEl = document.querySelector('#hero canvas') as HTMLCanvasElement | null;
      const canvasActive = !!canvasEl;
      const canvasDims = canvasEl ? `${canvasEl.width}x${canvasEl.height}` : 'none';

      const sectionSelectors = [
        { name: 'Hero', sel: '#hero' },
        { name: 'Services', sel: '#services' },
        { name: 'Approach', sel: '#approach' },
        { name: 'Capabilities', sel: '#capabilities' },
        { name: 'Contact', sel: '#contact' },
        { name: 'Footer', sel: 'footer' },
      ];

      const sectionsData = sectionSelectors.map((s) => {
        const el = document.querySelector(s.sel);
        if (!el) {
          return {
            name: s.name,
            inViewport: false,
            opacity: 'N/A',
            visibility: 'N/A',
            box: 'N/A',
            blankDetected: false,
          };
        }
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < vh && rect.bottom > 0;
        const style = window.getComputedStyle(el);
        const opacity = style.opacity;
        const visibility = style.visibility;
        const opVal = parseFloat(opacity);
        const isBlank = inViewport && (opVal < 0.2 || visibility === 'hidden' || style.display === 'none');

        if (isBlank) {
          // Log an incident if not already recorded recently
          const nowStr = new Date().toLocaleTimeString();
          if (incidentsRef.current.length === 0 || incidentsRef.current[incidentsRef.current.length - 1].section !== s.name) {
            incidentsRef.current = [
              ...incidentsRef.current.slice(-19),
              {
                timestamp: nowStr,
                section: s.name,
                reason: `inViewport=true but opacity=${opacity}, visibility=${visibility}`,
                state: { sy, theme, vh, vw, bodyOverflow, rootInert },
              },
            ];
          }
        }

        return {
          name: s.name,
          inViewport,
          opacity,
          visibility,
          box: `${Math.round(rect.width)}x${Math.round(rect.height)} @ (${Math.round(rect.top)})`,
          blankDetected: isBlank,
        };
      });

      setData({
        scrollY: Math.round(sy),
        viewportHeight: vh,
        viewportWidth: vw,
        visualViewportHeight: window.visualViewport ? Math.round(window.visualViewport.height) : undefined,
        theme,
        preloaderDone,
        drawerOpen,
        modalOpen,
        bodyOverflow,
        rootInert,
        canvasActive,
        canvasDims,
        fps: fpsRef.current,
        errors: errorLogRef.current,
        sections: sectionsData,
        incidents: incidentsRef.current,
      });
    }, 200);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  if (!enabled || !data) return null;

  const hasIncidents = data.incidents.length > 0;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        zIndex: 999999,
        backgroundColor: 'rgba(5, 5, 5, 0.95)',
        color: '#35E85B',
        fontFamily: 'ui-monospace, Menlo, monospace',
        fontSize: '11px',
        lineHeight: 1.35,
        padding: '8px 10px',
        borderRadius: '8px',
        border: hasIncidents ? '2px solid #EF4444' : '1px solid rgba(53, 232, 91, 0.4)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.85)',
        maxWidth: collapsed ? '140px' : '360px',
        maxHeight: collapsed ? '36px' : '80vh',
        overflowY: 'auto',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
        <span style={{ fontWeight: 'bold', color: hasIncidents ? '#EF4444' : '#FFFFFF' }}>
          {hasIncidents ? '⚠ DIAG ALERT' : '⚡ DIAGNOSTICS'}
        </span>
        <span style={{ color: '#888', marginLeft: 8 }}>{collapsed ? '[+] Expand' : '[-] Min'}</span>
      </div>

      {!collapsed && (
        <>
          <div style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: 4, marginBottom: 4 }}>
            FPS: <span style={{ color: data.fps < 40 ? '#EF4444' : '#35E85B', fontWeight: 'bold' }}>{data.fps}</span> | 
            ScrollY: {data.scrollY}px | 
            View: {data.viewportWidth}x{data.viewportHeight} (vv:{data.visualViewportHeight || 'na'})
          </div>

          <div style={{ color: '#aaa', marginBottom: 4 }}>
            Theme: <b style={{ color: '#fff' }}>{data.theme}</b> | 
            Preload: {data.preloaderDone ? '✓ done' : '⏳ active'} | 
            Overflow: {data.bodyOverflow}
          </div>

          <div style={{ color: '#aaa', marginBottom: 6 }}>
            Drawer: {data.drawerOpen ? '🔴 OPEN' : 'closed'} | 
            Modal: {data.modalOpen ? '🔴 OPEN' : 'closed'} | 
            #root inert: {data.rootInert ? '🔴 TRUE' : 'false'}
          </div>

          <div style={{ fontWeight: 'bold', color: '#fff', borderTop: '1px solid #333', paddingTop: 4 }}>
            Sections Status:
          </div>
          {data.sections.map((s) => (
            <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', color: s.blankDetected ? '#EF4444' : s.inViewport ? '#fff' : '#666' }}>
              <span>{s.inViewport ? '► ' : '  '}{s.name}:</span>
              <span>op={s.opacity} {s.inViewport ? (s.blankDetected ? '🔴 BLANK' : '✓ inView') : 'off'}</span>
            </div>
          ))}

          {data.incidents.length > 0 && (
            <div style={{ marginTop: 6, borderTop: '1px solid #EF4444', paddingTop: 4 }}>
              <div style={{ color: '#EF4444', fontWeight: 'bold' }}>Incidents ({data.incidents.length}):</div>
              {data.incidents.slice(-3).map((inc, i) => (
                <div key={i} style={{ color: '#ff8888', fontSize: '10px' }}>
                  [{inc.timestamp}] {inc.section}: {inc.reason}
                </div>
              ))}
            </div>
          )}

          {data.errors.length > 0 && (
            <div style={{ marginTop: 6, borderTop: '1px solid #EF4444', paddingTop: 4 }}>
              <div style={{ color: '#EF4444', fontWeight: 'bold' }}>JS Errors:</div>
              {data.errors.map((err, i) => (
                <div key={i} style={{ color: '#ff6666', fontSize: '10px' }}>{err}</div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

