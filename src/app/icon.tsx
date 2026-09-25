import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f3f6fb",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: -0.8,
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            lineHeight: 1,
            marginTop: 1,
          }}
        >
          KT
        </div>
        <div
          style={{
            position: "absolute",
            right: 5,
            bottom: 5,
            width: 5,
            height: 5,
            borderRadius: 999,
            background: "#1d4fff",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
