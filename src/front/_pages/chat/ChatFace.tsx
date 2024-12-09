import { Avatar, Grid } from '@suid/material';
import { createSignal, Show } from 'solid-js';
import { ItChat } from '../../../shared/api/complect/chat';
import { styler } from '../../css';
import { joinKnownClassNames, knownUtilTypographyClassNames } from '../../styles/known-class-names';

interface Props {
  chat: ItChat.ChatMiniInfo;
  onFaceClick: () => void;
}

export const ChatFace = (props: Props) => {
  const [is, setIs] = createSignal(false);

  const lastMessage = () => {
    return props.chat.messages[0];
  };

  const lastMessageMember = () => {
    const senderId = lastMessage().sentMemberId;

    return props.chat.members.find(member => member.id === senderId);
  };

  return (
    <StyledFaceItem onClick={props.onFaceClick}>
      <div class={joinKnownClassNames(['full-size', 'flex', 'flex-center'], 'avatar')}>
        <Avatar>CM</Avatar>
      </div>
      <div class={joinKnownClassNames(['ellipsis'], 'title')}>{props.chat.title}</div>
      <Show when={lastMessageMember()}>
        {lastMessageMember => (
          <div class={joinKnownClassNames(['ellipsis'], 'sender-fio')}>{lastMessageMember().user.fio}</div>
        )}
      </Show>
      <Show when={lastMessage()}>
        {lastMessage => (
          <div class={joinKnownClassNames(['full-max-width', 'flex'], 'message')}>
            <StyledLastMessageText class={joinKnownClassNames(['ellipsis'])}>
              {lastMessage().text}
            </StyledLastMessageText>
            <span> • </span>
            {new Date(lastMessage().createdAt).toLocaleTimeString().slice(0, -3)}
          </div>
        )}
      </Show>
    </StyledFaceItem>
  );
};

const StyledFaceItem = styler('div')(({ theme }) => ({
  ...knownUtilTypographyClassNames.pointer,
  display: 'grid',
  fontSize: '0.8em',
  lineHeight: '1.2',
  marginTop: '10px',
  columnGap: theme.spacing(1),

  gridTemplateAreas: `
    'avatar title'
    'avatar sender-fio'
    'avatar message'
  `,
  gridTemplateColumns: '40px auto',
  [`& .avatar`]: { gridArea: 'avatar' },
  [`& .title`]: { gridArea: 'title' },
  [`& .sender-fio`]: { gridArea: 'sender-fio' },
  [`& .message`]: {
    gridArea: 'message',
    container: 'last-message-text',
    columnGap: theme.spacing(0.5),
  },
}));

const StyledFaceLogo = styler('div')<{ $withUnreadBadge: boolean }>(({ props }) => {
  //   return props.$withUnreadBadge && styledBadgeContainer('absolute');
  return {};
});

const StyledTextInfo = styler(Grid)({
  lineHeight: 1,
});

const StyledLastMessageText = styler('span')(({ theme }) => ({
  maxWidth: 'calc(100cqw - 110px)',
}));
