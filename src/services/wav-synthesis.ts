import { exhaustiveCheck } from "@/utils";
import type { ToneProfile } from "@/utils";

const sampleRate: number = 22_050;

export function createWavDataUri(profiles: ToneProfile[]): string {
  const bytes = createWavBytes(profiles);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

function createWavBytes(profiles: ToneProfile[]): Uint8Array {
  const sampleCount = Math.ceil(getTotalSeconds(profiles) * sampleRate);
  const bytes = new Uint8Array(44 + sampleCount * 2);
  const view = new DataView(bytes.buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeString(view, 8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, sampleCount * 2, true);

  for (let index = 0; index < sampleCount; index += 1) {
    const sample = getMixedSample(index / sampleRate, profiles);
    view.setInt16(44 + index * 2, Math.round(sample * 32_767), true);
  }

  return bytes;
}

function getTotalSeconds(profiles: ToneProfile[]): number {
  let totalSeconds = 0.1;
  for (const profile of profiles) {
    totalSeconds = Math.max(
      totalSeconds,
      profile.delay + profile.duration + 0.05,
    );
  }
  return totalSeconds;
}

function getMixedSample(time: number, profiles: ToneProfile[]): number {
  let value = 0;
  for (const profile of profiles) {
    value += getProfileSample(time, profile);
  }
  return Math.min(Math.max(value, -1), 1);
}

function getProfileSample(time: number, profile: ToneProfile): number {
  const localTime = time - profile.delay;
  if (localTime < 0 || localTime > profile.duration) {
    return 0;
  }
  return (
    getWaveValue(profile.type, profile.frequency, localTime) *
    profile.gain *
    getEnvelope(localTime, profile.duration)
  );
}

function getWaveValue(
  type: OscillatorType,
  frequency: number,
  time: number,
): number {
  const cycle = (time * frequency) % 1;
  switch (type) {
    case "square":
      return cycle < 0.5 ? 1 : -1;
    case "sawtooth":
      return cycle * 2 - 1;
    case "triangle":
      return 1 - Math.abs(cycle - 0.5) * 4;
    case "sine":
    case "custom":
      return Math.sin(Math.PI * 2 * frequency * time);
    default:
      return exhaustiveCheck(type);
  }
}

function getEnvelope(time: number, duration: number): number {
  const attack = Math.min(time / 0.015, 1);
  const release = Math.min((duration - time) / 0.05, 1);
  return Math.max(Math.min(attack, release), 0);
}

function writeString(view: DataView, offset: number, value: string): void {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}
