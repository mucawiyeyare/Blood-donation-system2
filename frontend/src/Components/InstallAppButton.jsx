import React, { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

// "Install App": Chrome/Edge/Android fire beforeinstallprompt, which we capture and replay on
// click. iOS never fires that event — Safari only supports Add to Home Screen via its Share
// sheet — so there we show a one-line hint instead of a button that would silently do nothing.
export default function InstallAppButton({ className = "", iconOnly = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;
  if (!deferredPrompt && !isIOS()) return null;

  const handleClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return;
    }
    setShowIOSHint(true);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Install App"
        title="Install App"
        className={
          iconOnly
            ? `flex h-10 w-10 items-center justify-center rounded-xl text-navy transition-colors hover:bg-sky-50 ${className}`
            : `inline-flex items-center gap-2 rounded-xl border border-navy/40 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy hover:bg-soft ${className}`
        }
      >
        <Download className="h-4 w-4" />
        {!iconOnly && "Install App"}
      </button>

      {showIOSHint && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-line bg-white p-3.5 text-xs text-slate-600 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="flex items-center gap-1.5 font-semibold text-navy">
            <Share className="h-3.5 w-3.5" /> On iPhone/iPad:
          </p>
          <p className="mt-1">
            Tap the Share button, then <strong>Add to Home Screen</strong>.
          </p>
          <button type="button" onClick={() => setShowIOSHint(false)} className="mt-2 text-xs font-semibold text-brand hover:underline">
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
