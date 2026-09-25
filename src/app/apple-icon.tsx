import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0d10",
          borderRadius: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f3f6fb",
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -4,
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          KT
        </div>
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: 28,
            width: 22,
            height: 22,
            borderRadius: 999,
            background: "#1d4fff",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
