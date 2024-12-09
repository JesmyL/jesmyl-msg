import { createTheme } from '@suid/material';

declare module '@suid/material/styles' {
  interface TypographyVariants {}

  interface TypographyVariantsOptions {}
}

declare module '@suid/material/Typography' {
  interface TypographyPropsVariantOverrides {}
}

export const theme = createTheme({
  typography: {},
});
