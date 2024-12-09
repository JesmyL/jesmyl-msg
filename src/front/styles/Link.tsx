import { A } from '@solidjs/router';
import { styler } from '../css';

export const StyledLink = styler(A)({
  color: 'currentcolor',
  textDecoration: 'none',
});
