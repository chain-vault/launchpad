import type { FieldError, Merge } from 'react-hook-form';

import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from '@chakra-ui/react';

interface FormHandlerProps {
  alignOptionalLabel?: 'left' | 'right';
  fieldError: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  helperText?: string;
  htmlFor: string;
  inputField: React.ReactNode;
  label: string;
  optional?: boolean;
  required?: boolean;
}

export const FormHandler = ({
  alignOptionalLabel = 'left',
  fieldError,
  helperText,
  htmlFor,
  inputField,
  label,
  optional,
  required = false,
}: FormHandlerProps) => (
  <FormControl isInvalid={!!fieldError} textAlign="left">
    <Flex alignItems="center" justifyContent="space-between">
      <FormLabel
        alignItems="center"
        display="flex"
        flex="auto"
        gap={2}
        htmlFor={htmlFor}
        {...(alignOptionalLabel === 'right' ?
          {
            justifyContent: 'space-between',
            width: !fieldError?.message ? '100%' : '',
          }
        : {})}
      >
        {label} {required && '*'}
        {!fieldError?.message && optional ?
          <Text opacity={0.5} textStyle="body-sm">
            {alignOptionalLabel === 'right' ? 'Optional' : '(Optional)'}
          </Text>
        : null}
      </FormLabel>
      <FormErrorMessage color="danger.700" m={0}>
        <Text mb={2} textStyle="body-sm">
          {fieldError?.message}
        </Text>
      </FormErrorMessage>
    </Flex>
    {inputField}
    <FormHelperText fontSize={['10px', '10px', 'xs']}>{helperText}</FormHelperText>
  </FormControl>
);
