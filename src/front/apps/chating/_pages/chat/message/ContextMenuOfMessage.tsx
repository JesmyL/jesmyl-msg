import { Delete, DeleteForever, DeleteOutlineTwoTone, Edit, Pin, Reply } from '@suid/icons-material';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@suid/material';
import { createSignal, JSX, Show } from 'solid-js';
import { ItChat } from '../../../../../../shared/api/complect/chat';
import { authSignal } from '../../../../../_idb/complect.idb';
import { css, styler } from '../../../../../css';
import { sokim } from '../../../../../soki/soki';
import { knownUtilTypographyClassNames } from '../../../../../styles/known-class-names';
import { RefValue } from '../../../../../utils/useRef';
import { chatingIDB } from '../../../_idb/chating.idb';
import { useChatContext, useChatMessageTsOnActionsContext } from '../Contexts';

export const ContextMenuOfMessage = (props: {
  message: ItChat.ImportableMessage;
  listRef?: RefValue<HTMLDivElement>;
}) => {
  const setMessageTsOnActions = useChatMessageTsOnActionsContext();
  const [isOpenDeleteContent, setIsOpenDeleteContent] = createSignal(false);
  const chat = useChatContext();
  // const [draftMessages, setDraftMessages] = useAtom(secretChatsDraftsAtom);
  const auth = authSignal();

  // useEffect(() => {
  //   if (listRef.current === null) return;

  //   const targetNode = listRef.current.querySelector(`[message-id='${messageId}']`);
  //   if (targetNode === null) return;

  //   targetNode.classList.add(secretChatClassNamesDict.messageOnContextMenu);

  //   return () => {
  //     targetNode.classList.remove(secretChatClassNamesDict.messageOnContextMenu);
  //   };
  // }, [listRef, messageId]);

  const memberMe = () => (auth?.login ? chat.members.find(member => member.user.login === auth.login) : undefined);
  const isMyMessage = () => props.message.sentMemberId === memberMe()?.id;
  const isEditableMessage = () => ItChat.editableMessageTypesSet.has(props.message.type);

  const draft = chatingIDB.getDrafts(props.message.chatid);

  const simplifyCurrentDraft = () => {
    const targetId = draft?.replyId ?? draft?.editId;

    if (targetId !== props.message.id) return;

    chatingIDB.db.drafts.update(chat.id, {
      text: draft?.prevSimpleMessageText ?? '',
      editId: undefined,
      replyId: undefined,
      prevSimpleMessageText: '',
    });
  };

  return (
    <StyledListBox>
      <StyledList disablePadding>
        <Show when={isOpenDeleteContent()}>
          <Item
            icon={<DeleteOutlineTwoTone />}
            text="Удалить у меня"
            onClick={() => {
              chatingIDB.db.messages.update(props.message.id, { isRemoved: true });
              simplifyCurrentDraft?.();
              setMessageTsOnActions(null);
            }}
          />
          <Show when={isMyMessage()}>
            <Item
              icon={<DeleteForever />}
              text="Удалить у всех"
              // className="color--ko"
              onClick={() => {
                const send = sokim.send({
                  chatFetch: {
                    chatId: chat.chatId,
                    removeMessages: [props.message.id],
                  },
                });
                if (simplifyCurrentDraft) send.on(simplifyCurrentDraft);
                setMessageTsOnActions(null);
              }}
            />
          </Show>
        </Show>

        <Show when={!isOpenDeleteContent()}>
          <Item
            icon={<Reply />}
            text="Ответить"
            onClick={() => {
              chatingIDB.db.drafts.update(chat.id, {
                editId: undefined,
                replyId: props.message.id,
              });
              // setMessageTsOnActions(null);
            }}
          />
          <Show when={isEditableMessage()}>
            {/* <CopyTextButton
              text={message.text}
              withoutIcon
              onClose={() => setMessageTsOnActions(null)}
              description={
                <Item
                  Icon={IconCopy01StrokeRounded}
                  title="Скопировать"
                />
              }
            /> */}
            <Show when={isMyMessage()}>
              <Item
                icon={<Edit />}
                text="Изменить"
                onClick={() => {
                  chatingIDB.db.drafts.update(chat.id, {
                    text: props.message.text,
                    editId: props.message.id,
                    replyId: undefined,
                    prevSimpleMessageText: draft?.text ?? '',
                  });
                  // setMessageTsOnActions(null);
                }}
              />
            </Show>
            <Item
              icon={<Pin />}
              text="Закрепить"
              onClick={() => {}}
            />
          </Show>
          <Item
            icon={<Delete />}
            text="Удалить"
            // className="color--ko"
            onClick={event => {
              event.stopPropagation();
              setIsOpenDeleteContent(true);
            }}
          />
        </Show>
      </StyledList>
    </StyledListBox>
  );
};

const StyledListBox = styler('div')({
  ...knownUtilTypographyClassNames['flex-center'],
  ...knownUtilTypographyClassNames['full-width'],
});

const StyledList = styler(List)(({ theme }) => ({
  ...knownUtilTypographyClassNames.absolute,
  top: '50%',
  backgroundColor: theme.palette.grey.A100,
  margin: 'auto',
}));

const Item = (props: { icon: JSX.Element; text: string; onClick: CallbackStopper }) => {
  return (
    <ListItem
      disablePadding
      onClick={props.onClick}
    >
      <ListItemButton>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItemButton>
    </ListItem>
  );
};

css`
  margin: 0 var(--main-gap);

  .icon-box {
    margin-right: var(--main-big-gap);
  }
`;
