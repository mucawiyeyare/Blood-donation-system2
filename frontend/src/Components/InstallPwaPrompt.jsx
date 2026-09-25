import React, { useEffect, useState } from "react";
import { Download, X, Zap } from "lucide-react";
import SobdaLogo from "./SobdaLogo.jsx";

const DISMISS_KEY = "sobda-install-prompt-dismissed";

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

// A one-time, dismissible bottom banner inviting the visitor to install SOBDA as an app. Unlike
// the "Install App" button in the navbar (always available on demand), this only ever appears
// on its own when the browser tells us installation is actually possible (beforeinstallprompt),
// and only until the person installs or dismisses it once — never again after that.
export default function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isStandalone()) return undefined;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      /* storage unavailable — treat as not dismissed */
    }
    if (dismissed) return undefined;

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // A short delay so it doesn't compete with the page's own first-paint content.
      setTimeout(() => setVisible(true), 1500);
    };
    const onInstalled = () => {
      setVisible(false);
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setInstalling(false);
    setDeferredPrompt(null);
    dismiss();
  };

  if (!visible || !deferredPrompt) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] flex justify-center px-4 pb-4 sm:justify-end sm:px-6 sm:pb-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-4 shadow-[0_20px_50px_-15px_rgba(15,60,140,0.35)]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-xl border border-line bg-soft p-2">
            <SobdaLogo size="sm" showText={false} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-navy">Install Web App</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
              Add SOBDA to your home screen for faster, easier access — it opens like an app, even with a
              spotty connection.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleInstall}
            disabled={installing}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/25 transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {installing ? "Installing…" : "Install"}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-soft"
          >
            Not now
          </button>
        </div>

        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Zap className="h-3 w-3" /> No app store, no extra download size.
        </p>
      </div>
    </div>
  );
}
