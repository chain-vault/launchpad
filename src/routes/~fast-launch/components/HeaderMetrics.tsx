import React from 'react';

import { Flex } from '@chakra-ui/react';

type HeaderMetricsProps = {
  label: string;
  value: number | string;
};
export const HeaderMetrics: React.FC<HeaderMetricsProps> = ({ label, value }) => (
  <Flex direction="column" justifyContent="flex-end" px={3}>
    <Flex opacity={0.4} textStyle="body-xs">
      {label}
    </Flex>
    <Flex fontSize={16} fontWeight="bold">
      {value}
    </Flex>
  </Flex>
);
