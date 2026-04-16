"use client";

import { useEffect, useState } from "react";

type Props = {
  cooldownRemaining: number;
  chatLimitReached?: boolean;
};

function formatTime(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function LimitBanner({
  cooldownRemaining,
  chatLimitReached,
}: Props) {
  const [remaining, setRemaining] = useState(cooldownRemaining);

  // Sync remaining time with prop changes
  useEffect(() => {
    setRemaining(cooldownRemaining);
  }, [cooldownRemaining]);

  // Countdown timer for cooldown
  useEffect(() => {
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          window.location.reload();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);

  if (chatLimitReached) {
    return (
      <div
        className="mx-4 mb-3 px-4 py-3 rounded-xl text-sm text-center"
        style={{
          background: "var(--bubble-ai)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        ⚠️ You&apos;ve reached the <strong>10 chat limit</strong>. Delete an old
        chat to start a new one.
      </div>
    );
  }

  if (remaining > 0) {
    return (
      <div
        className="mx-4 mb-3 px-4 py-3 rounded-xl text-sm text-center"
        style={{
          background: "var(--bubble-ai)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        ⏳ You&apos;ve hit the <strong>10 message limit</strong>. Please wait{" "}
        <strong style={{ color: "var(--accent)" }}>
          {formatTime(remaining)}
        </strong>{" "}
        before sending more.
      </div>
    );
  }

  return null;
}
