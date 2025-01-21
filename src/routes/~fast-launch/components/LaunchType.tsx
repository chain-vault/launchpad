import React from 'react';

import { Box, chakra, Flex, Text, useRadio, useRadioGroup } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { LaunchTypeIcon } from '@components/LaunchTypeIcon';
import { CurveIndex, DEX_OPTIONS } from '@constants/config';
import useGetCurveSettings from '@hooks/apein/useGetCurveSettings';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { Token } from '@utils/token';

const options = [
  { name: 'Nano Launch', value: CurveIndex.NANO_LAUNCH },
  { name: 'Prime Launch', value: CurveIndex.PRIME_LAUNCH },
];

type RadioInputProps = {
  iconAlign: 'left' | 'right';
  name: string;
  type: CurveIndex;
} & React.HTMLAttributes<HTMLInputElement>;

const Info: React.FC<{ curveIndex: CurveIndex }> = ({ curveIndex }) => {
  const { curveSettings } = useGetCurveSettings(undefined, curveIndex);
  const { getValues, watch } = useFormContext();

  watch(['lock']);
  const selectedDex = DEX_OPTIONS.find((option) => getValues('migrationDEX') === option.value);

  return (
    <Box mb={1} mt={1}>
      <Text fontSize={12} lineHeight="18px" mt={2} opacity={0.5} textStyle="body-xs">
        When the market cap reaches
        <chakra.span mx={1}>
          {formatNumber({
            input: curveSettings && Token.fromRawAmount(curveSettings.targetMarketcap),
            placeholder: '-',
            suffix: 'SOL',
            type: NumberFormatType.TxValuesFormatter,
          })}
        </chakra.span>
        (raising
        <chakra.span mx={1}>
          {formatNumber({
            input: curveSettings && Token.fromRawAmount(curveSettings.maxRaiseAmount),
            placeholder: '-',
            suffix: 'SOL',
            type: NumberFormatType.TxValuesFormatter,
          })}
        </chakra.span>
        fund) all the liquidity from the bonding curve will be deposited into{' '}
        <chakra.span>{selectedDex?.title ?? ''}</chakra.span> and burned. Progression increases as
        the price goes up.
      </Text>
    </Box>
  );
};
const LaunchTypeRadio: React.FC<RadioInputProps> = ({ iconAlign, name, type, ...props }) => {
  const { getInputProps, getRadioProps, htmlProps } = useRadio(props);

  const input = getInputProps();
  const radio = getRadioProps();

  return (
    <chakra.label {...htmlProps} position="relative" width="100%">
      <input {...input} style={{ display: 'none' }} />
      <Box
        {...radio}
        _checked={{
          opacity: 1,
        }}
        alignItems="center"
        border="solid 3px"
        borderColor="brand.accent.600"
        borderRadius="12px"
        cursor="pointer"
        display="flex"
        height="100%"
        justifyContent="center"
        opacity={0.3}
        px={2}
        py={3}
        textStyle={{ base: 'h6', md: 'h2' }}
        transitionDuration=" 0.2s"
      >
        <LaunchTypeIcon
          type={type}
          {...(iconAlign === 'left' ? { left: 2 } : { right: 2, transform: 'rotateY(180deg)' })}
          position="absolute"
          top="-20px"
          transition="all ease .2s"
          zIndex={1}
        />
        <Flex
          alignItems="center"
          direction={{ base: 'column', md: 'row' }}
          flexDirection="column"
          justifyContent="center"
        >
          <Box textStyle="h3"> {name}</Box>
          <Box>
            <Info curveIndex={type} />
          </Box>
        </Flex>
      </Box>
    </chakra.label>
  );
};

export const FastLaunchType: React.FC = () => {
  const { getValues, setValue, watch } = useFormContext();
  watch(['type']);
  const type = getValues('type');
  const { getRadioProps, getRootProps } = useRadioGroup({
    name: 'type',
    onChange: (value: string) => {
      setValue('type', value);
    },
    value: type,
  });

  const rootProps = getRootProps();

  return (
    <Box position="relative" w="full" zIndex={20}>
      <Box textAlign="left" textStyle="body-md-bold">
        Choose launch type*
      </Box>
      <Flex {...rootProps} direction={{ base: 'column', md: 'row' }} gap={2} mt={7} width="100%">
        {options.map((item, index) => {
          const radioProps = getRadioProps({ value: item.value });
          return (
            <Flex
              flex="auto"
              h="100%"
              key={item.name.split(' ').join('-')}
              m={0}
              mt={{ base: index !== 0 ? 8 : 0, md: 0 }}
              p={0}
              position="relative"
            >
              <LaunchTypeRadio
                {...radioProps}
                iconAlign={index % 2 === 0 ? 'left' : 'right'}
                name={item.name}
                type={item.value}
              />
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
