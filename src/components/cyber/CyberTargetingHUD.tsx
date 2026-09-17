import { LazyMotion, domAnimation, m } from "motion/react";
import "./CyberTargetingHUD.css";

type CyberTargetingHUDProps = {
  active?: boolean;
  label?: string;
  status?: string;
  confidence?: number;
  className?: string;
};

export default function CyberTargetingHUD({
  active = true,
  label = "TARGET ACQUIRED",
  status = "TRACKING",
  confidence,
  className = "",
}: CyberTargetingHUDProps) {
  if (!active) return null;

  return (
    <div
      className={[
        "cyber-targeting-hud",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <LazyMotion features={domAnimation}>
      {/* Outer scanner */}
      <m.div
        className="cyber-targeting-hud__outer"
        initial={{ opacity: 0, scale: 1.18, rotate: -12 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <m.div
          className="cyber-targeting-hud__outer-ring"
          animate={{ rotate: 360 }}
          transition={{
            duration: 16,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </m.div>

      {/* Secondary ring */}
      <m.div
        className="cyber-targeting-hud__middle-ring"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: -360,
        }}
        transition={{
          opacity: {
            duration: 0.45,
          },
          scale: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          },
          rotate: {
            duration: 11,
            ease: "linear",
            repeat: Infinity,
          },
        }}
      />

      {/* Crosshair */}
      <m.div
        className="cyber-targeting-hud__crosshair"
        initial={{ opacity: 0, scale: 1.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.12,
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span className="cyber-targeting-hud__line cyber-targeting-hud__line--top" />
        <span className="cyber-targeting-hud__line cyber-targeting-hud__line--right" />
        <span className="cyber-targeting-hud__line cyber-targeting-hud__line--bottom" />
        <span className="cyber-targeting-hud__line cyber-targeting-hud__line--left" />
      </m.div>

      {/* Corner locks */}
      <m.div
        className="cyber-targeting-hud__brackets"
        initial={{ opacity: 0, scale: 1.35 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span className="cyber-targeting-hud__bracket cyber-targeting-hud__bracket--tl" />
        <span className="cyber-targeting-hud__bracket cyber-targeting-hud__bracket--tr" />
        <span className="cyber-targeting-hud__bracket cyber-targeting-hud__bracket--bl" />
        <span className="cyber-targeting-hud__bracket cyber-targeting-hud__bracket--br" />
      </m.div>

      {/* Scanner line */}
      <m.div
        className="cyber-targeting-hud__scanner"
        initial={{ opacity: 0, y: -38 }}
        animate={{
          opacity: [0, 0.7, 0.7, 0],
          y: [-38, 38],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Core */}
      <m.div
        className="cyber-targeting-hud__core"
        initial={{ scale: 0 }}
        animate={{
          scale: [0.85, 1.08, 0.85],
          opacity: [0.65, 1, 0.65],
        }}
        transition={{
          scale: {
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: {
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <span />
      </m.div>

      {/* Status */}
      <m.div
        className="cyber-targeting-hud__status"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.4,
        }}
      >
        <div className="cyber-targeting-hud__label">
          {label}
        </div>

        <div className="cyber-targeting-hud__meta">
          <span>{status}</span>

          {typeof confidence === "number" ? <>
            <span className="cyber-targeting-hud__separator">/</span>
            <span>{confidence.toFixed(1)}%</span>
          </> : null}
        </div>
      </m.div>
      </LazyMotion>
    </div>
  );
}
