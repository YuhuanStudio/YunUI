"use client";

import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";

export interface ArchiveCalendarProps {
  /** Dates that have an issue, as YYYY-MM-DD. Order does not matter. */
  dates: string[];
  /** Where a date links to. */
  href: (date: string) => string;
  /**
   * Most months to draw. A ceiling, not a count: the range comes from the data,
   * so an archive three weeks old draws one month rather than six, five of them
   * empty.
   */
  maxMonths?: number;
  /** Weekday initials, Sunday first. @defaultValue ["S","M","T","W","T","F","S"] */
  weekdays?: readonly string[];
  /** Format a month heading. @defaultValue `${year}-${month}` */
  formatMonth?: (year: number, month: number) => string;
  /** Label the per-month count, e.g. `(n) => `${n} issues``. Omit to hide it. */
  formatCount?: (count: number) => string;
  /** Accessible label for a filled day. @defaultValue the ISO date */
  formatDayLabel?: (date: string) => string;
  className?: string;
}

/**
 * Every day of the archive, as months.
 *
 * A daily publication browsed as a list of dates answers "what is the newest"
 * and nothing else. Two questions a reader of one actually has are "was there an
 * issue on the day I remember" and "how far back does this go", and a list makes
 * both of them a scan. The comparable Chinese AI digest's reader ships a
 * calendar for exactly this, and it is the right shape: a grid whose axis is the
 * thing the publication is indexed by.
 *
 * It also happens to show the one fact this publication is built on. Every day
 * is generated without a person in the loop, so an unbroken run of filled cells
 * is the claim — and a gap is the only honest way to admit a day that failed.
 * The list could not show either.
 *
 * Written with no app specifics — dates in, an href builder, semantic tokens
 * only — on the same basis as SectionNav, so it can go upstream to YunUI, which
 * has no calendar of any kind.
 */

// Sunday-first, matching the grid below. Overridable because the letters and
// the week's starting day are both locale decisions.
const DEFAULT_WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

/** Local-time parts of a YYYY-MM-DD, without going through Date's timezone. */
function parts(date: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Days in a month, and the weekday its first falls on. */
function monthShape(year: number, month: number): { days: number; firstDay: number } {
  // UTC throughout: `new Date(y, m, d)` is local, so a viewer east of Greenwich
  // and one west of it would disagree about which column a date sits in.
  return {
    days: new Date(Date.UTC(year, month, 0)).getUTCDate(),
    firstDay: new Date(Date.UTC(year, month - 1, 1)).getUTCDay(),
  };
}

export function ArchiveCalendar({
  dates,
  href,
  maxMonths = 24,
  weekdays = DEFAULT_WEEKDAYS,
  formatMonth = (year, month) => `${year}-${String(month).padStart(2, "0")}`,
  formatCount,
  formatDayLabel = (date) => date,
  className = "",
}: ArchiveCalendarProps) {
  const { Link } = useYunUI();
  const have = new Set(dates);
  const sorted = [...dates].sort();
  const newest = parts(sorted.at(-1) ?? "");
  const oldest = parts(sorted[0] ?? "");
  if (!newest || !oldest) return null;

  // The range the archive actually covers, newest month first. Counted from the
  // newest *issue* rather than from today, so a pipeline that stopped a week ago
  // does not open on a month of empty cells — and bounded by the oldest issue,
  // so a three-week-old archive does not draw five empty months after it.
  const span =
    (newest.y - oldest.y) * 12 + (newest.m - oldest.m) + 1;
  const grid: Array<{ year: number; month: number }> = [];
  for (let back = 0; back < Math.min(span, maxMonths); back++) {
    const month = newest.m - back;
    grid.push({
      year: newest.y + Math.floor((month - 1) / 12),
      month: ((((month - 1) % 12) + 12) % 12) + 1,
    });
  }

  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {grid.map(({ year, month }) => {
        const { days, firstDay } = monthShape(year, month);
        const cells = [
          ...Array.from({ length: firstDay }, () => null),
          ...Array.from({ length: days }, (_, i) => i + 1),
        ];
        const filled = cells.filter(
          (day) => day && have.has(`${year}-${pad(month)}-${pad(day)}`)
        ).length;

        return (
          <div key={`${year}-${month}`}>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold tracking-tight tabular-nums">
                {formatMonth(year, month)}
              </h3>
              {formatCount && (
                <span className="text-caption tabular-nums">{formatCount(filled)}</span>
              )}
            </div>
            <div className="grid grid-cols-7 gap-1" role="presentation">
              {weekdays.map((label, i) => (
                <div
                  key={`${label}-${i}`}
                  aria-hidden
                  className="text-caption grid h-6 place-items-center text-[0.6875rem]"
                >
                  {label}
                </div>
              ))}
              {cells.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} aria-hidden />;
                const date = `${year}-${pad(month)}-${pad(day)}`;
                if (!have.has(date)) {
                  return (
                    <div
                      key={date}
                      // A day with no issue is not a link and not a target. It
                      // still occupies its cell, because the shape of the month
                      // is the information.
                      //
                      // `text-muted-foreground`, not an opacity modifier: /40
                      // composites the colour toward the background and dropped
                      // it to 1.6:1 — twenty-nine WCAG failures on one calendar,
                      // caught by npm run a11y. What separates a day with an
                      // issue from one without is the border and the weight, not
                      // how faint the number is.
                      className="text-muted-foreground grid h-8 place-items-center text-xs tabular-nums"
                    >
                      {day}
                    </div>
                  );
                }
                return (
                  <Link
                    key={date}
                    href={href(date)}
                    // 32px, over the WCAG 2.2 minimum of 24: a calendar cell is
                    // the smallest tap target on the site and the easiest to
                    // make too small.
                    className="border-border hover:border-(--accent) hover:text-(--accent) grid h-8 place-items-center rounded-md border text-xs font-medium tabular-nums transition-colors"
                    aria-label={formatDayLabel(date)}
                  >
                    {day}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
