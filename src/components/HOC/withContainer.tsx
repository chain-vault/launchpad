import React, { ComponentType } from 'react';

import { Box, Container } from '@chakra-ui/react';

function withContainer<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props: P) => (
    <Box w="100%">
      <Container maxW="container.xl" textAlign="center" variant="container.1080">
        <Component {...props} />
      </Container>
    </Box>
  );

  WrappedComponent.displayName = `WithContainer(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}

export default withContainer;
