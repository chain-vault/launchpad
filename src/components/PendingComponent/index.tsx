import { Center } from '@chakra-ui/react';
import Lottie from 'react-lottie';

import PendingAnimation from './monkey-loading.json';

const defaultOptions = {
  animationData: PendingAnimation,
  autoplay: true,
  loop: true,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const PendingComponent = () => (
  <Center h="100%" w="100%">
    <Lottie height={65} options={defaultOptions} speed={1} width={65} />
  </Center>
);

export default PendingComponent;
