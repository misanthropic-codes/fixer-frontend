/**
 * Admin scheduling helpers for Fixxer-staff technicians (pure, no React).
 * Mirrors the backend rules: 8 AM – 9 PM IST is a soft limit (warning + override),
 * no slots in the past (15-minute grace), admin always enters the duration,
 * back-to-back slots don't clash, a clash is a warning the admin may override.
 */

export const WORKDAY_START = "08:00";
export const WORKDAY_END = "21:00";
export const WORKDAY_START_MINUTES = 8 * 60;
export const WORKDAY_END_MINUTES = 21 * 60;

/** Start of the customer's preferred window — only pre-fills the start time. */
export const PREFERRED_SLOT_START: Record<string, string> = {
  MORNING: "08:00",
  AFTERNOON: "12:00",
  EVENING: "16:00",
};

const IST_OFFSET_MS = 330 * 60 * 1000;
export const PAST_SLOT_GRACE_MINUTES = 15;

export function isFixxerStaff(tech?: { employmentType?: string | null } | null): boolean {
  return tech?.employmentType === "FIXXER_STAFF";
}

/** "2026-11-24" + "12:30" (IST wall clock) → ISO instant. */
export function istToIso(date: string, time: string): string {
  return new Date(`${date}T${time}:00+05:30`).toISOString();
}

export function addMinutesIso(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

/** IST calendar day (YYYY-MM-DD) of an instant. */
export function istDateKey(at: Date | string = new Date()): string {
  return new Date(new Date(at).getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** IST "HH:mm" of an instant (for <input type="time">). */
export function istTimeValue(at: Date | string): string {
  return new Date(new Date(at).getTime() + IST_OFFSET_MS).toISOString().slice(11, 16);
}

/** Minutes since IST midnight. */
export function istMinuteOfDay(at: Date | string): number {
  const local = new Date(new Date(at).getTime() + IST_OFFSET_MS);
  return local.getUTCHours() * 60 + local.getUTCMinutes();
}

export function formatIstTime(at: Date | string): string {
  return new Date(at).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatIstRange(start: Date | string, end: Date | string): string {
  return `${formatIstTime(start)} – ${formatIstTime(end)}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Validate admin slot inputs (hard rules). Returns an error message, or null when valid.
 * Working hours are soft — see isOutsideWorkingHours.
 * `runningJob`: extending a job already under way — its start is in the past by design.
 */
export function validateSlotInput(
  input: { date: string; start: string; durationMinutes: number | string },
  opts: { now?: Date; runningJob?: boolean } = {},
): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) return "Pick a date";
  if (!/^\d{2}:\d{2}$/.test(input.start)) return "Pick a start time";
  const duration = Number(input.durationMinutes);
  if (!Number.isFinite(duration) || duration <= 0) return "Enter how long the job will take";
  if (timeToMinutes(input.start) + duration > 24 * 60) {
    return "A slot must start and end on the same day";
  }
  const now = (opts.now ?? new Date()).getTime();
  const start = new Date(istToIso(input.date, input.start)).getTime();
  if (opts.runningJob) {
    if (start + duration * 60_000 <= now) return "The new end time has already passed";
  } else if (start < now - PAST_SLOT_GRACE_MINUTES * 60_000) {
    return "That time has already passed. Pick a time from now on.";
  }
  return null;
}

/** Outside 8 AM – 9 PM (soft: the admin is warned and may go ahead with a reason). */
export function isOutsideWorkingHours(input: {
  start: string;
  durationMinutes: number | string;
}): boolean {
  const start = timeToMinutes(input.start);
  return start < WORKDAY_START_MINUTES || start + Number(input.durationMinutes) > WORKDAY_END_MINUTES;
}

export function slotFromInput(input: {
  date: string;
  start: string;
  durationMinutes: number | string;
}): { scheduledStart: string; scheduledEnd: string } {
  const scheduledStart = istToIso(input.date, input.start);
  return {
    scheduledStart,
    scheduledEnd: addMinutesIso(scheduledStart, Number(input.durationMinutes)),
  };
}

export interface SlotConflict {
  code: "SLOT_CONFLICT";
  message: string;
  conflicts: { bookingId: string; start: string; end: string; status: string }[];
  technicianUnavailable: boolean;
  outsideWorkingHours: boolean;
  nextFreeStart: string | null;
  freeTechnicians: { _id: string; name: string }[];
}

/** Recognise the backend's 409 SLOT_CONFLICT body (Nest may nest it under `message`). */
export function parseSlotConflict(status: number, data: unknown): SlotConflict | null {
  if (status !== 409 || !data || typeof data !== "object") return null;
  const body = data as Record<string, any>;
  const candidate =
    body.code === "SLOT_CONFLICT"
      ? body
      : body.message && typeof body.message === "object" && body.message.code === "SLOT_CONFLICT"
        ? body.message
        : null;
  if (!candidate) return null;
  return {
    code: "SLOT_CONFLICT",
    message: String(candidate.message || "Technician is busy in that slot."),
    conflicts: Array.isArray(candidate.conflicts) ? candidate.conflicts : [],
    technicianUnavailable: !!candidate.technicianUnavailable,
    outsideWorkingHours: !!candidate.outsideWorkingHours,
    nextFreeStart: candidate.nextFreeStart || null,
    freeTechnicians: Array.isArray(candidate.freeTechnicians) ? candidate.freeTechnicians : [],
  };
}

/** Horizontal placement (in % of the 8 AM–9 PM board) for a slot block. */
export function timelinePlacement(start: Date | string, end: Date | string): {
  leftPct: number;
  widthPct: number;
} {
  const span = WORKDAY_END_MINUTES - WORKDAY_START_MINUTES;
  const s = Math.max(istMinuteOfDay(start), WORKDAY_START_MINUTES);
  const e = Math.min(
    istDateKey(end) !== istDateKey(start) ? WORKDAY_END_MINUTES : istMinuteOfDay(end),
    WORKDAY_END_MINUTES,
  );
  const leftPct = ((s - WORKDAY_START_MINUTES) / span) * 100;
  const widthPct = Math.max(((e - s) / span) * 100, 1.5);
  return { leftPct, widthPct };
}

/** Hour labels for the board header: 8, 9, … 21. */
export const BOARD_HOURS = Array.from(
  { length: (WORKDAY_END_MINUTES - WORKDAY_START_MINUTES) / 60 + 1 },
  (_, i) => 8 + i,
);

/** Statuses in which a job is already under way (only its end can move). */
export const RUNNING_STATUSES = ["EN_ROUTE", "IN_PROGRESS"];

export function isRunningJob(status?: string | null): boolean {
  return RUNNING_STATUSES.includes(String(status || "").toUpperCase());
}
