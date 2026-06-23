"use client";

/**
 * Client demo wrappers for doc pages.
 *
 * MDX pages are rendered as Server Components, so any demo that passes a
 * *function* prop to a client component (e.g. `<StatCard icon={Coins} />`,
 * where `icon` is a component) must live inside a client boundary — otherwise
 * the function prop can't cross the server→client serialization boundary.
 * Keep such demos here and reference them from MDX.
 */
import { StatCard } from "yunui/patterns";
import { Coins } from "lucide-react";

export function StatCardDemo() {
  return (
    <div className="w-56">
      <StatCard
        icon={Coins}
        label="Balance"
        value="$1,250"
        trend={{ value: 4.2, positive: true }}
      />
    </div>
  );
}
