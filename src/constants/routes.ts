export enum RoutePathItems {
  APE_IN = 'Ape In',
  DOCS = 'Docs',
  FAQ = 'FAQ',
  LBP = 'LBP',
}

type NavLinks = {
  hideInisSmallerDevices?: boolean;
  isDisabled?: boolean;
  isExternal?: boolean;
  isNavItem?: boolean;
  label: string;
  url: string;
};
export type PathConstantsType = Record<RoutePathItems, NavLinks>;

/**
 * Function to initialize and return the path constants
 */
export default function createPathConstants(): PathConstantsType {
  return {
    [RoutePathItems.LBP]: {
      hideInisSmallerDevices: false,
      isNavItem: true,
      label: RoutePathItems.LBP,
      url: '/launches/lbp/',
    },
    // eslint-disable-next-line perfectionist/sort-objects
    [RoutePathItems.APE_IN]: {
      hideInisSmallerDevices: false,
      isNavItem: true,
      label: RoutePathItems.APE_IN,
      url: '/launches/pump/',
    },
    // eslint-disable-next-line perfectionist/sort-objects
    [RoutePathItems.DOCS]: {
      hideInisSmallerDevices: false,
      isExternal: true,
      isNavItem: true,
      label: RoutePathItems.DOCS,
      url: 'https://apeon.gitbook.io/apeon',
    },
    // eslint-disable-next-line perfectionist/sort-objects
    [RoutePathItems.FAQ]: {
      hideInisSmallerDevices: false,
      isExternal: true,
      isNavItem: true,
      label: RoutePathItems.FAQ,
      url: 'https://apeon.gitbook.io/apeon',
    },
  };
}
