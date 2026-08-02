import { ImageResponse } from "next/og";

export const alt = "Bereket AI — Akıllı mutfak planlama";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#07130f",
        color: "#f5f5f4",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#6ee7b7",
            color: "#052e22",
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          B
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: 5 }}>
            BEREKET AI
          </span>
          <span style={{ marginTop: 6, color: "#78716c", fontSize: 18 }}>
            YZTA Bootcamp 2026 · Takım 134
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: 74,
            lineHeight: 1.02,
            fontWeight: 760,
            letterSpacing: -4,
          }}
        >
          Mutfağındakiyle
        </span>
        <span
          style={{
            marginTop: 4,
            fontSize: 74,
            lineHeight: 1.02,
            fontWeight: 760,
            letterSpacing: -4,
            color: "#6ee7b7",
          }}
        >
          daha akıllı planla.
        </span>
        <span
          style={{
            marginTop: 34,
            maxWidth: 850,
            color: "#a8a29e",
            fontSize: 25,
            lineHeight: 1.4,
          }}
        >
          Gerçek tarif verisi, güvenli agent mimarisi ve production backend.
        </span>
      </div>
    </div>,
    size,
  );
}
