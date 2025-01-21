import { Box, Container, Grid, Spacer } from '@chakra-ui/react';
import { useSearch } from '@tanstack/react-router';

import useResponsiveValue from '@hooks/useResponsiveValue';

import useMintToken from '../hooks/useMintToken';
import DetailsInputPanel from './DetailsInputPanel';
import InfoPanel from './InfoPanel';

const CreatePool = () => {
  const { draft: draftId } = useSearch({
    from: '/lbp/create/',
  });

  const isLargeScreen = useResponsiveValue({ base: false, lg: true });

  const { collateralAmount, isPending, onCreatePool } = useMintToken(draftId);

  return (
    <Box w="100%">
      <Container maxW="container.xl" textAlign="center">
        <Grid
          gap={6}
          templateColumns={{ base: '1fr', lg: '1fr 2fr 1fr' }}
          templateRows={{ base: 'auto auto', lg: 'auto' }}
        >
          {isLargeScreen ?
            <Spacer />
          : null}
          <DetailsInputPanel
            collateralAmount={collateralAmount}
            isPending={isPending}
            onCreatePool={onCreatePool}
          />
          <InfoPanel />
        </Grid>
      </Container>
    </Box>
  );
};

export default CreatePool;
