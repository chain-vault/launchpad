import { StyleConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

export const Toast: StyleConfig = {
  baseStyle: {
    closeButton: {
      _groupHover: { opacity: 1 },
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: 15,
      height: 5,
      opacity: 0,
      position: 'absolute',
      right: '2px',
      top: '2px',
      transitionDuration: '.2s',
      width: 5,
      zIndex: 1,
    },
    icon: {
      fontSize: '25px',
    },
    iconFailed: {
      color: 'danger.500',
    },
    iconSuccess: {
      color: 'brand.accent.600',
    },
    link: {},
    spinner: {
      color: 'brand.accent.600',
    },
    spinnerEmptyColor: {
      color: 'base.400',
    },
    toast: {
      backdropFilter: 'blur(25px)',
      border: 'solid 1px',
      borderRadius: '15px',
      gap: 2,
      left: {
        base: 0,
        md: 'initial',
      },
      p: '8px',
      position: 'relative',
      width: '100%',
      zIndex: 9999,
    },
  },
  defaultProps: {
    variant: 'accent',
  },
  sizes: {
    lg: {},
    md: {},
  },
  variants: {
    accent: (props) => ({
      link: {
        color: 'brand.accent.600',
      },
      spinner: {
        color: mode('brand.accent.600', 'brand.accent.600')(props),
      },
      spinnerEmptyColor: {
        color: mode('brand.accent.100', 'brand.accent.900')(props),
      },
      toast: {
        background: 'background.toast',
        borderColor: 'brand.accent.600',
        color: 'surface.base.900',
      },
    }),
    secondary: (props) => ({
      iconSuccess: {
        bg: 'brand.secondary.950',
        borderRadius: 'full',
        color: mode('brand.secondary.600', 'brand.secondary.600')(props),
      },
      link: {
        color: mode('brand.secondary.900', 'brand.secondary.600')(props),
      },

      spinner: {
        color: mode('brand.secondary.600', 'brand.secondary.600')(props),
      },
      spinnerEmptyColor: {
        color: mode('brand.secondary.950', 'brand.secondary.900')(props),
      },
      toast: {
        background: 'background.toast2',
        borderColor: 'brand.secondary.950',
        color: 'surface.base.900',
      },
    }),
  },
};

export default Toast;
