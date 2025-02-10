import React from 'react';

import { Flex, Text } from '@chakra-ui/react';
import { FaQuestionCircle } from 'react-icons/fa';

import { TooltipWithIcon } from '@components/ui/Tooltip';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';

interface InfoRowItemProps {
  helperText?: React.ReactNode;
  isPositive?: boolean;
  label: string;
  tooltipValue?: string;
  value: string;
}

const InfoRowItem = ({ helperText, isPositive, label, tooltipValue, value }: InfoRowItemProps) => (
  <Flex justifyContent="space-between" textStyle="body-sm" w="100%">
    <Flex alignItems="center" gap={2} justifyContent="space-between">
      <Text opacity={0.5}>{label}</Text>
      {helperText && (
        <TooltipWithIcon icon={FaQuestionCircle} placement="auto" tooltipContent={helperText} />
      )}
    </Flex>
    <NumberWithTooltip
      color={
        isPositive === true ? 'green.500'
        : isPositive === false ?
          'danger.700'
        : 'inherit'
      }
      opacity={1}
      showtooltip={!!tooltipValue}
      tooltip={tooltipValue ?? ''}
    >
      {value}
    </NumberWithTooltip>
  </Flex>
);

export default InfoRowItem;
