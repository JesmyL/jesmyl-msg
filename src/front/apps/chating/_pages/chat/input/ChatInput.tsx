import { ArrowUpwardRounded } from '@suid/icons-material';
import { CircularProgress, IconButton, TextField } from '@suid/material';
import { createDexieSignalQuery } from 'solid-dexie';
import { createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { ItChat } from '../../../../../../shared/api/complect/chat';
import { makeRegExp } from '../../../../../../shared/utils';
import { styler } from '../../../../../css';
import { sokim } from '../../../../../soki/soki';
import { joinKnownClassNames, knownUtilTypographyClassNames } from '../../../../../styles/known-class-names';
import { chatingIDB } from '../../../_idb/chating.idb';
import { useChatContext, useChatMessagesContext, useGoToBottomMessageContext } from '../Contexts';
import { SecretChatMessageDraftHeader } from './DraftHeader';

export const ChatInput = () => {
  const chat = useChatContext();
  const [isSending, setIsSending] = createSignal(false);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const draft = createDexieSignalQuery(() => chatingIDB.db.drafts.get({ chatid: chat.id }));
  const goToBottom = useGoToBottomMessageContext();
  const messages = useChatMessagesContext();

  const draftText = () => draft()?.text ?? '';
  const [value, setValue] = createSignal(draftText());

  let firstDraftTextSetter = () => {
    if (draft()) {
      setValue(draftText());
      // firstDraftTextSetter = () => '';
    }
    return '';
  };

  let setDraftTextTimeOut: TimeOut;

  createEffect(() => {
    clearTimeout(setDraftTextTimeOut);
    setDraftTextTimeOut = setTimeout(setDraftText, 4000, value());
  });

  const setDraftText = async (text: string) => {
    const isChanged = await chatingIDB.db.drafts.update(chat.id, { text });

    if (isChanged) return;

    chatingIDB.db.drafts.add({ chatid: chat.id, text, prevSimpleMessageText: '' });
  };

  onCleanup(() => setDraftText(value()));

  const sendMessage = () => {
    const text = value().trim();
    if (isSending() || text == (0 as never)) return;

    setIsSending(true);

    sokim
      .send({
        chatFetch: {
          chatId: chat.chatId,
          message: {
            text,
            type: text.match(
              makeRegExp(
                '/^(\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)+|\\p{EPres}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?|\\p{Emoji}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F}))$/u',
              ),
            )
              ? ItChat.MessageType.BigText
              : ItChat.MessageType.Text,
            replyMessageId: draft()?.replyId,
            editMessageId: draft()?.editId,
          },
        },
      })
      .on(() => {
        setValue('');
        setIsSending(false);
        if (draft()?.editId == null) goToBottom(true);

        chatingIDB.db.drafts.update(chat.id, {
          text: draft()?.prevSimpleMessageText ?? '',
          editId: undefined,
          replyId: undefined,
          prevSimpleMessageText: '',
        });
      });
  };

  let prevTargetId: ItChat.MessageId | und = undefined;

  createEffect(() => {
    const targetId = draft()?.editId ?? draft()?.replyId;

    if (prevTargetId === targetId) return;
    prevTargetId = targetId;

    inputRef()?.select();
  });

  return (
    <StyledMessagePlace>
      {firstDraftTextSetter()}
      <StyledMessagePlaceStock>
        <Show when={draft()}>
          {draft => (
            <SecretChatMessageDraftHeader
              draft={draft()}
              // scrollToAccentMessage={scrollToAccentMessage}
              // listRef={listRef}
            />
          )}
        </Show>

        <StyledMessageControls>
          <TextField
            onChange={event => setValue(event.currentTarget.value)}
            value={value()}
            multiline
            fullWidth
            maxRows={10}
            variant="filled"
            label="Сообщение"
            InputProps={{
              ref: element => setInputRef(element.querySelector('textarea, input') as never),
              onKeyDown: event => {
                if (event.code !== 'Enter') return;
                if (event.ctrlKey || event.shiftKey) return;

                event.preventDefault();

                sendMessage();
              },
            }}
          />
          <div class="send-button-box">
            {messages.length}
            <Show when={isSending()}>
              <CircularProgress
                color="info"
                class={joinKnownClassNames(['absolute'])}
              />
            </Show>

            <IconButton
              disabled={value() == (0 as never)}
              onClick={() => sendMessage()}
            >
              <ArrowUpwardRounded color="primary" />
            </IconButton>
          </div>
        </StyledMessageControls>
      </StyledMessagePlaceStock>
    </StyledMessagePlace>
  );
};

const StyledMessagePlaceStock = styler('div')({
  width: 'var(--stock-width)',
});

const StyledMessagePlace = styler('label')(({ theme }) => ({
  ...knownUtilTypographyClassNames['full-width'],
  ...knownUtilTypographyClassNames['flex-center'],
  backgroundColor: theme.palette.warning.light,
  paddingBlock: theme.spacing(1),
}));

const StyledMessageControls = styler('div')({
  ...knownUtilTypographyClassNames['flex-center'],

  '.send-button-box': {
    ...knownUtilTypographyClassNames['flex-items-end'],
  },
});
