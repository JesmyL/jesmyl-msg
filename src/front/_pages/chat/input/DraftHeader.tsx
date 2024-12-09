import { CloseOutlined, Edit, Reply } from '@suid/icons-material';
import { IconButton } from '@suid/material';
import { createDexieArrayQuery } from 'solid-dexie';
import { Show } from 'solid-js';
import { ItChat } from '../../../../shared/api/complect/chat';
import { complectIDB } from '../../../_idb/complect.idb';
import { styler } from '../../../css';
import { joinKnownClassNames, knownUtilTypographyClassNames } from '../../../styles/known-class-names';
import { useChatContext } from '../Contexts';

interface Props {
  // draftTargetMessage: ItChat.ImportableMessage;
  draft: ItChat.MessageDraft;
  // scrollToAccentMessage: (messageId: ItChat.MessageId) => void;
  // listRef: HTMLDivElement;
}

export const SecretChatMessageDraftHeader = (props: Props) => {
  const chat = useChatContext();
  // const draftTargetMessage = () => {};
  // const [draftMessages, setDraftMessages] = useAtom(secretChatsDraftsAtom);
  // const draft = draftMessages[chatId];

  // useEffect(() => {
  //   if (listRef.current === null || (!draft?.editId && !draft?.replyId)) return;

  //   const targetNode = listRef.current.querySelector(`[message-id='${draft.replyId || draft.editId}']`);
  //   if (targetNode === null) return;

  //   const type = draft.replyId ? 'reply' : 'edit';
  //   targetNode.classList.add(secretChatClassNamesDict.messageOnDraft, type);

  //   return () => {
  //     targetNode.classList.remove(secretChatClassNamesDict.messageOnDraft, type);
  //   };
  // }, [draft?.editId, draft?.replyId, listRef]);

  return (
    <Show when={props.draft.editId != null || props.draft.replyId != null}>
      {_is => {
        const targetMessage = createDexieArrayQuery(() => {
          return complectIDB.db.messages
            .where('id')
            .equals(props.draft.editId ?? props.draft.replyId!)
            .toArray();
        });

        return (
          <Show when={targetMessage[0]}>
            {targetMessage => (
              <StyledSecretChatMessageDraftHeader
                class={joinKnownClassNames(['flex-between', 'margin-gap-b'])}
                sx={
                  props.draft.editId != null
                    ? {
                        '.title::after': {
                          content: "'Редактирование'",
                        },

                        '.reply-icon': {
                          display: 'none',
                        },
                      }
                    : {
                        '.title::after': {
                          content: "'Ответ'",
                        },

                        '.edit-icon': {
                          display: 'none',
                        },
                      }
                }
              >
                <div
                  class={joinKnownClassNames(['flex', 'flex-gap', 'full-width'])}
                  onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    // scrollToAccentMessage(draftTargetMessage.id);
                  }}
                >
                  <Edit class={joinKnownClassNames(['margin-gap'], 'edit-icon')} />
                  <Reply class={joinKnownClassNames(['margin-gap'], 'reply-icon')} />
                  <div class="info-block">
                    <div class="title" />
                    <div class={joinKnownClassNames(['ellipsis'], 'message-text')}>{targetMessage().text}</div>
                  </div>
                </div>

                <IconButton
                  class={joinKnownClassNames(['margin-gap'])}
                  onClick={() => complectIDB.db.drafts.update(chat.id, { editId: undefined, replyId: undefined })}
                >
                  <CloseOutlined />
                </IconButton>
              </StyledSecretChatMessageDraftHeader>
            )}
          </Show>
        );
      }}
    </Show>
  );
};

export const StyledSecretChatMessageDraftHeader = styler('div')<{ $draft: any }>(
  {
    ...knownUtilTypographyClassNames.flex,
  },
  ({ theme }) => {
    return {
      '.message-text': {
        fontSize: '0.9em',
        maxWidth: 'calc(var(--stock-width) - 120px)',
      },

      '.info-block': {
        borderLeft: '2px solid',
        borderLeftColor: theme.palette.success.light,
        paddingLeft: '8px',
        width: '100%',

        '.title::after': {
          color: theme.palette.success.light,
          lineHeight: 1,
        },
      },
    };
  },
);
