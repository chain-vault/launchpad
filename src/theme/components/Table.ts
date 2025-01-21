import { tableAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(
  tableAnatomy.keys
);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  tr: {
    _hover: {
      //   bg: 'surface.base.500',
    },
  },
});

export default defineMultiStyleConfig({ baseStyle });
