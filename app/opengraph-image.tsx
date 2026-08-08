import { ImageResponse } from "next/og";

export const alt = "Taukir & Sara's Nikah — 10th November 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#090909",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(200,162,79,0.12) 0%, rgba(9,9,9,0) 70%)",
        }}
      >
        {/* Crescent moon, drawn with two overlapping circles */}
        <div
          style={{
            display: "flex",
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "#C8A24F",
            marginBottom: 36,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 26,
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "#090909",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            color: "#C8A24F",
            letterSpacing: 2,
          }}
        >
          Taukir &amp; Sara
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "#F7F3EA",
            opacity: 0.7,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Nikah · 10th November 2026
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            width: 160,
            height: 2,
            background: "#C8A24F",
            opacity: 0.4,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
