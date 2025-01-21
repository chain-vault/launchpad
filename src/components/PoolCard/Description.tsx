import React, { useEffect, useRef } from 'react';

import { Text } from '@chakra-ui/react';

import { trimContent } from '@utils/formatString';
import { decompressString } from '@utils/textCompression';

export const TokenDesc: React.FC<{ description?: string; lines?: number }> = ({
  description = '',
  lines = 2,
}) => {
  const wrapper = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (description && description.trim()) {
      const div = document.createElement('div');
      div.innerHTML = decompressString(description.trim());
      if (wrapper.current && div.textContent) {
        wrapper.current.innerHTML = trimContent(div.textContent);
      }
    }
  }, [description]);
  return (
    <Text
      style={{
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
      }}
      noOfLines={lines}
      opacity={0.6}
      ref={wrapper}
      textStyle="body-md-semibold"
      wordBreak="break-word"
    />
  );
};
