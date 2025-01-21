import { useColorModeValue } from '@chakra-ui/react';

export const FallbackSVG = () => {
  const strokeColor = useColorModeValue('#121212', '#FFFFFF');
  const fillColor = useColorModeValue('#121212', '#FFFFFF');

  return (
    <svg fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
      <g id="octagon" opacity="0.2">
        <path
          d="M11.446 5H20.554L27 11.446V20.554L20.554 27H11.446L5 20.554V11.446L11.446 5Z"
          id="Vector"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <circle cx="16" cy="16" fill={fillColor} id="Ellipse 371" r="4" />
      </g>
    </svg>
  );
};
