import { Box } from '@chakra-ui/react';

const CircleInsideCircle = () => (
  <Box
    alignItems="center"
    bg="surface.base.600"
    borderRadius="50%"
    display="flex"
    height="20px"
    justifyContent="center"
    position="relative"
    width="20px"
  >
    <Box
      bg="surface.base.900"
      borderRadius="50%"
      height="10px"
      opacity="0.3"
      position="absolute"
      width="10px"
    />
  </Box>
);

export default CircleInsideCircle;
