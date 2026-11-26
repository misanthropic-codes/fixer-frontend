import { describe, expect, it } from "vitest";
import {
  isOutsideWorkingHours,
  istDateKey,
  istTimeValue,
  istToIso,
  parseSlotConflict,
  slotFromInput,
  timelinePlacement,
  validateSlotInput,
} from "./admin-schedule";

describe("admin schedule helpers", () => {
  it("converts IST wall clock to UTC and back", () => {
    const iso = istToIso("2026-11-24", "12:30");
    expect(iso).toBe("2026-11-24T07:00:00.000Z");
    expect(istTimeValue(iso)).toBe("12:30");
    expect(istDateKey("2026-11-23T20:00:00.000Z")).toBe("2026-11-24"); // 01:30 IST
  });

  it("builds a slot from date + start + admin duration", () => {
    expect(slotFromInput({ date: "2026-11-24", start: "08:00", durationMinutes: 90 })).toEqual({
      scheduledStart: "2026-11-24T02:30:00.000Z",
      scheduledEnd: "2026-11-24T04:00:00.000Z",
    });
  });

  it("requires a duration; working hours are only a warning", () => {
    const now = new Date(istToIso("2026-11-24", "06:00"));
    expect(validateSlotInput({ date: "2026-11-24", start: "12:00", durationMinutes: "" }, { now })).toMatch(/how long/);
    expect(validateSlotInput({ date: "2026-11-24", start: "07:30", durationMinutes: 60 }, { now })).toBeNull();
    expect(isOutsideWorkingHours({ start: "07:30", durationMinutes: 60 })).toBe(true);
    expect(isOutsideWorkingHours({ start: "20:00", durationMinutes: 90 })).toBe(true);
    expect(isOutsideWorkingHours({ start: "19:00", durationMinutes: 120 })).toBe(false);
    expect(validateSlotInput({ date: "2026-11-24", start: "23:00", durationMinutes: 120 }, { now })).toMatch(/same day/);
  });

  it("blocks past times, with a 15-minute grace; running jobs check only the end", () => {
    const now = new Date(istToIso("2026-11-24", "12:00"));
    expect(validateSlotInput({ date: "2026-11-24", start: "11:50", durationMinutes: 60 }, { now })).toBeNull();
    expect(validateSlotInput({ date: "2026-11-24", start: "11:30", durationMinutes: 60 }, { now })).toMatch(/already passed/);
    expect(validateSlotInput({ date: "2026-11-23", start: "12:00", durationMinutes: 60 }, { now })).toMatch(/already passed/);
    expect(
      validateSlotInput({ date: "2026-11-24", start: "09:00", durationMinutes: 240 }, { now, runningJob: true }),
    ).toBeNull();
    expect(
      validateSlotInput({ date: "2026-11-24", start: "09:00", durationMinutes: 120 }, { now, runningJob: true }),
    ).toMatch(/end time has already passed/);
  });

  it("recognises the backend clash response", () => {
    const body = {
      statusCode: 409,
      code: "SLOT_CONFLICT",
      message: "Technician is busy 12:00 pm–2:00 pm. Free from 2:00 pm.",
      conflicts: [],
      nextFreeStart: "2026-11-24T08:30:00.000Z",
      freeTechnicians: [{ _id: "t2", name: "Ravi" }],
      technicianUnavailable: false,
    };
    expect(parseSlotConflict(409, body)?.freeTechnicians[0].name).toBe("Ravi");
    expect(parseSlotConflict(409, { message: body })?.nextFreeStart).toBe(body.nextFreeStart);
    expect(parseSlotConflict(400, body)).toBeNull();
  });

  it("places blocks on the 8–21 board", () => {
    const p = timelinePlacement(istToIso("2026-11-24", "08:00"), istToIso("2026-11-24", "21:00"));
    expect(p.leftPct).toBe(0);
    expect(p.widthPct).toBe(100);
  });
});
