import { Theme as CustomTheme } from '../theme/index';

import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}
