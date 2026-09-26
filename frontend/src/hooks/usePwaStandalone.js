import { useEffect, useState } from "react";

const check = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);

// True once the site is running as the installed app (opened from the Home Screen / app
// launcher), false in an ordinary browser tab. Live-updates if that ever changes mid-session
// (e.g. Chrome's install happens without a reload on some platforms).
export default function usePwaStandalone() {
  const [standalone, setStandalone] = useState(check);

  useEffect(() => {
    const mql = window.matchMedia?.("(display-mode: standalone)");
    const update = () => setStandalone(check());
    mql?.addEventListener?.("change", update);
    window.addEventListener("appinstalled", update);
    return () => {
      mql?.removeEventListener?.("change", update);
      window.removeEventListener("appinstalled", update);
    };
  }, []);

  return standalone;
}
