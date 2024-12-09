/* @refresh reload */
import { HashRouter, Route } from '@solidjs/router';
import { GlobalStyles, ThemeProvider } from '@suid/material';
import { render } from 'solid-js/web';
import { App } from './_pages/app';
import { ChatsPage } from './_pages/chats';
import { soki } from './soki/soki';
import { globalStyles } from './styles/globalStyles';
import { theme } from './styles/theme';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

soki.start();

export const renderApplication = () => {
  render(
    () => (
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={globalStyles} />
        <HashRouter root={App}>
          <Route
            path="/"
            component={ChatsPage}
          />
          {/* <Route
            path=":chatId"
            component={ChatPage}
          /> */}
        </HashRouter>
      </ThemeProvider>
    ),
    root!,
  );
};

// serviceWorkerRegistration.register();
