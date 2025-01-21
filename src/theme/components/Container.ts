import { defineStyleConfig } from '@chakra-ui/react';

const Container = defineStyleConfig({
  variants: {
    'container.1080': {
      maxWidth: {
        base: '100%',
        lg: '1080px',
        sm: '100%',
      },
    
      width: '100%',
    },
  },
});
export default Container;
