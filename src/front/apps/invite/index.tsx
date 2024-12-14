import { HashRouter, Route } from '@solidjs/router';
import { ChristmasInvitePage } from './_pages/christmas';

const InviteRouter = () => (
  <HashRouter>
    <Route
      path="/christmas"
      component={ChristmasInvitePage}
    />
  </HashRouter>
);

export default InviteRouter;
