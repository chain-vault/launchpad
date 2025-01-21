/* eslint-disable perfectionist/sort-objects */

type FontSize = { base: string; md: string };
type FontWeight = '600' | 'bold' | 'extrabold' | 'medium' | 'normal' | 'semibold';
type LetterSpacing = { base: string; md: string };
type LineHeight = { base: string; md: string } | string;
type FontFamily = string;
type Light = {};

interface TextStyle {
  _light?: Light;
  fontFamily?: FontFamily;
  fontSize: FontSize;
  fontWeight: FontWeight;
  letterSpacing?: LetterSpacing;
  lineHeight?: LineHeight;
}
type TextStyles = Record<string, TextStyle>;

export const textStyles: TextStyles = {
  h1: {
    /** Header 1 - 48px and 36px */
    fontSize: { base: '28px', md: '5xl' },
    fontWeight: 'semibold',
    letterSpacing: { base: '0.9px', md: '0.96px' },
    lineHeight: '100%',
    fontFamily: 'Gilroy',
  },
  h2: {
    /** Header 2 - 40px and 24px */
    fontSize: { base: '2xl', md: '3xl' },
    fontWeight: 'semibold',
    letterSpacing: { base: '0.96px', md: '0.96px' },
    lineHeight: '100%',
    fontFamily: 'Gilroy',
  },
  h3: {
    /** Header 3 - 18px and 16px */
    fontSize: { base: 'md', md: 'lg' },
    fontWeight: 'semibold',
    letterSpacing: { base: '0.96px', md: '0.96px' },
    lineHeight: '100%',
    fontFamily: 'Gilroy',
  },

  'body-regular': {
    /** 16px and 14px  */
    fontSize: { base: 'sm', md: 'md' },
    fontWeight: 'normal',
    letterSpacing: { base: '0.5px', md: '0.5px' },
    lineHeight: '120%',
  },
  'body-regular-semibold': {
    /** 16px and 14px  */
    fontSize: { base: 'sm', md: 'md' },
    fontWeight: 'medium',
    letterSpacing: { base: '0.5px', md: '0.5px' },
    lineHeight: '120%',
  },
  'body-regular-bold': {
    fontSize: { base: 'sm', md: 'md' },
    fontWeight: 'bold',
    letterSpacing: { base: '0.5px', md: '0.5px' },
    lineHeight: '120%',
  },
  'body-regular-extrabold': {
    /** 16px and 14px  */
    fontSize: { base: 'sm', md: 'md' },
    fontWeight: 'extrabold',
    letterSpacing: { base: '0.5px', md: '0.5px' },
    lineHeight: '120%',
  },
  'body-md': {
    /** 14px and 12px  */
    fontSize: { base: 'xs', md: 'sm' },
    fontWeight: 'normal',
    lineHeight: { md: '120%', base: '120%' },
    letterSpacing: { base: '0.6px', md: '0.6px' },
    _light: {
      fontWeight: 'bold',
    },
  },
  'body-md-semibold': {
    /** 14px and 12px  */
    fontSize: { base: 'xs', md: 'sm' },
    fontWeight: 'medium',
    lineHeight: '120%',
    letterSpacing: { base: '0.6px', md: '0.6px' },
  },
  'body-md-bold': {
    /** 14px and 12px  */
    fontSize: { base: 'xs', md: 'sm' },
    fontWeight: 'bold',
    lineHeight: '120%',
    letterSpacing: { base: '0.6px', md: '0.6px' },
  },
  'body-md-extrabold': {
    /** 14px and 12px  */
    fontSize: { base: 'xs', md: 'sm' },
    fontWeight: 'extrabold',
    lineHeight: '120%',
    letterSpacing: { base: '0.6px', md: '0.6px' },
  },
  'body-sm': {
    /** 12px and 10px  */
    fontSize: { base: '10px', md: 'xs' },
    fontWeight: 'normal',
    lineHeight: '120%',
    letterSpacing: { base: '0.6px', md: '0.6px' },
    _light: {
      fontWeight: 'bold',
    },
  },
  'body-sm-bold': {
    /** 12px and 10px  */
    fontSize: { base: '10px', md: 'xs' },
    fontWeight: 'bold',
    lineHeight: '120%',
  },
  'body-xs': {
    /** 10px and 8px  */
    fontSize: { base: '8px', md: '10px' },
    fontWeight: 'medium',
    lineHeight: '120%',
    letterSpacing: { base: '0.6px', md: '0.6px' },
  },
  'body-xs-bold': {
    /** 10px and 8px  */
    fontSize: { base: '8px', md: '10px' },
    fontWeight: 'bold',
    lineHeight: '120%',
    letterSpacing: { base: '0.6px', md: '0.6px' },
  },
};
