import { compressSync, decompressSync, strFromU8, strToU8 } from 'fflate';

export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string =>
  Buffer.from(uint8Array).toString('base64');

const base64ToUint8Array = (base64: string): Uint8Array => Buffer.from(base64, 'base64');

export const compressString = (input: string): string => {
  const buf = strToU8(input);

  const compressed = compressSync(buf, { level: 6, mem: 8 });

  return uint8ArrayToBase64(compressed);
};

export const decompressString = (compressedBase64: string): string => {
  const compressed = base64ToUint8Array(compressedBase64);
  const decompressed = decompressSync(compressed);
  return strFromU8(decompressed);
};
