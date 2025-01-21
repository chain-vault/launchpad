import {
  InputGroup as ChakraInputGroup,
  Input,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import isFunction from 'lodash/isFunction';

import TokenInputRightElement from './TokenInputRightElement';

interface InputGroupProps extends InputProps {
  allowNegativeNumbers?: boolean;
  inputRightElement?: React.ReactNode;
}
const PREVENT_KEYS = [69, 107, 109];
const InputGroup = ({
  allowNegativeNumbers = false,
  inputRightElement,
  ...inputProps
}: InputGroupProps) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const isValidNumber = /^(?=[.\d]{1,}$)\d*(?:\.\d*)?$/.test((value || '').trim());
    if (inputProps.type === 'number') {
      if (allowNegativeNumbers || !value || isValidNumber) {
        if (isFunction(inputProps?.onChange)) {
          inputProps.onChange(e);
        }
      }
      return;
    }

    if (isFunction(inputProps?.onChange)) {
      inputProps.onChange(e);
    }
  };
  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { keyCode } = e;
    if (inputProps.type === 'number' && PREVENT_KEYS.indexOf(keyCode) > -1) {
      e.preventDefault();
    }
  };

  return (
    <ChakraInputGroup alignItems="center">
      <Input
        {...inputProps}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        // onPaste={onInput}
        onWheel={(e) => inputProps.type === 'number' && (e.target as HTMLInputElement).blur()}
        step={inputProps.type === 'number' ? 'any' : undefined}
        variant={inputProps.variant ?? 'filled'}
      />
      {inputRightElement && (
        <InputRightElement h="100%" mr={2} w="unset">
          {inputRightElement}
        </InputRightElement>
      )}
    </ChakraInputGroup>
  );
};

InputGroup.TokenInputRightElement = TokenInputRightElement;

export default InputGroup;
