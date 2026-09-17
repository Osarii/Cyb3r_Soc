import type { ReactNode } from "react";
import "./CyberDeltaBadge.css";

export type CyberDeltaBadgeVariant =
  | "increase"
  | "decrease"
  | "neutral"
  | "critical";

type CyberDeltaBadgeProps = {
  value: ReactNode;
  variant?: CyberDeltaBadgeVariant;
  className?: string;
  showIcon?: boolean;
};

const iconMap: Record<CyberDeltaBadgeVariant, string> = {
  increase: "↑",
  decrease: "↓",
  neutral: "—",
  critical: "!",
};

export default function CyberDeltaBadge({
  value,
  variant = "neutral",
  className = "",
  showIcon = true,
}: CyberDeltaBadgeProps) {
  return (
    <span
      className={[
        "cyber-delta-badge",
        `cyber-delta-badge--${variant}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showIcon && (
        <span
          className="cyber-delta-badge__icon"
          aria-hidden="true"
        >
          {iconMap[variant]}
        </span>
      )}

      <span className="cyber-delta-badge__value">
        {value}
      </span>
    </span>
  );
}