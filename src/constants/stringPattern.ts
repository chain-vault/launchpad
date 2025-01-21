export const STRING_ALPHA_NUMERIC_PATTERN = {
  message: 'No special charecters are allowed',
  value: /^[a-zA-Z ]*$/,
};
export const ASCII_STRING_PATTERN = {
  message: 'Non ascii characters are not allowed',
  value: /^[ -~]+$/,
};

export const STRING_URL_PATTERN = {
  message: 'Please enter a valid URL',
  value: new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ),
};
const USER_NAME_VALIDATION_MESSAGE = 'Please enter a valid username';
export const STRING_TWITTER_USERNAME = {
  message: USER_NAME_VALIDATION_MESSAGE,
  value: /^@?[a-zA-Z0-9_]{1,15}$/,
};

export const STRING_GITHUB_USERNAME = {
  message: USER_NAME_VALIDATION_MESSAGE,
  value: /^@?\w(-\w|\w\w|\w){0,19}$/,
};

export const NUMBER_WITHOUT_PREFIX_SUFFIX = /[^\d.,₀₁₂₃₄₅₆₇₈₉]/g;

export const HTTPS_URL_PATTERN = /^https:\/\/[a-zA-Z0-9-_.]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/;
