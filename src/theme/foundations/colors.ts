export const colors = {
  base: {
    '100': '#FFFFFF',
    '150': '#f0f0f0',
    '200': '#F2F2F2',
    '250': '#e2e2e2',
    '300': '#E2E2E2',
    '400': '#ADADAD',
    '500': '#5B5B5B',
    '600': '#383838',
    '700': '#242424',
    '750': '#202020',
    '800': '#121212',
    '900': '#000000',
  },
  brand: {
    accent: {
      '100': '#E9D4FF',
      '500': '#CCA3F7',
      '600': '#B982F2',
      '900': '#3B1662',
    },
    secondary: {
      '100': '#F9F2AF',
      '500': '#FFF385',
      '600': '#FFE500',
      '900': '#463F00',
      '950': '#B6A300',
    },
  },
  container: {
    accent: {
      dark: 'linear-gradient(180deg, #26143a 0%, #121212 100%);',
      light: 'linear-gradient(180deg, #F9F2AF 0%, #e2e2e2 100%);',
    },
    danger: {
      dark: 'linear-gradient(180deg, #3E0F0F 0%, #181212 100%);',
      light: 'linear-gradient(180deg, #FFCECE 0%, #FFF8F8 100%);',
    },
    secondary: {
      dark: 'linear-gradient(180deg, #463F00 0%, #121212 100%);',
      light: 'linear-gradient(180deg, #F9F2AF 0%, #e2e2e2 100%);',
    },
  },
  danger: {
    '500': '#FF8B67',
    '700': '#F00',
  },
  header: {
    dark: 'linear-gradient(180deg, #100D13 0%, rgba(16, 13, 19, 0.00) 100%);',
    light: 'linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%);',
  },
};

export const semanticColors = {
  background: {
    container: {
      accent: {
        _dark: 'linear-gradient(180deg, #3B1662 0%, #121212 100%);',
        default: 'linear-gradient(180deg, #E9D4FF 0%, #FFF 100%);',
      },
      danger: {
        _dark: 'linear-gradient(180deg, #463F00 0%, #121212 100%);',
        default: 'linear-gradient(180deg, #FFCECE 0%, #FFF8F8 100%);',
      },
      secondary: {
        _dark: 'linear-gradient(180deg, #463F00 0%, #121212 100%);',
        default: 'linear-gradient(180deg, #F9F2AF 0%, #FFF 100%);',
      },
    },
    header: {
      _dark: 'linear-gradient(180deg, #100D13 0%,#100D13 55%, rgba(16, 13, 19, 0.00) 100%);',
      default: 'linear-gradient(180deg, #FFF 0%, #FFF 55%, rgba(255, 255, 255, 0.00) 100%);',
    },
    overlay: {
      _dark: 'linear-gradient(180deg, rgba(59, 22, 98, 1) 0%, rgba(0, 0, 0, 0) 100%)',
      default: 'linear-gradient(180deg, rgba(233, 212, 255, 1) 0%, rgba(0, 0, 0, 0) 100%)',
    },
    solScanFL: {
      _dark: 'brand.accent.900',
      default: 'brand.accent.500',
    },
    solScanFLColor: {
      _dark: 'brand.accent.500',
      default: 'brand.accent.900',
    },
    solScanLbp: {
      _dark: 'brand.secondary.900',
      default: 'brand.secondary.600',
    },
    solScanLbpColor: {
      _dark: 'brand.secondary.500',
      default: 'brand.secondary.900',
    },
    toast: {
      _dark: 'rgba(185, 130, 242, 0.10)',
      default: 'rgba(185, 130, 242, 0.10)',
    },
    toast2: {
      _dark: 'rgba(255, 229, 0, 0.05)',
      default: 'brand.secondary.100',
    },
    upcomingPools: {
      _dark: 'brand.secondary.100',
      default: 'brand.secondary.900',
    },
  },
  shadow: {
    _dark: '0px 10px 18px -2px rgba(10, 9, 11, 0.5)',
    default: '0px 10px 18px -2px rgba(10, 9, 11, 0.5)',
  },
  surface: {
    base: {
      100: {
        _dark: 'base.700',
        default: 'base.100',
      },
      200: {
        _dark: 'base.800',
        default: 'base.100',
      },
      300: {
        _dark: 'base.900',
        default: 'base.100',
      },

      400: {
        _dark: 'base.600',
        default: 'base.400',
      },
      500: {
        _dark: 'base.700',
        default: 'base.200',
      },
      600: {
        _dark: 'base.750',
        default: 'base.250',
      },
      700: {
        _dark: 'base.800',
        default: 'base.200',
      },
      750: {
        _dark: 'base.600',
        default: 'base.400',
      },
      800: {
        _dark: 'base.400',
        default: 'base.500',
      },
      900: {
        _dark: 'base.100',
        default: 'base.800',
      },
      950: {
        _dark: 'base.700',
        default: 'base.300',
      },
      poolcard: {
        _dark: 'base.750',
        default: 'base.200',
      },
      shadow: {
        _dark: `linear(rgba(0,0,0,0) 0%, rgba(0,0,0,0) 90%, rgba(0,0,0,.6) 100%)`,
        default: `linear(rgba(0,0,0,0) 0%, rgba(0,0,0,0) 90%, rgba(255,255,255,.6) 100%)`,
      },
      trending: {
        _dark: 'base.800',
        default: 'base.150',
      },
    },
    brand: {
      accent: {
        100: {
          _dark: 'brand.accent.900',
          default: 'brand.accent.100',
        },
      },
      secondary: {
        100: {
          _dark: 'brand.secondary.900',
          default: 'brand.secondary.100',
        },
        900: {
          _dark: 'brand.secondary.100',
          default: 'brand.secondary.900',
        },
      },
    },
    fast_launch: {
      _dark: 'brand.accent.900',
      default: 'brand.accent.100',
    },
  },
};
