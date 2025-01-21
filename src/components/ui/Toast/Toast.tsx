import { Box, HStack, Icon, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { RxCheck, RxCross1 } from 'react-icons/rx';

import { ToastType } from '@constants/index';

interface ToastProps {
  message: string;
  toastType: ToastType;
}

const Toast = ({ message, toastType }: ToastProps) => {
  const IconBg = toastType === ToastType.FAILED ? 'danger.500' : 'brand.secondary.600';
  return (
    <SimpleGrid gap={2}>
      <HStack>
        <Box
          alignItems="center"
          bg={IconBg}
          borderRadius="full"
          color="base.800"
          display="inline-flex"
          justifyContent="center"
          p={ToastType.FAILED ? 3 : 2}
        >
          {toastType === ToastType.FAILED ?
            <Icon as={RxCross1} boxSize={4} />
          : <Icon as={RxCheck} boxSize={6} />}
        </Box>
        <VStack alignItems="flex-start">
          <Text textStyle="body-sm-bold">{toastType}</Text>
          <Text opacity={0.5} textStyle="body-xs">
            {message}
          </Text>
        </VStack>
      </HStack>
    </SimpleGrid>
  );
};

export default Toast;
