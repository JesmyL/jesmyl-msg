import { createSignal } from 'solid-js';
import { styler } from '../css';

const funcName = 'onTelegramNativeAuth';

interface Props {
  // onAuthSuccessRef: { current: (event: SokiServerEvent) => void };
  // showToastRef: { current: () => void };
}

export const TgNativeAuth = (props: Props) => {
  const [tgNativeRef, setTgNativeRef] = createSignal<HTMLDivElement>();
  const [isScriptLoaded, setIsScriptLoaded] = createSignal<unknown>(false);

  // useEffect(() => {
  //   if (!isScriptLoaded || tgNativeRef.current === null || tgNativeRef.current.childElementCount !== 0) return;
  //   const tgAuthIframe = document.querySelector('#telegram-login-jesmylbot');
  //   (window as any)[funcName] = (user: TelegramNativeAuthUserData) => {
  //     soki.send({ tgNativeAuthorization: user }, 'index').on(onAuthSuccessRef.current, showToastRef.current);
  //   };

  //   if (tgAuthIframe === null) return;
  //   tgNativeRef.current.appendChild(tgAuthIframe);

  //   return () => {
  //     document.body.appendChild(tgAuthIframe);
  //     delete (window as any)[funcName];
  //   };
  // }, [isScriptLoaded, onAuthSuccessRef, showToastRef]);

  return (
    <>
      <script
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="jesmylbot"
        data-size="small"
        data-onauth="onTelegramNativeAuth(user)"
        data-request-access="write"
        onLoad={setIsScriptLoaded}
      />

      <AuthButton ref={setTgNativeRef} />
    </>
  );
};

const AuthButton = styler('div')({
  height: '2.2em',
});
