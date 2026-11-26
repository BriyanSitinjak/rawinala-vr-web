import { describe, expect, it } from "vitest";
import {
  positionToYawPitch,
  yawPitchToAFramePosition,
  yawPitchToPosition,
} from "@/lib/yawPitch";

describe("yawPitchToPosition", () => {
  it("places yaw 0 / pitch 0 straight ahead on -Z", () => {
    const p = yawPitchToPosition(0, 0, 10);
    expect(p.x).toBeCloseTo(0, 6);
    expect(p.y).toBeCloseTo(0, 6);
    expect(p.z).toBeCloseTo(-10, 6);
  });

  it("places positive yaw to the right (+X)", () => {
    const p = yawPitchToPosition(90, 0, 5);
    expect(p.x).toBeCloseTo(5, 6);
    expect(p.y).toBeCloseTo(0, 6);
    expect(p.z).toBeCloseTo(0, 6);
  });

  it("places positive pitch upward (+Y)", () => {
    const p = yawPitchToPosition(0, 90, 4);
    expect(p.x).toBeCloseTo(0, 6);
    expect(p.y).toBeCloseTo(4, 6);
    expect(p.z).toBeCloseTo(0, 6);
  });

  it("formats an A-Frame position string", () => {
    expect(yawPitchToAFramePosition(0, 0, 8)).toBe("0 0 -8");
  });

  it("round-trips through positionToYawPitch", () => {
    const original = { yaw: 37.5, pitch: -12 };
    const point = yawPitchToPosition(original.yaw, original.pitch, 9);
    const back = positionToYawPitch(point);
    expect(back.yaw).toBeCloseTo(original.yaw, 5);
    expect(back.pitch).toBeCloseTo(original.pitch, 5);
  });
});
