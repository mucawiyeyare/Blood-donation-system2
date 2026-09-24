import React, { useEffect, useState } from "react";

// Many uploads are a "circle profile picture" template exported as a plain rectangle: the actual
// photo sits in a circle with a solid-colour margin around it (black, white, or any other colour).
// If the four corners share close to the same colour, that's a template margin, not real photo
// content — scan inward from the edges to find where the real photo starts, then crop tight to it
// (with extra room above, so a head doesn't sit right at the top edge) instead of showing the margin.
function trimVignette(src) {
  return new Promise((resolve) => {
    if (!src.startsWith("data:")) return resolve(src);
    const img = new Image();
    img.onload = () => {
      try {
        const { naturalWidth: w, naturalHeight: h } = img;
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const pixelAt = (x, y) => ctx.getImageData(x, y, 1, 1).data;
        const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
        const corners = [[2, 2], [w - 3, 2], [2, h - 3], [w - 3, h - 3]].map(([x, y]) => pixelAt(x, y));
        const bg = [0, 1, 2].map((i) => corners.reduce((sum, p) => sum + p[i], 0) / 4);
        const isUniform = corners.every((p) => p[3] < 20 || dist(p, bg) < 18);
        if (!isUniform) return resolve(src);

        const differs = (x, y) => {
          const p = pixelAt(x, y);
          return p[3] >= 20 && dist(p, bg) > 42;
        };
        const cx = Math.floor(w / 2);
        const cy = Math.floor(h / 2);
        let top = -1, bottom = -1, left = -1, right = -1;
        for (let y = 0; y < h; y++) if (differs(cx, y)) { top = y; break; }
        for (let y = h - 1; y >= 0; y--) if (differs(cx, y)) { bottom = y; break; }
        for (let x = 0; x < w; x++) if (differs(x, cy)) { left = x; break; }
        for (let x = w - 1; x >= 0; x--) if (differs(x, cy)) { right = x; break; }
        if (top < 0 || bottom <= top || left < 0 || right <= left) return resolve(src);

        const boxW = right - left;
        const boxH = bottom - top;

        // A round mask (a circular profile-picture export) still has background colour right at
        // the corners of its own bounding box — a real rectangular photo's content reaches them.
        // A square inscribed in a circle can be at most ~71% of that circle's width without
        // clipping in any real photo content, so shrink inward instead of padding outward for one.
        const boxCorners = [
          [left + 2, top + 2],
          [right - 2, top + 2],
          [left + 2, bottom - 2],
          [right - 2, bottom - 2],
        ].map(([x, y]) => pixelAt(x, y));
        const isRoundMask = boxCorners.every((p) => p[3] < 20 || dist(p, bg) < 42);

        let x0, x1, y0, y1;
        if (isRoundMask) {
          // Must stay centred on the circle: any offset shrinks the margin that keeps corners
          // photo-coloured, so there's no room here for the "headroom" the other branch adds.
          const inscribed = Math.min(boxW, boxH) * 0.68;
          const midX = (left + right) / 2;
          const midY = (top + bottom) / 2;
          x0 = midX - inscribed / 2;
          x1 = midX + inscribed / 2;
          y0 = midY - inscribed / 2;
          y1 = midY + inscribed / 2;
        } else {
          // Pad around the found box — generously on top, so hair/heads keep breathing room.
          x0 = Math.max(0, left - boxW * 0.12);
          x1 = Math.min(w, right + boxW * 0.12);
          y0 = Math.max(0, top - boxH * 0.28);
          y1 = Math.min(h, bottom + boxH * 0.12);
        }

        // Square the crop around that box, clamped inside the original image.
        const side = Math.min(w, h, Math.max(x1 - x0, y1 - y0));
        let sx = x0 - (side - (x1 - x0)) / 2;
        let sy = y0 - (side - (y1 - y0)) / 2;
        sx = Math.max(0, Math.min(sx, w - side));
        sy = Math.max(0, Math.min(sy, h - side));

        const o = document.createElement("canvas");
        o.width = side;
        o.height = side;
        o.getContext("2d").drawImage(c, sx, sy, side, side, 0, 0, side, side);
        resolve(o.toDataURL("image/jpeg", 0.9));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

// Tailwind's object-position utilities all carry equal specificity, so appending one via
// `className` can't reliably override another already baked into this component — hence a prop.
const POSITION_CLASS = {
  center: "object-center",
  top: "object-top",
  right: "object-right",
  bottom: "object-bottom",
};

// An uploaded photo (doctor, donor, ...), shown as-is in a rectangle (parent sets the size).
export default function DoctorPhoto({ src, alt, className = "", position = "center" }) {
  const [shown, setShown] = useState(src);
  useEffect(() => {
    let live = true;
    setShown(src);
    trimVignette(src).then((s) => live && setShown(s));
    return () => {
      live = false;
    };
  }, [src]);
  return <img src={shown} alt={alt} className={`object-cover ${POSITION_CLASS[position] || POSITION_CLASS.center} ${className}`} />;
}
