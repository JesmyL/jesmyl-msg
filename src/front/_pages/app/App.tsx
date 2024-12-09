import { RouteSectionProps } from '@solidjs/router';

export const App = (props: RouteSectionProps<unknown>) => {
  return <>{props.children}</>;
};
