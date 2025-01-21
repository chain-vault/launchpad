import { defineStyleConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const Button = defineStyleConfig({
  baseStyle: (props) => ({
    alignItems: 'center',
    bg: mode('base.800', 'base.200')(props),
    borderRadius: '3xl',
    color: mode('base.200', 'base.800')(props),
    display: 'flex',
    fontWeight: 'medium',
    px: 6,
    py: 4,
    textAlign: 'center',
  }),
  sizes: {
    md: {
      fontSize: '15px',
      lineHeight: '18px',
    },
    sm: {
      fontSize: 'sm',
      lineHeight: '16px',
    },
    xs: {
      padding: 2,
    },
  },
  variants: {
    accent: {
      _disabled: {
        _hover: {
          bg: 'brand.accent.600 !important',
        },
        opacity: 0.6,
      },
      _hover: {
        _loading: {
          bg: 'brand.accent.600',
        },
        bg: 'brand.accent.500',
      },
      bg: 'brand.accent.600',
      color: 'base.800',
      px: 6,
      py: 4,
      transition: '0.1s ease-in',
    },
    filled: (props) => ({
      _hover: {
        bg: mode('base.200', 'base.600')(props),
      },
      bg: mode('base.100', 'base.800')(props),
      border: '2px solid',
      borderColor: mode('base.300', 'base.700')(props),
      color: mode('base.800', 'base.100')(props),
      px: 6,
      py: 4,
    }),
    ghost: (props) => ({
      _disabled: {
        _hover: {
          bg: `${mode('base.100', 'base.700')(props)} !important`,
        },
        opacity: 0.6,
      },
      _hover: {
        bg: mode('base.400', 'base.600')(props),
      },
      bg: mode('base.100', 'base.700')(props),
      borderColor: mode('base.300', 'base.700')(props),
      color: mode('base.800', 'base.200')(props),
      px: 6,
      py: 4,
    }),
    'ghost-invariant': (props) => ({
      _hover: {
        bg: mode('base.400', 'base.600')(props),
      },
      bg: mode('base.200', 'base.700')(props),
      borderColor: mode('base.200', 'base.700')(props),
      color: mode('base.800', 'base.200')(props),
      px: 6,
      py: 4,
    }),

    inactive: ({ colorMode }) => ({
      bg: colorMode === 'dark' ? 'base.500' : 'base.300',
      color: colorMode === 'dark' ? 'base.600' : 'base.400',
      cursor: 'default',
    }),

    lbpPagination: (props) => ({
      _disabled: {
        _hover: {
          bg: `${mode('base.200', 'base.700')(props)} !important`,
        },
        opacity: 0.6,
      },
      _hover: {
        bg: mode('base.400', 'base.600')(props),
      },
      bg: mode('base.200', 'base.700')(props),
      borderColor: mode('base.300', 'base.700')(props),
      color: mode('base.800', 'base.200')(props),
      px: 6,
      py: 4,
    }),

    outline: (props) => ({
      _hover: {
        bg: mode('base.300', 'base.600')(props),
        borderColor: 'transparent',
      },
      bg: mode('base.500', 'base.750')(props),
      border: '2px solid',
      borderColor: mode('base.300', 'base.700')(props),
      color: mode('base.800', 'base.100')(props),
      px: 6,
      py: 4,
    }),
    'outline-ape': {
      _hover: {
        _loading: {
          bg: 'brand.accent.600',
        },
        bg: 'brand.accent.500',
        color: 'base.900',
      },
      backdropFilter: 'blur(10px)',
      bg: 'rgba(185, 130, 242, 0.30)',
      borderColor: 'brand.accent.600',

      borderWidth: '2px',
      color: 'surface.base.900',
      px: 6,
      py: 4,
    },
    'outline-lbp': {
      _hover: {
        _loading: {
          bg: 'brand.secondary.600',
        },
        bg: 'brand.secondary.500',
        color: 'base.900',
      },
      backdropFilter: 'blur(10px)',
      bg: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'brand.secondary.600',
      borderWidth: '2px',
      color: 'surface.base.900',
      px: 6,
      py: 4,
    },

    secondary: {
      _disabled: {
        _hover: {
          bg: 'brand.secondary.600 !important',
        },
      },
      _hover: {
        _loading: {
          bg: 'brand.secondary.600',
        },
        bg: 'brand.secondary.500',
      },
      bg: 'brand.secondary.600',
      color: 'base.800',
      px: 6,

      py: 4,
      transition: '0.1s ease-in',
    },
    solid: {
      _active: {
        _loading: {
          bg: 'brand.secondary.600',
        },
        bg: 'brand.secondary.500',
      },
      _disabled: {
        _hover: {
          bg: 'brand.secondary.600 !important',
        },
      },
      _hover: {
        _loading: {
          bg: 'brand.secondary.600',
        },
        bg: 'brand.secondary.500',
      },
      bg: 'brand.secondary.600',
      color: 'base.800',
      px: 6,
      py: 4,
    },

    unstyled: {
      display: 'flex',
      px: 6,
      py: 4,
    },
  },
});

export default Button;
