import { useCallback } from 'react';

import {
  Box,
  HStack,
  useRadio,
  useRadioGroup,
  UseRadioGroupReturn,
  UseRadioProps,
} from '@chakra-ui/react';

import { RadioButtonOption } from '@app-types/index';

interface RadioCardProps extends UseRadioProps {
  children: React.ReactNode;
}

/** Currently only support string options */
interface TabRadioButtonProps {
  name: string;
  onChange: (value: string) => void;
  options: RadioButtonOption[];
  value: string;
}

const RadioCard = ({ children, ...props }: RadioCardProps) => {
  const { isChecked } = props;
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  const handleSelect = useCallback(() => {
    if (isChecked && input.onChange) {
      (input.onChange as UseRadioGroupReturn['onChange'])('');
    }
  }, [input.onChange, isChecked]);

  return (
    <Box as="label">
      <input
        {...input}
        onKeyDown={(e) => {
          if (e.key !== ' ') return;
          if (isChecked) {
            // handle unselect
            e.preventDefault();
            handleSelect();
          }
        }}
        onClick={handleSelect}
      />
      <Box
        {...checkbox}
        _checked={{
          bg: 'surface.base.750',
          opacity: 1,
        }}
        bg="surface.base.600"
        borderRadius="md"
        cursor="pointer"
        opacity={0.7}
        px={3}
        py={2}
        textStyle="body-xs"
      >
        {children}
      </Box>
    </Box>
  );
};

export const TabRadioButton = ({ name, onChange, options, value }: TabRadioButtonProps) => {
  const { getRadioProps, getRootProps } = useRadioGroup({
    name,
    onChange,
    value,
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value });
        return (
          <RadioCard key={option.id} {...radio}>
            {option.displayValue}
          </RadioCard>
        );
      })}
    </HStack>
  );
};
