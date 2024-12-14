import { Link, Title } from '@solidjs/meta';
import { JSX } from 'solid-js';
import { SMyLib } from '../../../../../shared/utils';
import { styler } from '../../../../css';
import { sokij } from '../../../../soki/soki';
import { createProducedStore } from '../../../../store/useProducedStore';
import { knownUtilTypographyClassNames } from '../../../../styles/known-class-names';
import bottom from './src/bottom.svg';
import date from './src/date.svg';
import head from './src/head.svg';
import program from './src/program.svg';
import simfLabel from './src/simf-label.svg';
// import { JSoki } from '../../../../../shared/api';

sokij.start();

export const ChristmasInvitePage = () => {
  // const meetId = 'cm4mstwe30000u6ublny6nguh';
  // const [loc] = useSearchParams();
  // const [isCome, setIsCome] = createSignal(JSoki.IsInvitedGuestCome.Pass);

  const [loadedIndexesSet, setLoadedIndexesSet] = createProducedStore<number[]>([]);

  // const guestId = () => +loc.guest!;

  // createEffect(() => {
  //   sokij
  //     .sendExternal({
  //       inviteGuestData: {
  //         guestId: guestId(),
  //         meetId,
  //         getData: true,
  //       },
  //     })
  //     .on(event => {
  //       if (event.invitedGuest) {
  //         setIsCome(event.invitedGuest.isCome);
  //       }
  //     });
  // });

  const images: Record<string, { style?: JSX.CSSProperties; cb?: (img: JSX.Element) => JSX.Element }> = {
    [head]: { cb: img => img },
    [date]: {
      style: {
        'margin-top': 'calc(var(--stock-width) / -6)',
      },
    },
    [program]: {
      style: {
        'margin-top': 'calc(var(--stock-width) / 15)',
      },
    },
    [bottom]: {
      style: {
        'margin-top': 'calc(var(--stock-width) / -5)',
        'margin-bottom': 'calc(var(--stock-width) / 15)',
      },
      cb: img => (
        <StyledButtonArea
          sx={{
            ...knownUtilTypographyClassNames.relative,
            ...knownUtilTypographyClassNames['flex-center'],
          }}
        >
          {img}
          <StyledButton
            href="https://t.me/+cvT_s8GrLZkxYzgy"
            sx={{
              ...knownUtilTypographyClassNames.absolute,
              ...knownUtilTypographyClassNames.pointer,
              top: '59%',
              height: '11%',
              width: '32%',
            }}
            // onClick={() => {
            //   if (isCome() !== JSoki.IsInvitedGuestCome.Ignored) return;

            //   setIsCome(JSoki.IsInvitedGuestCome.WillBe);

            //   sokij
            //     .sendExternal({
            //       inviteGuestData: {
            //         guestId: guestId(),
            //         meetId,
            //         setIsCome: JSoki.IsInvitedGuestCome.WillBe,
            //       },
            //     })
            //     .on(event => {
            //       console.log(event);
            //     });
            // }}
          />
        </StyledButtonArea>
      ),
    },
  };

  const checkVisibility = (index: number): '0' | '1' => {
    const indexes = new Set(loadedIndexesSet);

    for (let i = 0; i <= index; i++) {
      if (!indexes.has(i)) return '0';
    }

    return '1';
  };

  return (
    <StyledCard>
      <Title>С Рождеством Христовым!</Title>

      <Link
        rel="shortcut icon"
        type="image/ico"
        href={simfLabel}
      />

      <StyledStock>
        {SMyLib.entries(images).map(([src, { cb, style }], index) => {
          const img = (
            <StockImg
              src={src}
              style={{
                ...style,
                opacity: checkVisibility(index),
                transition: 'opacity 1s',
              }}
              onLoad={() => {
                setLoadedIndexesSet(indexes => indexes.push(index));
              }}
            />
          );

          return cb == null ? img : cb(img);
        })}
      </StyledStock>
    </StyledCard>
  );
};

const StyledButtonArea = styler('div')();
const StyledButton = styler('a')();

const StockImg = styler('img')({
  maxWidth: '100%',
});

const StyledStock = styler('div')({
  maxWidth: 'var(--stock-width)',
  margin: 'auto',
});

const StyledCard = styler('div')({
  '--stock-width': 'min(600px, 100dvw)' as never,
  backgroundColor: '#FEFAEF',
  minHeight: '100dvh',
});
