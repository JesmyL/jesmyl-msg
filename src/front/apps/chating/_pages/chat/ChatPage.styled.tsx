import { SxPropsObject } from '@suid/system/sxProps';
import { Auth } from '../../../../../shared/api/complect/auth';
import { ItChat } from '../../../../../shared/api/complect/chat';
import { css, keyframes, styler } from '../../../../css';

const inlineTypes = [
  ItChat.MessageType.ChatRename,
  ItChat.MessageType.ChatCreate,
  ItChat.MessageType.NewMember,
] satisfies ItChat.MessageType[];
const inlineTypesSelectors = inlineTypes.map(type => `[message-type='${type}']` as const);

const backgroundLessTypes = [...inlineTypes, ItChat.MessageType.BigText] satisfies ItChat.MessageType[];
const backgroundLessTypesSelector = backgroundLessTypes.map(type => `[message-type='${type}']` as const);

export const StyledMessageText = styler('div')();
export const StyledMessage = styler('div')();

export const secretChatClassNamesDict = {
  markAsAccent: 'mark-as-accent',
  messageOnDraft: 'message-on-draft',
  messageOnContextMenu: 'message-on-context-menu',
  inTheProcessOfSearchingForAMessage: 'in-the-process-of-searching-for-a-message',
} as const;

const bigTextInAnimation = keyframes`${css`
  from {
    scale: 0;
  }
  to {
    scale: 1;
  }
`}`;

export const StyledChatPage = styler('div')<{ chat: ItChat.ChatMiniInfo; auth: Auth | und }>(
  ({ theme }) => {
    return {
      height: '100vh',

      '& .message-place': {
        [`&.weight-up`]: {
          [`&${backgroundLessTypesSelector.join(',&')}`]: {
            '.chat-message': {
              backgroundColor: 'transparent',
            },
          },

          [`&[message-type='${ItChat.MessageType.BigText}']`]: {
            transformOrigin: 'center',
            animation: `${bigTextInAnimation} .2s linear`,

            '.chat-message-text': {
              display: 'flex',
              justifyContent: 'center',
              fontSize: ' clamp(100px, 30vmin, 300px)',
              marginTop: '-3vmin',
              imageRendering: 'pixelated',
              textWrap: 'balance',
              wordWrap: 'break-word',
            },
          },

          [`&[message-type='${ItChat.MessageType.ChatRename}'] .chat-message-text::before`]: {
            content: ' переименовал(а) чат на ',
          },

          [`&[message-type='${ItChat.MessageType.ChatCreate}'] .chat-message-text::before`]: {
            content: ' создал(а) чат ',
          },

          [`&[message-type='${ItChat.MessageType.NewMember}'] .chat-message-text::before`]: {
            content: ' добавил(а) ',
          },

          [`&${inlineTypesSelectors.join(',&')}`]: {
            [`${StyledMessage}`]: {
              width: '100%',
              maxWidth: '100%',
              textAlign: 'center',

              '.chat-message-text': {
                color: theme.palette.success.light,

                '&::before': {
                  color: 'var(--color--4)',
                },
              },
            },

            [`.message-title, .chat-message-text`]: {
              display: 'inline',
            },
          },
        },
      },
    };
  },
  ({ theme, ownerState }) => ({
    ...ownerState.chat.members.reduce(
      (acc, member) => {
        const isIUserMember = ownerState.auth?.login === member.user.login;

        acc[`[sender-id='${member.id}']`] = {
          '.message-title': {
            '&::before': {
              content: `'${member.user.fio.replace(/'/g, "\\'")}'`,
            },

            display: isIUserMember ? 'none' : undefined,
          },

          '.chat-message, &.chat-message': {
            color: '#fff',
            backgroundColor: isIUserMember ? theme.palette.primary.light : theme.palette.secondary.light,
            padding: theme.spacing(1),
            float: isIUserMember ? 'right' : undefined,
          },
        };

        const selector = `[sender-id='${member.id}']:not(:is(${inlineTypesSelectors.join(',')}))`;

        acc[`${selector}:has(+ ${selector})`] = {
          '.message-title': {
            display: 'none',
          },
        };

        return acc;
      },
      {} as Record<string, SxPropsObject>,
    ),
  }),
);
