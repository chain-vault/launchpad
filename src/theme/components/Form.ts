import { defineStyleConfig } from '@chakra-ui/react';

import { textStyles } from '@theme/foundations';

export const FormLabel = defineStyleConfig({
  baseStyle: {
    ...textStyles['body-sm-bold'],
  },
});

export const FormErrorMessage = defineStyleConfig({
  baseStyle: {
    ...textStyles['body-sm'],
  },
});
