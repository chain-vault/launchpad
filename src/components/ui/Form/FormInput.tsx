import {
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  InputRightElementProps,
} from '@chakra-ui/react';
import isFunction from 'lodash/isFunction';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> extends UseControllerProps<T> {
  allowNegativeValue?: boolean;
  inputProps?: InputProps;
  inputRightElement?: React.ReactNode;
  maxLength?: number;
  onChange?: <K extends keyof T>(key: K, value: T[K]) => void;
  placeholder: string;
  rightElementProps?: InputRightElementProps;
  shouldParseToNumber?: boolean;
  shouldTrim?: boolean;
  type?: string;
}

export const FormInput = <T extends FieldValues>({
  allowNegativeValue = false,
  inputProps = {},
  inputRightElement,
  maxLength = -1,
  onChange,
  placeholder,
  rightElementProps = {},
  shouldParseToNumber,
  shouldTrim = false,
  type = 'text',
  ...props
}: FormInputProps<T>) => {
  const { field } = useController(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value =
      type === 'number' && shouldParseToNumber ? parseFloat(e.target.value) : e.target.value;
    if (type === 'number' && !allowNegativeValue && (value as number) < 0) {
      return;
    }
    if (type === 'text' && typeof value === 'string') {
      if (shouldTrim) {
        value = value.trim();
      }
      if (maxLength > -1 && value.length > maxLength) {
        value = value.substring(0, maxLength);
      }
    }

    field.onChange(value);
    if (isFunction(onChange)) {
      onChange(field.name as keyof T, value as T[keyof T]);
    }
  };

  return (
    <InputGroup>
      <Input
        name={field.name}
        onChange={handleChange}
        onWheel={(e) => type === 'number' && (e.target as HTMLInputElement).blur()}
        placeholder={placeholder}
        ref={field.ref}
        step={type === 'number' ? 'any' : undefined}
        type={type}
        value={field.value}
        variant="filled"
        {...inputProps}
      />
      {inputRightElement ?
        <InputRightElement mr={6} {...rightElementProps}>
          {inputRightElement}
        </InputRightElement>
      : null}
    </InputGroup>
  );
};
