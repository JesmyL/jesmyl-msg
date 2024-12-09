-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('ChatCreate', 'ChatRename', 'Text', 'BigText', 'NewMember', 'Remove');

-- CreateEnum
CREATE TYPE "ChatMemberRights" AS ENUM ('Creator', 'Admin', 'User', 'CantSendMessage');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "fio" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "tgId" BIGINT,
    "tgAva" TEXT,
    "lastVisit" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rights" (
    "userId" BIGINT NOT NULL,
    "cm" INTEGER[],
    "bible" INTEGER[],
    "index" INTEGER[]
);

-- CreateTable
CREATE TABLE "Message" (
    "id" BIGSERIAL NOT NULL,
    "chatid" BIGINT NOT NULL,
    "sentMemberId" BIGINT NOT NULL,
    "replyMessageId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "prevText" TEXT,
    "type" "MessageType" NOT NULL,
    "isRemoved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" BIGSERIAL NOT NULL,
    "chatId" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMember" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "chatid" BIGINT NOT NULL,
    "rights" "ChatMemberRights"[],

    CONSTRAINT "ChatMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Rights_userId_key" ON "Rights"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "Chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_chatId_key" ON "Chat"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMember_id_key" ON "ChatMember"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMember_userId_chatid_key" ON "ChatMember"("userId", "chatid");

-- AddForeignKey
ALTER TABLE "Rights" ADD CONSTRAINT "Rights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sentMemberId_fkey" FOREIGN KEY ("sentMemberId") REFERENCES "ChatMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatid_fkey" FOREIGN KEY ("chatid") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_chatid_fkey" FOREIGN KEY ("chatid") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
