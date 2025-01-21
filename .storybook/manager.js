import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Apeon',
    brandUrl: '',
    brandImage: '/app-logo.svg',
    brandTarget: '_self',

    //
    colorPrimary: '#3B1662',
    colorSecondary: '#B982F2',

    // Text colors
    textColor: '#ffffff',
    textInverseColor: '#ffffff',

    // Toolbar default and active colors
    barTextColor: '#ffffff',
    barSelectedColor: '#B982F2',
    barHoverColor: '#B982F2',
  }),
});
