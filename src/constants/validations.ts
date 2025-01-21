import { ASCII_STRING_PATTERN } from './stringPattern';

export const TOKEN_NAME_VALIDATION_RULES = {
  maxLength: {
    message: 'Token name length should not exceed 32 characters',
    value: 32,
  },
  minLength: {
    message: 'Token name length should be at least 4 characters',
    value: 4,
  },
  pattern: ASCII_STRING_PATTERN,
  required: 'Required field',
};

export const TOKEN_SYMBOL_VALIDATION_RULES = {
  maxLength: {
    message: 'Token symbol length should not exceed 10 characters',
    value: 10,
  },
  minLength: {
    message: 'token symbol length should be at least 3 characters',
    value: 3,
  },
  pattern: ASCII_STRING_PATTERN,
  required: 'Required field',
};
