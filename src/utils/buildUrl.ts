import { BUBBLE_MAP_LINK } from '@constants/config';

const PROFILE_PREFIXES: Record<string, string> = {
  github: 'https://github.com/',
  twitter: 'https://twitter.com/',
};
const strip = (str: string): string => (str[0] === '@' ? str.substr(1) : str).trim();

export const generateProfileUrl = (username: string, platform: string): string => {
  if (PROFILE_PREFIXES[platform] && typeof platform === 'string') {
    return `${PROFILE_PREFIXES[platform]}${strip(username)}`;
  }
  return username.startsWith('http') ? username : `https://${username}`;
};

export const generateBubbleMapUrl = (tokenId: null | string, theme: string) =>
  `${BUBBLE_MAP_LINK}${tokenId}?apeon=true&theme=${theme}&mode=0`;
