import { createIcon } from '@chakra-ui/react';

export const CheckIcon = createIcon({
  displayName: 'CheckIcon',
  path: (
    <>
      <g clipPath="url(#clip0)">
        <path
          d="M10 5L5.875 9.125L4 7.25"
          stroke="currentColor"
          strokeLinecap="square"
          strokeLinejoin="round"
          strokeWidth="1.71429"
        />
        <rect fill="currentColor" height="14" opacity="0.1" width="14" />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect fill="currentColor" height="14" rx="3.11111" width="14" />
        </clipPath>
      </defs>
    </>
  ),
  viewBox: '0 0 14 14',
});
