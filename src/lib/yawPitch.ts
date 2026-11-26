export type Vec3 = { x: number; y: number; z: number };

/**
 * Convert spherical yaw/pitch (degrees) to an A-Frame position.
 * Convention: yaw 0 = straight ahead (-Z), positive yaw = right (+X),
 * positive pitch = up (+Y).
 */
export function yawPitchToPosition(
  yawDeg: number,
  pitchDeg: number,
  radius = 8,
): Vec3 {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const cosPitch = Math.cos(pitch);

  return {
    x: radius * Math.sin(yaw) * cosPitch,
    y: radius * Math.sin(pitch),
    z: -radius * Math.cos(yaw) * cosPitch,
  };
}

function positionToAFrameString(position: Vec3): string {
  return `${position.x} ${position.y} ${position.z}`;
}

export function yawPitchToAFramePosition(
  yawDeg: number,
  pitchDeg: number,
  radius = 8,
): string {
  return positionToAFrameString(yawPitchToPosition(yawDeg, pitchDeg, radius));
}

/** Inverse of yawPitchToPosition — useful for the debug click helper. */
export function positionToYawPitch(point: Vec3): { yaw: number; pitch: number } {
  const radius = Math.hypot(point.x, point.y, point.z) || 1;
  const pitch = (Math.asin(point.y / radius) * 180) / Math.PI;
  const yaw = (Math.atan2(point.x, -point.z) * 180) / Math.PI;
  return { yaw, pitch };
}
