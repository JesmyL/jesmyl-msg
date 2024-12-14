/* @refresh reload */
import { MetaProvider, Title } from '@solidjs/meta';
import { GlobalStyles, ThemeProvider } from '@suid/material';
import { JSX, lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { SMyLib, smylib } from '../shared/utils';
import { globalStyles } from './styles/globalStyles';
import { theme } from './styles/theme';

const ChatingRouter = lazy(() => import('./apps/chating'));
const InviteRouter = lazy(() => import('./apps/invite'));

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

export const renderApplication = (specialAppName = location.hostname) => {
  const apps: Record<string, () => JSX.Element> = {
    [smylib.charCodedTextToString([14300, 14980, 16068, 14300, 15796, 13756, 6276])]: InviteRouter,
    [smylib.charCodedTextToString([14844, 15660, 14028, 6276])]: ChatingRouter,
  };

  const appRoutesKey = SMyLib.keys(apps).find(key => specialAppName.startsWith(key));

  if (appRoutesKey === undefined) return;
  const App = apps[appRoutesKey];

  render(
    () => (
      <MetaProvider>
        <Title>..</Title>
        <ThemeProvider theme={theme}>
          <GlobalStyles styles={globalStyles} />
          <App />
        </ThemeProvider>
      </MetaProvider>
    ),
    root!,
  );
};

// serviceWorkerRegistration.register();
