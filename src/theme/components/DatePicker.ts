import { defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

/* eslint-disable perfectionist/sort-objects */

const DatePicker = defineStyleConfig({
  baseStyle: (props) => ({
    /** Container */
    '.react-datepicker': {
      fontFamily: 'Space Grotesk',
      border: '1px solid',
      borderColor: mode('base.200', 'base.700')(props),
      backgroundColor: mode('base.100', 'base.800')(props),
      borderRadius: '16px',
      color: mode('base.800', 'base.100')(props),
    },
    '.react-datepicker-wrapper': {
      width: '100%',
    },
    '.react-datepicker__triangle': {
      display: 'none',
    },

    /** Header styles */
    '.react-datepicker__header': {
      backgroundColor: mode('base.100', 'base.800')(props),
    },
    '.react-datepicker__header--custom': {
      borderRadius: '16px 0 0 0',
      borderBottom: 'none',
    },
    '.react-datepicker__header--time': {
      borderColor: mode('base.200', 'base.700')(props),
      borderRadius: '0 16px 0 0 !important',
    },

    /** Time styles */
    '.react-datepicker__time-container': {
      borderLeft: '1px solid',
      borderColor: mode('base.200', 'base.700')(props),
      height: 'auto',
      borderRadius: '0 0 16px 0',
    },
    '.react-datepicker__time': {
      overflow: 'hidden',
    },
    '.react-datepicker-time__header': {
      color: mode('base.800', 'base.100')(props),
      opacity: '0.5',
    },
    '.react-datepicker__time-box': {
      backgroundColor: mode('base.100', 'base.800')(props),
    },
    'ul.react-datepicker__time-list': {
      scrollbarColor: mode('base.800 base.100', 'base.100 base.800')(props),
      scrollbarWidth: 'thin',
    },
    'li.react-datepicker__time-list-item': {
      marginTop: '10px',
      marginBottom: '10px',
      transition: '0.3s ease in',
      ':hover': {
        color: 'brand.secondary.600',
        backgroundColor: 'transparent !important',
      },
    },
    '.react-datepicker__time-list-item--selected': {
      backgroundColor: `${mode('base.100', 'base.800')(props)} !important`,
      color: 'brand.secondary.600 !important',
    },

    /** Day styles */
    '.react-datepicker__day': {
      color: mode('base.800', 'base.100')(props),
      width: '40px',
      height: '40px',
      lineHeight: '40px',
      margin: '2px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'md',
      fontWeight: 500,
      transition: '0.3s ease in',
      ':hover': {
        backgroundColor: 'brand.secondary.600',
        borderRadius: '50%',
        color: 'base.800',
      },
    },
    '.react-datepicker__day--disabled': {
      opacity: 0.2,
      cursor: 'not-allowed',
      ':hover': {
        backgroundColor: 'inherit',
        color: 'inherit',
      },
    },
    '.react-datepicker__day--selected, .react-datepicker__day--keyboard-selected': {
      backgroundColor: 'brand.secondary.600',
      borderRadius: '50%',
      color: 'base.800',
    },
    '.react-datepicker__day-name': {
      color: mode('base.800', 'base.100')(props),
      opacity: 0.3,
      fontSize: 'small',
      fontWeight: 500,
      width: '40px',
      display: 'inline-block',
    },

    '@media (max-width: 768px)': {
      /** Time styles */
      '.react-datepicker__time-container': {
        width: '100%',
        borderTop: '1px solid',
        borderColor: mode('base.200', 'base.700')(props),
      },
      '.react-datepicker__time': {
        width: '100%',
        borderRadius: '0 0 16px 16px !important',
      },
      'ul.react-datepicker__time-list': {
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        padding: '0 8px',
        height: '50px !important',
        maxWidth: '350px',
        whiteSpace: 'no-wrap',
      },
      'li.react-datepicker__time-list-item': {
        margin: '10px 10px',
        minWidth: '60px',
        textAlign: 'center',
        fontSize: 'md',
        fontWeight: 500,
      },
      '.react-datepicker__time-box': {
        height: '50px',
        width: '100% !important',
      },
    },
  }),
});

export default DatePicker;
