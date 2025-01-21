import React from 'react';

import { Box, HStack, useRadio, useRadioGroup } from '@chakra-ui/react';
import { ReactNode } from '@tanstack/react-router';
import isFunction from 'lodash/isFunction';

const RadioCard: React.FC<{ children: ReactNode }> = ({ children, ...props }) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        _checked={{
          bg: 'surface.base.500',
          borderColor: 'surface.base.600',
        }}
        _focus={{
          boxShadow: 'none',
        }}
        borderColor="transparent"
        borderRadius="full"
        borderWidth="1px"
        boxShadow="md"
        cursor="pointer"
        fontSize="12px"
        px={1}
        py={0}
        textStyle="body-sm"
      >
        {children}
      </Box>
    </Box>
  );
};
type IntervalOptions = {
  defaultValue?: number;
  onSelect: (value: number) => void;
  options: {
    label: string;
    value: number | string;
  }[];
};

export const TradeGraphInterval: React.FC<IntervalOptions> = ({
  defaultValue,
  onSelect,
  options = [],
}) => {
  const onChangeHandler = (value: string) => {
    if (isFunction(onSelect)) {
      onSelect(parseFloat(value));
    }
  };
  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: `${defaultValue}`,
    name: 'framework',
    onChange: onChangeHandler,
  });
  const group = getRootProps();

  return (
    <HStack
      {...group}
      border="solid 1px"
      borderColor="surface.base.500"
      borderRadius="full"
      gap={0.5}
      px={1}
      py={1}
    >
      {options.map(({ label, value }) => {
        const radio = getRadioProps({ value: value.toString() });
        return (
          <RadioCard key={value} {...radio}>
            {label}
          </RadioCard>
        );
      })}
    </HStack>
  );
};
