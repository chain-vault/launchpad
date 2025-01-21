import { useEffect, useState } from 'react';

import { Flex, Image, Spinner, Text, useColorModeValue } from '@chakra-ui/react';

import { generateBubbleMapUrl } from '@utils/buildUrl';

import { ApeHead } from '@assets/imges';

interface BubbleMapProps {
  loading: boolean;
  token: null | string;
}

const BubbleMap: React.FC<BubbleMapProps> = ({ loading, token }: BubbleMapProps) => {
  const [height, setHeight] = useState(window.innerHeight - 130);

  const theme = useColorModeValue('apeon_light', 'apeon_dark');

  const iframeSrc = generateBubbleMapUrl(token, theme);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading) {
    return (
      <Flex align="center" h={[height, '500px']} justify="center" w="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!token) {
    return (
      <Flex
        align="center"
        bg={theme === 'apeon_dark' ? '#0C0C0C' : 'base.100'}
        borderRadius="2xl"
        direction="column"
        gap={2}
        h="500px"
        justify="center"
        w="100%"
      >
        <Image boxSize={20} src={ApeHead} />
        <Text textStyle="body-md">Unable to generate Bubble Map </Text>
      </Flex>
    );
  }

  return (
    <Flex borderRadius="2xl" h={['calc(100vh - 150px)', 'calc(100vh - 200px)']} p={0} w="100%">
      <iframe
        height="100%"
        src={iframeSrc}
        style={{ border: 'none', borderRadius: '18px' }}
        title="BubbleMap"
        width="100%"
        allowFullScreen
      />
    </Flex>
  );
};

export default BubbleMap;
