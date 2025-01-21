import { TrimMode } from '@app-types/index';

type ShrinkTextProps = {
  ellipsis?: string;
  maxLength?: number;
  mode?: TrimMode;
  string: string;
};
export const shrinkText = ({
  ellipsis = '...',
  maxLength = 10,
  mode = TrimMode.center,
  string,
}: ShrinkTextProps) => {
  if (string.length <= maxLength) {
    return string;
  }
  const size = Math.floor(maxLength / 2);
  return mode === TrimMode.center ?
      [string.slice(0, size), ellipsis, string.slice(-size)].join('')
    : `${string.slice(0, maxLength)}${ellipsis}`;
};
