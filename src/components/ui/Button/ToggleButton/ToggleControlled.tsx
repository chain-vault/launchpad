import React from 'react';

import { Box, Button, chakra, useMultiStyleConfig } from '@chakra-ui/react';

import { ToggleButtonOption } from '@app-types/index';

type ToggleControlledProps = {
  onSwitchToggle: (selectedIndex: string) => void;
  options: ToggleButtonOption[];
  value: string;
  variant?: string;
};
export const ToggleControlled: React.FC<ToggleControlledProps> = ({
  onSwitchToggle,
  options,
  value,
  variant,
}) => {
  const { active, button, highlight, wrapper } = useMultiStyleConfig('ApeToggle', {
    variant,
  });

  const isSelected = (selectedValue: string) => value === selectedValue;

  const onToggle = () => {
    if (options.length === 2) onSwitchToggle(value);
  };

  const onSwitchMultiToggle = (selectedValue: string) => {
    if (options.length > 2) onSwitchToggle(selectedValue);
  };

  const getButtonStyles = (selectedValue: string, option: ToggleButtonOption) => {
    if (isSelected(selectedValue)) {
      return { ...button, ...(option.highlightColor ? highlight : active) };
    }
    return button;
  };
  return (
    <Box alignItems="center" display="flex" height="100%" onClick={onToggle}>
      <Button __css={wrapper}>
        {options.map((option) => (
          <chakra.span
            __css={getButtonStyles(option.value, option)}
            key={option.id}
            onClick={() => onSwitchMultiToggle(option.value)}
          >
            {option.label}
          </chakra.span>
        ))}
      </Button>
    </Box>
  );
};
export default ToggleControlled;
