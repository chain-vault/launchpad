import { StyleConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

export const ApeToggle: StyleConfig = {
  baseStyle: (props) => ({
    active: {
      bg: mode('brand.accent.500', 'brand.accent.900')(props),
      borderColor: mode('brand.accent.500', 'brand.accent.900')(props),
    },
    button: {
      ':hover': {
        userSelect: 'initial',
      },
      alignItems: 'center',
      border: '1px solid',
      borderColor: 'transparent',
      borderRadius: '32px',
      color: 'surface.base.900',
      display: 'flex',
      fontSize: 12,
      height: '100%',
      justifyContent: 'center',
      minWidth: '60px',
      padding: '4px 0.5rem',
      textStyle: 'body-md-bold',
      whiteSpace: 'nowrap',
      width: '100%',
    },
    wrapper: {
      alignItems: 'center',
      background: 'surface.base.200',
      border: '2px solid',
      borderColor: 'surface.base.500',
      borderRadius: '32px',
      cursor: 'pointer',
      display: 'flex',
      height: '100%',
      outline: 'none',
      padding: '1px',
      width: '100%',
    },
  }),
  variants: {
    base: (props) => ({
      active: {
        bg: mode('base.100', 'base.800')(props),
        borderColor: mode('base.200', 'base.700')(props),
        color: mode('base.800', 'base.100')(props),
      },
      button: {
        color: mode('base.100', 'base.800')(props),
      },
      wrapper: {
        background: mode('base.800', 'base.100')(props),
      },
    }),
    lbp: (props) => ({
      active: {
        bg: mode('brand.secondary.500', 'brand.secondary.900')(props),
        borderColor: mode('brand.secondary.500', 'brand.secondary.900')(props),
      },
    }),
    multiToggle: {
      button: {
        borderRightColor: 'surface.base.500',
      },
    },
    trade: {
      active: {
        bg: '#5FD875',
        borderColor: '#5FD875',
        color: 'base.100',
      },
      highlight: {
        bg: '#FC1369',
        borderColor: '#FC1369',
        color: 'base.100',
      },
    },
  },
};

export default ApeToggle;
