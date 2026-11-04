import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const keyLength = 64;

export function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, keyLength).toString("hex");

  return `${salt}:${hash}`;
}

export function isPasswordCorrect(password: string, savedPassword: string) {
  const [salt, savedHash] = savedPassword.split(":");

  if (!salt || !savedHash) {
    return false;
  }

  const savedBuffer = Buffer.from(savedHash, "hex");
  const inputBuffer = scryptSync(password, salt, keyLength);

  return (
    savedBuffer.length === inputBuffer.length &&
    timingSafeEqual(savedBuffer, inputBuffer)
  );
}
