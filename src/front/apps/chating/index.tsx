import { HashRouter, Route } from '@solidjs/router';
import { sokim } from '../../soki/soki';
import ChatsPage from './_pages/chats';

sokim.start();

const ChatingRouter = () => (
  <HashRouter>
    <Route
      path="/"
      component={ChatsPage}
    />
  </HashRouter>
);

export default ChatingRouter;
