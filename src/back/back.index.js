"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/crypt/crypt.js
var require_crypt = __commonJS({
  "node_modules/crypt/crypt.js"(exports2, module2) {
    (function() {
      var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt = {
        // Bit-wise rotation left
        rotl: /* @__PURE__ */ __name(function(n, b) {
          return n << b | n >>> 32 - b;
        }, "rotl"),
        // Bit-wise rotation right
        rotr: /* @__PURE__ */ __name(function(n, b) {
          return n << 32 - b | n >>> b;
        }, "rotr"),
        // Swap big-endian to little-endian and vice versa
        endian: /* @__PURE__ */ __name(function(n) {
          if (n.constructor == Number) {
            return crypt.rotl(n, 8) & 16711935 | crypt.rotl(n, 24) & 4278255360;
          }
          for (var i = 0; i < n.length; i++)
            n[i] = crypt.endian(n[i]);
          return n;
        }, "endian"),
        // Generate an array of any length of random bytes
        randomBytes: /* @__PURE__ */ __name(function(n) {
          for (var bytes = []; n > 0; n--)
            bytes.push(Math.floor(Math.random() * 256));
          return bytes;
        }, "randomBytes"),
        // Convert a byte array to big-endian 32-bit words
        bytesToWords: /* @__PURE__ */ __name(function(bytes) {
          for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
            words[b >>> 5] |= bytes[i] << 24 - b % 32;
          return words;
        }, "bytesToWords"),
        // Convert big-endian 32-bit words to a byte array
        wordsToBytes: /* @__PURE__ */ __name(function(words) {
          for (var bytes = [], b = 0; b < words.length * 32; b += 8)
            bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
          return bytes;
        }, "wordsToBytes"),
        // Convert a byte array to a hex string
        bytesToHex: /* @__PURE__ */ __name(function(bytes) {
          for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 15).toString(16));
          }
          return hex.join("");
        }, "bytesToHex"),
        // Convert a hex string to a byte array
        hexToBytes: /* @__PURE__ */ __name(function(hex) {
          for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
          return bytes;
        }, "hexToBytes"),
        // Convert a byte array to a base-64 string
        bytesToBase64: /* @__PURE__ */ __name(function(bytes) {
          for (var base64 = [], i = 0; i < bytes.length; i += 3) {
            var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
            for (var j = 0; j < 4; j++)
              if (i * 8 + j * 6 <= bytes.length * 8)
                base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
              else
                base64.push("=");
          }
          return base64.join("");
        }, "bytesToBase64"),
        // Convert a base-64 string to a byte array
        base64ToBytes: /* @__PURE__ */ __name(function(base64) {
          base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
          for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
            if (imod4 == 0) continue;
            bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
          }
          return bytes;
        }, "base64ToBytes")
      };
      module2.exports = crypt;
    })();
  }
});

// node_modules/charenc/charenc.js
var require_charenc = __commonJS({
  "node_modules/charenc/charenc.js"(exports2, module2) {
    var charenc = {
      // UTF-8 encoding
      utf8: {
        // Convert a string to a byte array
        stringToBytes: /* @__PURE__ */ __name(function(str) {
          return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
        }, "stringToBytes"),
        // Convert a byte array to a string
        bytesToString: /* @__PURE__ */ __name(function(bytes) {
          return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
        }, "bytesToString")
      },
      // Binary encoding
      bin: {
        // Convert a string to a byte array
        stringToBytes: /* @__PURE__ */ __name(function(str) {
          for (var bytes = [], i = 0; i < str.length; i++)
            bytes.push(str.charCodeAt(i) & 255);
          return bytes;
        }, "stringToBytes"),
        // Convert a byte array to a string
        bytesToString: /* @__PURE__ */ __name(function(bytes) {
          for (var str = [], i = 0; i < bytes.length; i++)
            str.push(String.fromCharCode(bytes[i]));
          return str.join("");
        }, "bytesToString")
      }
    };
    module2.exports = charenc;
  }
});

// node_modules/is-buffer/index.js
var require_is_buffer = __commonJS({
  "node_modules/is-buffer/index.js"(exports2, module2) {
    module2.exports = function(obj) {
      return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
    };
    function isBuffer(obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    }
    __name(isBuffer, "isBuffer");
    function isSlowBuffer(obj) {
      return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
    }
    __name(isSlowBuffer, "isSlowBuffer");
  }
});

// node_modules/md5/md5.js
var require_md5 = __commonJS({
  "node_modules/md5/md5.js"(exports2, module2) {
    (function() {
      var crypt = require_crypt(), utf8 = require_charenc().utf8, isBuffer = require_is_buffer(), bin = require_charenc().bin, md53 = /* @__PURE__ */ __name(function(message, options) {
        if (message.constructor == String)
          if (options && options.encoding === "binary")
            message = bin.stringToBytes(message);
          else
            message = utf8.stringToBytes(message);
        else if (isBuffer(message))
          message = Array.prototype.slice.call(message, 0);
        else if (!Array.isArray(message) && message.constructor !== Uint8Array)
          message = message.toString();
        var m = crypt.bytesToWords(message), l = message.length * 8, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
        for (var i = 0; i < m.length; i++) {
          m[i] = (m[i] << 8 | m[i] >>> 24) & 16711935 | (m[i] << 24 | m[i] >>> 8) & 4278255360;
        }
        m[l >>> 5] |= 128 << l % 32;
        m[(l + 64 >>> 9 << 4) + 14] = l;
        var FF = md53._ff, GG = md53._gg, HH = md53._hh, II = md53._ii;
        for (var i = 0; i < m.length; i += 16) {
          var aa = a, bb = b, cc = c, dd = d;
          a = FF(a, b, c, d, m[i + 0], 7, -680876936);
          d = FF(d, a, b, c, m[i + 1], 12, -389564586);
          c = FF(c, d, a, b, m[i + 2], 17, 606105819);
          b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
          a = FF(a, b, c, d, m[i + 4], 7, -176418897);
          d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
          c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
          b = FF(b, c, d, a, m[i + 7], 22, -45705983);
          a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
          d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
          c = FF(c, d, a, b, m[i + 10], 17, -42063);
          b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
          a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
          d = FF(d, a, b, c, m[i + 13], 12, -40341101);
          c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
          b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
          a = GG(a, b, c, d, m[i + 1], 5, -165796510);
          d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
          c = GG(c, d, a, b, m[i + 11], 14, 643717713);
          b = GG(b, c, d, a, m[i + 0], 20, -373897302);
          a = GG(a, b, c, d, m[i + 5], 5, -701558691);
          d = GG(d, a, b, c, m[i + 10], 9, 38016083);
          c = GG(c, d, a, b, m[i + 15], 14, -660478335);
          b = GG(b, c, d, a, m[i + 4], 20, -405537848);
          a = GG(a, b, c, d, m[i + 9], 5, 568446438);
          d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
          c = GG(c, d, a, b, m[i + 3], 14, -187363961);
          b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
          a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
          d = GG(d, a, b, c, m[i + 2], 9, -51403784);
          c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
          b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
          a = HH(a, b, c, d, m[i + 5], 4, -378558);
          d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
          c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
          b = HH(b, c, d, a, m[i + 14], 23, -35309556);
          a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
          d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
          c = HH(c, d, a, b, m[i + 7], 16, -155497632);
          b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
          a = HH(a, b, c, d, m[i + 13], 4, 681279174);
          d = HH(d, a, b, c, m[i + 0], 11, -358537222);
          c = HH(c, d, a, b, m[i + 3], 16, -722521979);
          b = HH(b, c, d, a, m[i + 6], 23, 76029189);
          a = HH(a, b, c, d, m[i + 9], 4, -640364487);
          d = HH(d, a, b, c, m[i + 12], 11, -421815835);
          c = HH(c, d, a, b, m[i + 15], 16, 530742520);
          b = HH(b, c, d, a, m[i + 2], 23, -995338651);
          a = II(a, b, c, d, m[i + 0], 6, -198630844);
          d = II(d, a, b, c, m[i + 7], 10, 1126891415);
          c = II(c, d, a, b, m[i + 14], 15, -1416354905);
          b = II(b, c, d, a, m[i + 5], 21, -57434055);
          a = II(a, b, c, d, m[i + 12], 6, 1700485571);
          d = II(d, a, b, c, m[i + 3], 10, -1894986606);
          c = II(c, d, a, b, m[i + 10], 15, -1051523);
          b = II(b, c, d, a, m[i + 1], 21, -2054922799);
          a = II(a, b, c, d, m[i + 8], 6, 1873313359);
          d = II(d, a, b, c, m[i + 15], 10, -30611744);
          c = II(c, d, a, b, m[i + 6], 15, -1560198380);
          b = II(b, c, d, a, m[i + 13], 21, 1309151649);
          a = II(a, b, c, d, m[i + 4], 6, -145523070);
          d = II(d, a, b, c, m[i + 11], 10, -1120210379);
          c = II(c, d, a, b, m[i + 2], 15, 718787259);
          b = II(b, c, d, a, m[i + 9], 21, -343485551);
          a = a + aa >>> 0;
          b = b + bb >>> 0;
          c = c + cc >>> 0;
          d = d + dd >>> 0;
        }
        return crypt.endian([a, b, c, d]);
      }, "md5");
      md53._ff = function(a, b, c, d, x, s, t) {
        var n = a + (b & c | ~b & d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md53._gg = function(a, b, c, d, x, s, t) {
        var n = a + (b & d | c & ~d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md53._hh = function(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md53._ii = function(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md53._blocksize = 16;
      md53._digestsize = 16;
      module2.exports = function(message, options) {
        if (message === void 0 || message === null)
          throw new Error("Illegal argument " + message);
        var digestbytes = crypt.wordsToBytes(md53(message, options));
        return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt.bytesToHex(digestbytes);
      };
    })();
  }
});

// src/back/db/TBChats.ts
var import_client2 = require("@prisma/client");

// src/back/db/+selectors.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  //   log: ['query', 'error', 'info', 'warn'],
});
var PrismaTbSelectors = class {
  static {
    __name(this, "PrismaTbSelectors");
  }
  static tb = prisma;
  static freeMessageSelector = {
    select: {
      id: true,
      chatid: true,
      text: true,
      prevText: true,
      type: true,
      createdAt: true,
      replyMessageId: true,
      sentMemberId: true
    }
  };
  static freeChatDataSelector(takeMessagesCount, isIncludeRemovedMessages) {
    return {
      select: {
        id: true,
        chatId: true,
        title: true,
        members: {
          select: {
            id: true,
            user: {
              select: { fio: true, login: true, id: true }
            }
          }
        },
        messages: {
          ...this.freeMessageSelector,
          where: isIncludeRemovedMessages ? void 0 : { isRemoved: false },
          orderBy: { createdAt: "desc" },
          take: takeMessagesCount
        }
      }
    };
  }
};

// src/back/db/TBChats.ts
var TBChats = class extends PrismaTbSelectors {
  static {
    __name(this, "TBChats");
  }
  static async createChat(creatorLogin, title) {
    return this.tb.$transaction(async () => {
      const creatorUser = await this.tb.user.findFirst({ where: { login: creatorLogin } });
      if (creatorUser === null) return null;
      const chat = await this.tb.chat.create({ data: { title } });
      const member = await this.tb.chatMember.create({
        data: { userId: creatorUser.id, rights: [import_client2.ChatMemberRights.Creator], chatid: chat.id }
      });
      await this.tb.message.create({
        data: {
          chatid: chat.id,
          type: import_client2.MessageType.ChatCreate,
          text: title,
          sentMemberId: member.id
        }
      });
      const createdChat = await this.tb.chat.findFirst({
        where: { chatId: chat.chatId },
        ...this.freeChatDataSelector(1)
      });
      return createdChat;
    });
  }
  static async addMemberToChat(chatId, login) {
    const chat = await this.tb.chat.findFirst({ where: { chatId } });
    const user = await this.tb.user.findFirst({ where: { login } });
    if (chat === null || user === null) return null;
    await this.tb.chatMember.create({ data: { chatid: chat.id, userId: user.id, rights: ["User"] } });
    const updatedChat = await this.tb.chat.findFirst({
      where: { chatId },
      ...this.freeChatDataSelector(1)
    });
    return updatedChat;
  }
  static async getFreshDataForUser(login) {
    const chats = await this.tb.chat.findMany({
      where: { members: { some: { user: { login } } } },
      ...this.freeChatDataSelector(1)
    });
    return chats;
  }
};

// src/back/db/Users.ts
var TBUsers = class extends PrismaTbSelectors {
  static {
    __name(this, "TBUsers");
  }
  static newUser(fio, login, nick, tgId) {
    return this.tb.user.create({ data: { fio, tgId, login, nick, lastVisit: /* @__PURE__ */ new Date() } });
  }
  static async setLastVisitOrCreate(fio, login, nick, tgAva, tgId) {
    const user = await this.tb.user.findFirst({ where: { login } });
    if (user) {
      await this.tb.user.update({
        where: { id: user.id },
        data: {
          lastVisit: /* @__PURE__ */ new Date(),
          tgAva: tgAva ?? user.tgAva
        }
      });
      return;
    }
    await this.tb.user.create({ data: { fio, login, nick, tgAva, tgId, lastVisit: /* @__PURE__ */ new Date() } });
  }
  static async getAll() {
    const users = await this.tb.user.findMany({
      select: { fio: true, id: true, login: true }
    });
    return users;
  }
  static getByLogin = /* @__PURE__ */ __name((login) => this.tb.user.findFirst({ where: { login } }), "getByLogin");
};

// src/back/db/TBMessages.ts
var TBMessages = class extends PrismaTbSelectors {
  static {
    __name(this, "TBMessages");
  }
  static async getUnreachedReplyMessages(chatid, existsMessages) {
    const replyTargetIds = /* @__PURE__ */ new Set();
    const messageIdsSet = new Set(existsMessages.map((message) => message.id));
    for (const message of existsMessages) {
      if (message.replyMessageId == null || messageIdsSet.has(message.replyMessageId)) continue;
      replyTargetIds.add(message.replyMessageId);
    }
    const messages = replyTargetIds.size ? await this.tb.message.findMany({
      where: {
        chatid,
        isRemoved: false,
        id: { in: Array.from(replyTargetIds) }
      },
      ...this.freeMessageSelector,
      orderBy: { id: "desc" }
    }) : [];
    return messages;
  }
  static async combineWithRemoved(chatId, fromMessageId, isMessageStart, fetchCount = 830) {
    return this.tb.$transaction(async () => {
      const chat = await this.tb.chat.findFirst({ where: { chatId } });
      if (chat === null) throw new Error("Чат не найден");
      const existsMessages = await this.tb.message.findMany({
        where: {
          chatid: chat.id,
          isRemoved: false,
          ...isMessageStart == null ? null : { id: isMessageStart ? { gt: fromMessageId } : { lt: fromMessageId } }
        },
        ...this.freeMessageSelector,
        orderBy: { id: "desc" },
        take: fetchCount
      });
      if (existsMessages.length < 1) throw new Error("Больше сообщений нет");
      const maxMessageId = existsMessages[0].id;
      const minMessageId = existsMessages[existsMessages.length - 1].id;
      const unreachedMessages = await this.getUnreachedReplyMessages(chat.id, existsMessages);
      if (maxMessageId === minMessageId) {
        return {
          messages: existsMessages,
          unreachedMessages
        };
      }
      const removedMessages = await this.tb.message.findMany({
        where: {
          chatid: chat.id,
          isRemoved: true,
          id: {
            gt: minMessageId
            // lt: maxMessageId,
          }
        },
        select: { id: true, isRemoved: true },
        orderBy: { id: "desc" }
      });
      return {
        messages: [...existsMessages, ...removedMessages],
        unreachedMessages
      };
    });
  }
  static async pullAlternativeNearId(chatId, nearMessageId) {
    return this.tb.$transaction(async () => {
      const chat = await this.tb.chat.findFirst({ where: { chatId } });
      if (chat === null) throw new Error("Чат не найден");
      const beforeMessages = await this.tb.message.findMany({
        where: {
          chatid: chat.id,
          isRemoved: false,
          id: { lte: nearMessageId }
        },
        ...this.freeMessageSelector,
        orderBy: { id: "desc" },
        take: 15
      });
      const afterMessages = await this.tb.message.findMany({
        where: {
          chatid: chat.id,
          isRemoved: false,
          id: { gt: nearMessageId }
        },
        ...this.freeMessageSelector,
        orderBy: { id: "asc" },
        take: 30 - beforeMessages.length
      });
      const messages = [...beforeMessages, ...afterMessages];
      return {
        alternativeMessages: messages,
        unreachedMessages: await this.getUnreachedReplyMessages(chat.id, messages)
      };
    });
  }
  static async getChatMessages(chatId) {
    const messages = await this.tb.message.findMany({
      where: { chat: { chatId } },
      ...this.freeMessageSelector,
      orderBy: { id: "desc" },
      take: 100
    });
    return messages;
  }
  static async sendSimpleMessage(chatId, senderLogin, message) {
    const user = await TBUsers.getByLogin(senderLogin);
    if (user === null) throw new Error("Пользователь не найден");
    const chat = await this.tb.chat.findFirst({
      where: { chatId },
      include: { members: { select: { user: true } } }
    });
    if (chat === null) throw new Error("Чат не найден");
    const member = await this.tb.chatMember.findFirst({ where: { chatid: chat.id, userId: user.id } });
    if (member === null) throw new Error("Пользователь не может писать в этом чате");
    const sentMessage = await this.tb.message.create({
      data: {
        chatid: chat.id,
        sentMemberId: member.id,
        text: message.text,
        type: message.type,
        replyMessageId: message.replyMessageId,
        prevText: message.prevText
      },
      ...this.freeMessageSelector
    });
    return {
      chat,
      sentMessage,
      unreachedMessages: await this.getUnreachedReplyMessages(chat.id, [sentMessage])
    };
  }
  static async removeMessages(chatId, login, messageIds) {
    return await this.tb.$transaction(async () => {
      const chat = await this.tb.chat.findFirst({
        where: { chatId },
        select: { id: true }
      });
      if (chat === null) throw new Error("Чат не найден");
      const member = await this.tb.chatMember.findFirst({ where: { user: { login }, chatid: chat.id } });
      if (member === null) throw new Error("Пользователь не является участником чата");
      const where = {
        id: { in: messageIds },
        chatid: chat.id,
        sentMemberId: member.id
      };
      const updated = await this.tb.message.updateMany({ data: { isRemoved: true }, where });
      if (!updated.count) throw new Error("Ошибка удаления");
      const chatNewInfo = await this.tb.chat.findUnique({
        where: { id: chat.id },
        ...this.freeChatDataSelector(1)
      });
      return {
        chat: chatNewInfo,
        removedMessages: await this.tb.message.findMany({
          where,
          select: { id: true, isRemoved: true, chatid: true }
        })
      };
    });
  }
  static async editMessage(chatId, senderLogin, editMessageId, text, type) {
    const prevMessage = await this.tb.message.findUnique({
      where: { id: editMessageId, chat: { chatId } },
      select: {
        isRemoved: true,
        text: true,
        sentMember: { select: { user: true } }
      }
    });
    if (prevMessage === null) throw new Error("Сообщение не найдено");
    if (prevMessage.sentMember.user.login !== senderLogin) throw new Error("Изменить можно только своё сообщение");
    if (prevMessage.isRemoved) throw new Error("Сообщение удалено");
    const newMessage = await this.tb.message.update({
      where: { id: editMessageId },
      data: { text, prevText: prevMessage.text, type },
      ...this.freeMessageSelector
    });
    const chat = await this.tb.chat.findFirst({
      where: { chatId },
      ...this.freeChatDataSelector(1)
    });
    return {
      chat,
      newMessage
    };
  }
};

// src/back/soki/10-Connection.ts
var import_ws = require("ws");

// src/shared/utils/complect/Eventer.ts
var Eventer = class {
  static {
    __name(this, "Eventer");
  }
  static listen = /* @__PURE__ */ __name((listeners, cb, invokeInitValue) => {
    if (invokeInitValue !== void 0)
      cb({
        value: invokeInitValue,
        mute: /* @__PURE__ */ __name(() => {
        }, "mute"),
        preventDefault: /* @__PURE__ */ __name(() => {
        }, "preventDefault"),
        preventedDefault: false,
        stopPropagation: /* @__PURE__ */ __name(() => {
        }, "stopPropagation")
      });
    listeners.push(cb);
    return () => this.mute(listeners, cb);
  }, "listen");
  static mute = /* @__PURE__ */ __name((listeners, cb) => {
    const index = listeners.indexOf(cb);
    listeners.splice(index, 1);
  }, "mute");
  static invoke = /* @__PURE__ */ __name(async (listeners, value, onEachInvoke) => {
    let i = listeners.length - 1;
    const event = {
      value,
      mute: /* @__PURE__ */ __name(() => listeners.splice(i, 1), "mute"),
      preventDefault: /* @__PURE__ */ __name(() => event.preventedDefault = true, "preventDefault"),
      preventedDefault: false,
      stopPropagation: /* @__PURE__ */ __name((stopValue) => {
        event.stoppedValue = stopValue;
        i = -1;
      }, "stopPropagation")
    };
    for (; i > -1; i--) {
      if (onEachInvoke === void 0) await listeners[i](event);
      else onEachInvoke(listeners[i](event));
    }
    return event;
  }, "invoke");
  static listenValue = /* @__PURE__ */ __name((listeners, cb, invokeInitValue) => {
    if (invokeInitValue !== void 0) cb(invokeInitValue);
    if (Array.isArray(listeners)) listeners.push(cb);
    else listeners.add(cb);
    return () => this.muteValue(listeners, cb);
  }, "listenValue");
  static muteValue = /* @__PURE__ */ __name((listeners, cb) => {
    if (Array.isArray(listeners)) listeners.splice(listeners.indexOf(cb), 1);
    else listeners.delete(cb);
  }, "muteValue");
  static invokeValue = /* @__PURE__ */ __name((listeners, value, onEachInvoke) => {
    if (Array.isArray(listeners))
      if (onEachInvoke === void 0) {
        for (let i = listeners.length - 1; i > -1; i--) listeners[i](value);
      } else {
        for (let i = listeners.length - 1; i > -1; i--) onEachInvoke(listeners[i](value));
      }
    else listeners.forEach((cb) => cb(value));
    return value;
  }, "invokeValue");
  static createValue() {
    const listeners = /* @__PURE__ */ new Set();
    return {
      listen: /* @__PURE__ */ __name((cb) => this.listenValue(listeners, cb), "listen"),
      mute: /* @__PURE__ */ __name((cb) => this.muteValue(listeners, cb), "mute"),
      invoke: /* @__PURE__ */ __name((value) => this.invokeValue(listeners, value), "invoke")
    };
  }
};

// src/shared/utils/complect/makeRegExp.ts
var regs = {};
function makeRegExp(reg, isResetLastIndex) {
  if (regs[reg] === void 0)
    try {
      regs[reg] = new RegExp(reg.slice(1, reg.lastIndexOf("/")), reg.slice(reg.lastIndexOf("/") + 1));
    } catch (e) {
      throw Error(`Incorrect arg passed in ${makeRegExp.name}(${reg})`);
    }
  if (isResetLastIndex === true) regs[reg].lastIndex = 0;
  return regs[reg];
}
__name(makeRegExp, "makeRegExp");

// src/shared/utils/SMyLib.ts
var import_md5 = __toESM(require_md5());
var inSec = 1e3;
var inMin = inSec * 60;
var inHour = inMin * 60;
var inDay = inHour * 24;
var SMyLib = class _SMyLib {
  static {
    __name(this, "SMyLib");
  }
  howMs = {
    inSec,
    inMin,
    inHour,
    inDay
  };
  getMilliseconds(monthDays = 30, yearDays = 365) {
    const inMonth = inDay * monthDays;
    const inYear = inDay * yearDays;
    return { inSec, inMin, inHour, inDay, inMonth, inYear };
  }
  isObj(obj) {
    return obj instanceof Object && !(obj instanceof Array);
  }
  isobj(obj) {
    return typeof obj === "object" && obj != null;
  }
  isArr(obj) {
    return obj instanceof Array;
  }
  isNum(obj) {
    return typeof obj === "number" && !isNaN(obj);
  }
  isnum(obj) {
    return parseFloat(obj) == obj;
  }
  isStr(obj) {
    return typeof obj === "string";
  }
  isFunc(obj) {
    return typeof obj === "function";
  }
  isRegExp(obj) {
    return obj instanceof RegExp;
  }
  isAFunc(obj) {
    return this.isFunc(obj) && obj[Symbol.toStringTag] === "AsyncFunction";
  }
  isUnd(obj) {
    return obj === void 0;
  }
  isBool(obj) {
    return typeof obj === "boolean";
  }
  isNull(obj) {
    return obj === null;
  }
  isNil(obj) {
    return obj === null || obj === void 0;
  }
  isNaN(obj) {
    return typeof obj === "number" && isNaN(obj);
  }
  static entries(obj) {
    return obj == null ? [] : Object.entries(obj ?? {});
  }
  static keys(obj) {
    return Object.keys(obj);
  }
  func(...funcs) {
    const self = this;
    const call = /* @__PURE__ */ __name((...args) => {
      const func = funcs.find(this.isFunc);
      return func && func.apply(this, ...args);
    }, "call");
    return {
      call(...args) {
        return call(args);
      },
      invoke(func) {
        return call([].concat(self.isFunc(func) ? func() : []));
      }
    };
  }
  execIfFunc(funcScalar, ...args) {
    if (!this.isFunc(funcScalar)) return funcScalar;
    return funcScalar(...args);
  }
  static sortReverse = /* @__PURE__ */ __name((a, b) => a > b ? -1 : a < b ? 1 : 0, "sortReverse");
  static reverseSort = /* @__PURE__ */ __name((items) => items.sort(this.sortReverse), "reverseSort");
  mapFilter = /* @__PURE__ */ __name((items, cb) => {
    const result = [];
    for (let i = 0; i < items.length; i++) {
      const val = cb(items[i], i, items);
      if (val !== void 0) result.push(val);
    }
    return result;
  }, "mapFilter");
  toRandomSorted = /* @__PURE__ */ __name((arr) => {
    const items = [];
    const arrClone = [...arr];
    for (let i = 0; i < arr.length; i++) items.push(arrClone.splice(this.randomOf(0, arrClone.length - 1), 1)[0]);
    return items;
  }, "toRandomSorted");
  randomOf = /* @__PURE__ */ __name((min, max) => Math.floor(Math.random() * (max - min + 1) + min), "randomOf");
  randomIndex = /* @__PURE__ */ __name((arr, sliceEnd) => this.randomOf(0, arr.length - 1 + (sliceEnd === void 0 ? 0 : sliceEnd)), "randomIndex");
  randomItem = /* @__PURE__ */ __name((arr, sliceEnd) => arr[this.randomIndex(arr, sliceEnd)], "randomItem");
  explode(separator, string, lim) {
    const limit = lim && Math.abs(lim);
    const splitted = string.split(separator);
    if (!this.isNum(limit)) return splitted;
    return splitted.reduce((res, curr, curri) => {
      if (limit > curri) return res.concat([curr]);
      else res[res.length - 1] += separator + curr;
      return res;
    }, []);
  }
  clone(what) {
    if (what === null || what === void 0) return what;
    else if (what.constructor === Array || what.constructor === Object) {
      const newObj = this.isArr(what) ? [] : {};
      for (const whatn in what) newObj[whatn] = this.clone(what[whatn]);
      return newObj;
    }
    return what;
  }
  isEq(base, source, isIgnoreArrayItemsOrder) {
    if (base === source) return true;
    if (base == null && base == source) return true;
    if (base == null || source == null) return false;
    if (this.typeOf(base) !== this.typeOf(source)) return false;
    if (typeof base === "object") {
      if (this.isArr(base) && this.isArr(source)) {
        if (base.length !== source.length) return false;
        if (isIgnoreArrayItemsOrder) {
          for (const bVal of base) {
            let isNotFound = true;
            for (const sVal of source)
              if (this.isEq(bVal, sVal, isIgnoreArrayItemsOrder)) {
                isNotFound = false;
                break;
              }
            if (isNotFound) return false;
          }
          return true;
        } else {
          for (let basei = 0; basei < base.length; basei++) {
            if (!this.isEq(base[basei], source[basei], isIgnoreArrayItemsOrder)) return false;
          }
          return true;
        }
      }
      const bEntries = Object.entries(base).filter(([, val]) => val !== void 0);
      const sEntries = Object.entries(source).filter(([, val]) => val !== void 0);
      if (bEntries.length !== sEntries.length || bEntries.some(([bKey, bVal]) => !this.isEq(bVal, source[bKey], isIgnoreArrayItemsOrder)))
        return false;
    } else if (base !== source) return false;
    return true;
  }
  typeOf(obj) {
    return ["isStr", "isNum", "isBool", "isArr", "isNull", "isUnd", "isFunc", "isObj", "isNan"].find(
      (type) => this[type](obj)
    ) || null;
  }
  md5(content) {
    return (0, import_md5.default)(content);
  }
  overlap(...args) {
    if (args.length === 0) return null;
    const zero = args[0] ?? {};
    args.forEach(
      (arg) => arg == null ? null : this.keys(arg).forEach((arn) => arg[arn] !== void 0 && (zero[arn] = arg[arn]))
    );
    return zero;
  }
  keys(o) {
    return Object.keys(o);
  }
  values(o) {
    return Object.values(o);
  }
  declension(num, one, two, five) {
    if (num % 1) return two;
    let absNum = Math.abs(num) % 100;
    if (absNum > 10 && absNum < 20) return five ?? two;
    absNum %= 10;
    return absNum > 1 && absNum < 5 ? two : absNum === 1 ? one : five ?? two;
  }
  stringTemplaterFunctions = {
    ink: /* @__PURE__ */ __name((num, post = "", pre = "") => num == null ? null : `${pre}${num - -1}${post}`, "ink"),
    switch: /* @__PURE__ */ __name((...args) => {
      let val, found;
      const ret = args.find((arg, argi) => {
        if (!argi) {
          val = arg;
          return false;
        }
        if (found) return true;
        if (argi % 2 && arg == val) found = true;
        return false;
      });
      return ret == null ? args[args.length - 1] : ret;
    }, "switch"),
    declension: /* @__PURE__ */ __name((num, one, two, five) => this.declension(num, one, two, five), "declension"),
    isEq: /* @__PURE__ */ __name((...args) => {
      let val;
      return !args.some((arg, argi) => {
        if (argi) return !this.isEq(arg, val);
        val = arg;
        return false;
      });
    }, "isEq"),
    isGt: /* @__PURE__ */ __name((first, second) => first > second, "isGt"),
    isGte: /* @__PURE__ */ __name((first, second) => first >= second, "isGte"),
    isLt: /* @__PURE__ */ __name((first, second) => first < second, "isLt"),
    isLte: /* @__PURE__ */ __name((first, second) => first <= second, "isLte"),
    or: /* @__PURE__ */ __name((...args) => args.some((arg) => arg), "or"),
    and: /* @__PURE__ */ __name((...args) => !args.some((arg) => !arg), "and"),
    if: /* @__PURE__ */ __name((condition, ifTrue, ifFalse) => condition ? ifTrue : ifFalse, "if")
  };
  stringTemplater(str, topArgs, onUnknownArg) {
    const dob = "{{";
    const ocb = "}{";
    const dcb = "}}";
    const noObj = {};
    const norm = /* @__PURE__ */ __name((val, op) => op === "?" ? val ? val : noObj : op === "!" ? val ? noObj : val : op === "!!" ? val == null ? "" : noObj : val == null ? noObj : val, "norm");
    let lim = 1e3;
    const inline = /* @__PURE__ */ __name((parts) => {
      lim--;
      if (lim < 0) return;
      let line = [];
      const addNorm = /* @__PURE__ */ __name((val, op) => {
        const value = norm(val, op);
        line = line.concat(value == noObj || value == null ? "" : value);
      }, "addNorm");
      const getDiapason = /* @__PURE__ */ __name((diapason, district, structItems = false) => {
        let ballance = null;
        let distBallance = 0;
        let struct = [];
        const dists = [];
        const diap = (diapason[0] === dob ? diapason : []).filter((txt) => {
          if (ballance === 0) return false;
          if (structItems) {
            if ((txt === ocb || txt === dcb) && ballance === 1) {
              dists.push(inline(struct));
              struct = [];
            } else if (ballance) struct.push(txt);
          } else if (district != null) {
            if (distBallance === district) dists.push(txt);
            if (ballance === 1 && txt === ocb) distBallance++;
          }
          if (txt === dob) ballance++;
          else if (txt === dcb) ballance--;
          return true;
        });
        return {
          list: structItems || district != null ? dists : diap,
          len: diap.length,
          diap,
          dists
        };
      }, "getDiapason");
      let escLim = 0;
      parts.forEach((part, parti, parta) => {
        if (parti && parti <= escLim) return;
        const invokeFunc = /* @__PURE__ */ __name((func) => {
          const diapason = getDiapason(parta.slice(parti + 1), null, true);
          escLim += diapason.len;
          const nrm = inline(diapason.list);
          addNorm(func.apply(this, nrm));
        }, "invokeFunc");
        if (part === dob) {
        } else if (part === dcb || part === ocb) escLim++;
        else if (this.isStr(part)) {
          const match = part.match(makeRegExp("/^\\$(\\w+)(!{1,2}|\\?{1,2})?(;?)/"));
          const [, topArgName, op, semicolon] = match || [];
          if (topArgName != null) {
            let val = topArgs[topArgName];
            if (val === void 0) {
              val = this.stringTemplaterFunctions[topArgName];
              if (val === void 0 && onUnknownArg) val = onUnknownArg(topArgName);
            }
            if (semicolon) {
              if (this.isFunc(val)) invokeFunc(val);
              else {
                escLim++;
                addNorm(val, op);
              }
            } else if (parta[parti + 1] === dob) {
              if (!op && this.isFunc(val)) invokeFunc(val);
              else {
                const value = norm(val, op);
                const diapason = getDiapason(parta.slice(parti + 1), value != noObj ? 0 : 1);
                escLim += diapason.len;
                addNorm(inline(diapason.list));
              }
            } else if (this.isFunc(val)) invokeFunc(val);
            else {
              parti && escLim++;
              addNorm(val, op);
            }
          } else {
            parti && escLim++;
            addNorm(part.replace(makeRegExp("/^\\\\/"), ""), op);
          }
        } else addNorm(part);
      });
      return line;
    }, "inline");
    return inline(
      (str || "").split(makeRegExp("/(\\\\?\\$\\w+!{0,2}\\?{0,2};?|\\\\?{{|\\\\?}{|\\\\?}})/")).filter((s) => s)
    )?.join("") || "";
  }
  newInstance(val) {
    if (this.isArr(val)) return [];
    else if (this.isObj(val)) return {};
    return val;
  }
  checkIsCorrectArgs(action, realArgs, typeArgs) {
    const args = { ...realArgs };
    const ruleEntries = _SMyLib.entries(typeArgs);
    if (!ruleEntries.length) return null;
    const errors = [];
    const add = /* @__PURE__ */ __name((message) => {
      errors.push(message);
      if (message) console.error(message);
      return errors;
    }, "add");
    const argsEntries = _SMyLib.entries(args);
    if (!argsEntries.length) {
      return add("Нет необходимых аргументов для данного исполнения");
    }
    for (const [key, type] of ruleEntries) {
      if (key === "$$vars") continue;
      const argEntry = argsEntries.find(([argn]) => argn === key);
      if (!argEntry) {
        if (this.isRequiredType(type)) add(`Не указан параметр "${key}" для исполнения "${action}"`);
        continue;
      }
      const [, value] = argEntry;
      if (!this.isCorrectType(value, type))
        add(
          `Неверный тип параметра "${key}" (${value}) в исполнении "${action}". Ожидалось "${this.isArr(type) ? type.join(" | ") : type}"`
        );
    }
    return errors;
  }
  isRequiredType(typer) {
    const check = /* @__PURE__ */ __name((type) => {
      if (typeof type === "string") return type !== type.toLowerCase();
      else if (type == null) return false;
      else if (Array.isArray(type)) return !type.some((type2) => !check(type2));
      else return true;
    }, "check");
    return check(typer);
  }
  isCorrectType(value, typer) {
    if (this.isStr(typer)) {
      if (typer[0] === "#") {
        const explodes = this.explode(":", typer, 2);
        const type = explodes[0].slice(1);
        const lower = type.toLowerCase();
        if (lower === type && value == null) return true;
        let isCorrect = false;
        if (lower === "list") isCorrect = this.isArr(value);
        else if (lower === "dict") isCorrect = this.isObj(value);
        else if (lower === "object") isCorrect = this.isobj(value);
        else if (lower === "string") isCorrect = this.isStr(value);
        else if (lower === "numeric") isCorrect = this.isnum(value);
        else if (lower === "number") isCorrect = this.isNum(value);
        else if (lower === "num") isCorrect = value === 0 || value === 1;
        else if (lower === "boolean") isCorrect = this.isBool(value);
        else if (lower === "simple") isCorrect = this.isStr(value) || this.isNum(value);
        else if (lower === "primitive") isCorrect = this.isBool(value) || this.isStr(value) || this.isNum(value);
        else if (lower === "any") isCorrect = true;
        return isCorrect;
      } else return value === typer;
    } else if (this.isArr(typer)) {
      return typer.some((tup) => this.isCorrectType(value, tup));
    }
    return value === typer;
  }
  toSorted(items, compareFunction) {
    return [...items].sort(compareFunction);
  }
  sort(items, compareFunction) {
    const len = items.length - 1;
    const compare = compareFunction !== void 0 ? (j) => compareFunction(items[j], items[j + 1]) > 0 : (j) => items[j] > items[j + 1];
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i; j++) {
        if (compare(j)) {
          [items[j], items[j + 1]] = [items[j + 1], items[j]];
        }
      }
    }
    return items;
  }
};
var smylib = new SMyLib();

// src/shared/utils/complect/SMyLib.ts
var import_md52 = __toESM(require_md5());
var inSec2 = 1e3;
var inMin2 = inSec2 * 60;
var inHour2 = inMin2 * 60;
var inDay2 = inHour2 * 24;
var SMyLib2 = class _SMyLib {
  static {
    __name(this, "SMyLib");
  }
  howMs = {
    inSec: inSec2,
    inMin: inMin2,
    inHour: inHour2,
    inDay: inDay2
  };
  getMilliseconds(monthDays = 30, yearDays = 365) {
    const inMonth = inDay2 * monthDays;
    const inYear = inDay2 * yearDays;
    return { inSec: inSec2, inMin: inMin2, inHour: inHour2, inDay: inDay2, inMonth, inYear };
  }
  isObj(obj) {
    return obj instanceof Object && !(obj instanceof Array);
  }
  isobj(obj) {
    return typeof obj === "object" && obj != null;
  }
  isArr(obj) {
    return obj instanceof Array;
  }
  isNum(obj) {
    return typeof obj === "number" && !isNaN(obj);
  }
  isnum(obj) {
    return parseFloat(obj) == obj;
  }
  isStr(obj) {
    return typeof obj === "string";
  }
  isFunc(obj) {
    return typeof obj === "function";
  }
  isRegExp(obj) {
    return obj instanceof RegExp;
  }
  isAFunc(obj) {
    return this.isFunc(obj) && obj[Symbol.toStringTag] === "AsyncFunction";
  }
  isUnd(obj) {
    return obj === void 0;
  }
  isBool(obj) {
    return typeof obj === "boolean";
  }
  isNull(obj) {
    return obj === null;
  }
  isNil(obj) {
    return obj === null || obj === void 0;
  }
  isNaN(obj) {
    return typeof obj === "number" && isNaN(obj);
  }
  static entries(obj) {
    return obj == null ? [] : Object.entries(obj ?? {});
  }
  static keys(obj) {
    return Object.keys(obj);
  }
  func(...funcs) {
    const self = this;
    const call = /* @__PURE__ */ __name((...args) => {
      const func = funcs.find(this.isFunc);
      return func && func.apply(this, ...args);
    }, "call");
    return {
      call(...args) {
        return call(args);
      },
      invoke(func) {
        return call([].concat(self.isFunc(func) ? func() : []));
      }
    };
  }
  execIfFunc(funcScalar, ...args) {
    if (!this.isFunc(funcScalar)) return funcScalar;
    return funcScalar(...args);
  }
  static sortReverse = /* @__PURE__ */ __name((a, b) => a > b ? -1 : a < b ? 1 : 0, "sortReverse");
  static reverseSort = /* @__PURE__ */ __name((items) => items.sort(this.sortReverse), "reverseSort");
  mapFilter = /* @__PURE__ */ __name((items, cb) => {
    const result = [];
    for (let i = 0; i < items.length; i++) {
      const val = cb(items[i], i, items);
      if (val !== void 0) result.push(val);
    }
    return result;
  }, "mapFilter");
  toRandomSorted = /* @__PURE__ */ __name((arr) => {
    const items = [];
    const arrClone = [...arr];
    for (let i = 0; i < arr.length; i++) items.push(arrClone.splice(this.randomOf(0, arrClone.length - 1), 1)[0]);
    return items;
  }, "toRandomSorted");
  randomOf = /* @__PURE__ */ __name((min, max) => Math.floor(Math.random() * (max - min + 1) + min), "randomOf");
  randomIndex = /* @__PURE__ */ __name((arr, sliceEnd) => this.randomOf(0, arr.length - 1 + (sliceEnd === void 0 ? 0 : sliceEnd)), "randomIndex");
  randomItem = /* @__PURE__ */ __name((arr, sliceEnd) => arr[this.randomIndex(arr, sliceEnd)], "randomItem");
  explode(separator, string, lim) {
    const limit = lim && Math.abs(lim);
    const splitted = string.split(separator);
    if (!this.isNum(limit)) return splitted;
    return splitted.reduce((res, curr, curri) => {
      if (limit > curri) return res.concat([curr]);
      else res[res.length - 1] += separator + curr;
      return res;
    }, []);
  }
  clone(what) {
    if (what === null || what === void 0) return what;
    else if (what.constructor === Array || what.constructor === Object) {
      const newObj = this.isArr(what) ? [] : {};
      for (const whatn in what) newObj[whatn] = this.clone(what[whatn]);
      return newObj;
    }
    return what;
  }
  isEq(base, source, isIgnoreArrayItemsOrder) {
    if (base === source) return true;
    if (base == null && base == source) return true;
    if (base == null || source == null) return false;
    if (this.typeOf(base) !== this.typeOf(source)) return false;
    if (typeof base === "object") {
      if (this.isArr(base) && this.isArr(source)) {
        if (base.length !== source.length) return false;
        if (isIgnoreArrayItemsOrder) {
          for (const bVal of base) {
            let isNotFound = true;
            for (const sVal of source)
              if (this.isEq(bVal, sVal, isIgnoreArrayItemsOrder)) {
                isNotFound = false;
                break;
              }
            if (isNotFound) return false;
          }
          return true;
        } else {
          for (let basei = 0; basei < base.length; basei++) {
            if (!this.isEq(base[basei], source[basei], isIgnoreArrayItemsOrder)) return false;
          }
          return true;
        }
      }
      const bEntries = Object.entries(base).filter(([, val]) => val !== void 0);
      const sEntries = Object.entries(source).filter(([, val]) => val !== void 0);
      if (bEntries.length !== sEntries.length || bEntries.some(([bKey, bVal]) => !this.isEq(bVal, source[bKey], isIgnoreArrayItemsOrder)))
        return false;
    } else if (base !== source) return false;
    return true;
  }
  typeOf(obj) {
    return ["isStr", "isNum", "isBool", "isArr", "isNull", "isUnd", "isFunc", "isObj", "isNan"].find(
      (type) => this[type](obj)
    ) || null;
  }
  md5(content) {
    return (0, import_md52.default)(content);
  }
  overlap(...args) {
    if (args.length === 0) return null;
    const zero = args[0] ?? {};
    args.forEach(
      (arg) => arg == null ? null : this.keys(arg).forEach((arn) => arg[arn] !== void 0 && (zero[arn] = arg[arn]))
    );
    return zero;
  }
  keys(o) {
    return Object.keys(o);
  }
  values(o) {
    return Object.values(o);
  }
  declension(num, one, two, five) {
    if (num % 1) return two;
    let absNum = Math.abs(num) % 100;
    if (absNum > 10 && absNum < 20) return five ?? two;
    absNum %= 10;
    return absNum > 1 && absNum < 5 ? two : absNum === 1 ? one : five ?? two;
  }
  stringTemplaterFunctions = {
    ink: /* @__PURE__ */ __name((num, post = "", pre = "") => num == null ? null : `${pre}${num - -1}${post}`, "ink"),
    switch: /* @__PURE__ */ __name((...args) => {
      let val, found;
      const ret = args.find((arg, argi) => {
        if (!argi) {
          val = arg;
          return false;
        }
        if (found) return true;
        if (argi % 2 && arg == val) found = true;
        return false;
      });
      return ret == null ? args[args.length - 1] : ret;
    }, "switch"),
    declension: /* @__PURE__ */ __name((num, one, two, five) => this.declension(num, one, two, five), "declension"),
    isEq: /* @__PURE__ */ __name((...args) => {
      let val;
      return !args.some((arg, argi) => {
        if (argi) return !this.isEq(arg, val);
        val = arg;
        return false;
      });
    }, "isEq"),
    isGt: /* @__PURE__ */ __name((first, second) => first > second, "isGt"),
    isGte: /* @__PURE__ */ __name((first, second) => first >= second, "isGte"),
    isLt: /* @__PURE__ */ __name((first, second) => first < second, "isLt"),
    isLte: /* @__PURE__ */ __name((first, second) => first <= second, "isLte"),
    or: /* @__PURE__ */ __name((...args) => args.some((arg) => arg), "or"),
    and: /* @__PURE__ */ __name((...args) => !args.some((arg) => !arg), "and"),
    if: /* @__PURE__ */ __name((condition, ifTrue, ifFalse) => condition ? ifTrue : ifFalse, "if")
  };
  stringTemplater(str, topArgs, onUnknownArg) {
    const dob = "{{";
    const ocb = "}{";
    const dcb = "}}";
    const noObj = {};
    const norm = /* @__PURE__ */ __name((val, op) => op === "?" ? val ? val : noObj : op === "!" ? val ? noObj : val : op === "!!" ? val == null ? "" : noObj : val == null ? noObj : val, "norm");
    let lim = 1e3;
    const inline = /* @__PURE__ */ __name((parts) => {
      lim--;
      if (lim < 0) return;
      let line = [];
      const addNorm = /* @__PURE__ */ __name((val, op) => {
        const value = norm(val, op);
        line = line.concat(value == noObj || value == null ? "" : value);
      }, "addNorm");
      const getDiapason = /* @__PURE__ */ __name((diapason, district, structItems = false) => {
        let ballance = null;
        let distBallance = 0;
        let struct = [];
        const dists = [];
        const diap = (diapason[0] === dob ? diapason : []).filter((txt) => {
          if (ballance === 0) return false;
          if (structItems) {
            if ((txt === ocb || txt === dcb) && ballance === 1) {
              dists.push(inline(struct));
              struct = [];
            } else if (ballance) struct.push(txt);
          } else if (district != null) {
            if (distBallance === district) dists.push(txt);
            if (ballance === 1 && txt === ocb) distBallance++;
          }
          if (txt === dob) ballance++;
          else if (txt === dcb) ballance--;
          return true;
        });
        return {
          list: structItems || district != null ? dists : diap,
          len: diap.length,
          diap,
          dists
        };
      }, "getDiapason");
      let escLim = 0;
      parts.forEach((part, parti, parta) => {
        if (parti && parti <= escLim) return;
        const invokeFunc = /* @__PURE__ */ __name((func) => {
          const diapason = getDiapason(parta.slice(parti + 1), null, true);
          escLim += diapason.len;
          const nrm = inline(diapason.list);
          addNorm(func.apply(this, nrm));
        }, "invokeFunc");
        if (part === dob) {
        } else if (part === dcb || part === ocb) escLim++;
        else if (this.isStr(part)) {
          const match = part.match(makeRegExp("/^\\$(\\w+)(!{1,2}|\\?{1,2})?(;?)/"));
          const [, topArgName, op, semicolon] = match || [];
          if (topArgName != null) {
            let val = topArgs[topArgName];
            if (val === void 0) {
              val = this.stringTemplaterFunctions[topArgName];
              if (val === void 0 && onUnknownArg) val = onUnknownArg(topArgName);
            }
            if (semicolon) {
              if (this.isFunc(val)) invokeFunc(val);
              else {
                escLim++;
                addNorm(val, op);
              }
            } else if (parta[parti + 1] === dob) {
              if (!op && this.isFunc(val)) invokeFunc(val);
              else {
                const value = norm(val, op);
                const diapason = getDiapason(parta.slice(parti + 1), value != noObj ? 0 : 1);
                escLim += diapason.len;
                addNorm(inline(diapason.list));
              }
            } else if (this.isFunc(val)) invokeFunc(val);
            else {
              parti && escLim++;
              addNorm(val, op);
            }
          } else {
            parti && escLim++;
            addNorm(part.replace(makeRegExp("/^\\\\/"), ""), op);
          }
        } else addNorm(part);
      });
      return line;
    }, "inline");
    return inline(
      (str || "").split(makeRegExp("/(\\\\?\\$\\w+!{0,2}\\?{0,2};?|\\\\?{{|\\\\?}{|\\\\?}})/")).filter((s) => s)
    )?.join("") || "";
  }
  newInstance(val) {
    if (this.isArr(val)) return [];
    else if (this.isObj(val)) return {};
    return val;
  }
  checkIsCorrectArgs(action, realArgs, typeArgs) {
    const args = { ...realArgs };
    const ruleEntries = _SMyLib.entries(typeArgs);
    if (!ruleEntries.length) return null;
    const errors = [];
    const add = /* @__PURE__ */ __name((message) => {
      errors.push(message);
      if (message) console.error(message);
      return errors;
    }, "add");
    const argsEntries = _SMyLib.entries(args);
    if (!argsEntries.length) {
      return add("Нет необходимых аргументов для данного исполнения");
    }
    for (const [key, type] of ruleEntries) {
      if (key === "$$vars") continue;
      const argEntry = argsEntries.find(([argn]) => argn === key);
      if (!argEntry) {
        if (this.isRequiredType(type)) add(`Не указан параметр "${key}" для исполнения "${action}"`);
        continue;
      }
      const [, value] = argEntry;
      if (!this.isCorrectType(value, type))
        add(
          `Неверный тип параметра "${key}" (${value}) в исполнении "${action}". Ожидалось "${this.isArr(type) ? type.join(" | ") : type}"`
        );
    }
    return errors;
  }
  isRequiredType(typer) {
    const check = /* @__PURE__ */ __name((type) => {
      if (typeof type === "string") return type !== type.toLowerCase();
      else if (type == null) return false;
      else if (Array.isArray(type)) return !type.some((type2) => !check(type2));
      else return true;
    }, "check");
    return check(typer);
  }
  isCorrectType(value, typer) {
    if (this.isStr(typer)) {
      if (typer[0] === "#") {
        const explodes = this.explode(":", typer, 2);
        const type = explodes[0].slice(1);
        const lower = type.toLowerCase();
        if (lower === type && value == null) return true;
        let isCorrect = false;
        if (lower === "list") isCorrect = this.isArr(value);
        else if (lower === "dict") isCorrect = this.isObj(value);
        else if (lower === "object") isCorrect = this.isobj(value);
        else if (lower === "string") isCorrect = this.isStr(value);
        else if (lower === "numeric") isCorrect = this.isnum(value);
        else if (lower === "number") isCorrect = this.isNum(value);
        else if (lower === "num") isCorrect = value === 0 || value === 1;
        else if (lower === "boolean") isCorrect = this.isBool(value);
        else if (lower === "simple") isCorrect = this.isStr(value) || this.isNum(value);
        else if (lower === "primitive") isCorrect = this.isBool(value) || this.isStr(value) || this.isNum(value);
        else if (lower === "any") isCorrect = true;
        return isCorrect;
      } else return value === typer;
    } else if (this.isArr(typer)) {
      return typer.some((tup) => this.isCorrectType(value, tup));
    }
    return value === typer;
  }
  toSorted(items, compareFunction) {
    return [...items].sort(compareFunction);
  }
  sort(items, compareFunction) {
    const len = items.length - 1;
    const compare = compareFunction !== void 0 ? (j) => compareFunction(items[j], items[j + 1]) > 0 : (j) => items[j] > items[j + 1];
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i; j++) {
        if (compare(j)) {
          [items[j], items[j + 1]] = [items[j + 1], items[j]];
        }
      }
    }
    return items;
  }
};
var smylib2 = new SMyLib2();

// src/back/soki/10-Connection.ts
var SokiServerConnection = class {
  static {
    __name(this, "SokiServerConnection");
  }
  ws = new import_ws.WebSocketServer({ port: 3359 });
  onEventValueSend = Eventer.createValue();
  clientDisconnectListeners = Eventer.createValue();
  onClientConnectEventer = Eventer.createValue();
  capsulesByLogin = /* @__PURE__ */ new Map();
  capsules = /* @__PURE__ */ new Map();
  onCapsuleSetValue = Eventer.createValue();
  actionWithCapsule(client, cb, triesCount = 10) {
    const tryAction = /* @__PURE__ */ __name((triesCount2) => {
      const capsule = this.capsules.get(client);
      if (capsule !== void 0) return cb(capsule);
      if (triesCount2 > 0) setTimeout(tryAction, 10, triesCount2 - 1);
    }, "tryAction");
    tryAction(triesCount);
  }
  get clients() {
    return this.ws.clients;
  }
  onClientEvent = this.onEventValueSend.listen;
  onClientDisconnect = this.clientDisconnectListeners.listen;
  onClientConnect = this.onClientConnectEventer.listen;
  start() {
    this.ws.on("connection", (client) => {
      this.onClientConnectEventer.invoke(client);
      client.on("close", () => this.clientDisconnectListeners.invoke(client));
      let setCapsule = /* @__PURE__ */ __name((auth) => {
        setCapsule = /* @__PURE__ */ __name(() => {
        }, "setCapsule");
        const capsule = { auth, client };
        this.capsules.set(client, capsule);
        const capsules = this.capsulesByLogin.get(auth.login);
        if (capsules === void 0) this.capsulesByLogin.set(auth.login, /* @__PURE__ */ new Set([capsule]));
        else capsules.add(capsule);
        this.onCapsuleSetValue.invoke(capsule);
      }, "setCapsule");
      client.on("message", (messageJson) => {
        const event = JSON.parse("" + messageJson);
        this.onEventValueSend.invoke({ event, client });
        setCapsule(event.auth);
      });
    });
  }
  send(event, client) {
    client.send(JSON.stringify(event, (_key, value) => typeof value === "bigint" ? Number(value) : value));
  }
};

// src/back/soki/20-Chats.ts
var SokiServerChats = class extends SokiServerConnection {
  static {
    __name(this, "SokiServerChats");
  }
  constructor() {
    super();
    this.onClientConnect((client) => {
    });
    this.onCapsuleSetValue.listen((capsule) => {
      (async () => {
        if (capsule.auth?.login == null) return;
        const chats = await TBChats.getFreshDataForUser(capsule.auth.login);
        this.send({ chatsData: { chats } }, capsule.client);
      })();
    });
    this.onClientEvent(({ event, client }) => {
      this.doOnOtherEvents(event, client);
    });
  }
  async doOnChatsFetchData(event, client) {
    if (event.fetchChats === void 0) throw new Error();
    this.send({ chatsData: { users: await TBUsers.getAll() } }, client);
  }
  sendChatsDataToMembers = /* @__PURE__ */ __name((members, chatsData, requestId, client) => {
    this.send({ chatsData, requestId }, client);
    const messageData = { chatsData };
    const sendDataForEach = /* @__PURE__ */ __name((capsule) => {
      if (capsule.client === client) return;
      this.send(messageData, capsule.client);
    }, "sendDataForEach");
    members.forEach((member) => {
      const capsules = this.capsulesByLogin.get(member.user.login);
      capsules?.forEach(sendDataForEach);
    });
  }, "sendChatsDataToMembers");
  async doOnChatFetchData(event, client) {
    if (event.chatFetch === void 0) throw new Error();
    const eventFetch = event.chatFetch;
    const chatId = eventFetch.chatId;
    if (eventFetch.newMember != null) {
      const { userLogin } = eventFetch.newMember;
      const chat = await TBChats.addMemberToChat(chatId, userLogin);
      if (chat === null) return;
      this.sendChatsDataToMembers(chat.members, { chats: [chat] }, event.requestId, client);
    }
    if (eventFetch.pullMessages != null) {
      console.log(eventFetch);
      const { messages, unreachedMessages } = eventFetch.pullMessages === true ? await TBMessages.combineWithRemoved(chatId) : await TBMessages.combineWithRemoved(
        chatId,
        eventFetch.pullMessages.messageId,
        eventFetch.pullMessages.isMessageStart,
        eventFetch.pullMessages.fetchCount
      );
      if (messages === null) return;
      this.send(
        {
          chatsData: {
            messages,
            unreachedMessages
          }
        },
        client
      );
    }
    if (eventFetch.pullAlternativeMessagesNearId) {
      const { alternativeMessages, unreachedMessages } = await TBMessages.pullAlternativeNearId(
        chatId,
        eventFetch.pullAlternativeMessagesNearId
      );
      this.send(
        {
          chatsData: {
            alternativeMessages,
            unreachedMessages
          }
        },
        client
      );
    }
    if (eventFetch.removeMessages != null) {
      const messagesForRemove = eventFetch.removeMessages;
      this.actionWithCapsule(client, async (capsule) => {
        if (capsule.auth?.login) {
          const { removedMessages, chat } = await TBMessages.removeMessages(
            chatId,
            capsule.auth.login,
            messagesForRemove
          );
          this.sendChatsDataToMembers(
            chat.members,
            { messages: removedMessages, chats: [chat] },
            event.requestId,
            capsule.client
          );
        }
      });
    }
  }
  async doOnChatFetchMessageData(event, client) {
    if (event.chatFetch?.message === void 0) throw new Error();
    const chatMessage = event.chatFetch.message;
    const chatId = event.chatFetch.chatId;
    this.actionWithCapsule(client, async (capsule) => {
      if (capsule.auth?.login == null) return;
      const senderLogin = capsule.auth.login;
      if (chatMessage.type === "ChatCreate") {
        const chat = await TBChats.createChat(senderLogin, chatMessage.text);
        if (chat?.members != null) {
          this.sendChatsDataToMembers(chat.members, { chats: [chat] }, event.requestId, client);
        }
        return;
      }
      if (chatMessage.editMessageId) {
        const { chat, newMessage } = await TBMessages.editMessage(
          chatId,
          senderLogin,
          chatMessage.editMessageId,
          chatMessage.text,
          chatMessage.type
        );
        if (chat?.members != null && newMessage != null) {
          this.sendChatsDataToMembers(chat.members, { chats: [chat], messages: [newMessage] }, event.requestId, client);
        }
        return;
      }
      try {
        const { chat, sentMessage, unreachedMessages } = await TBMessages.sendSimpleMessage(
          chatId,
          senderLogin,
          chatMessage
        );
        this.sendChatsDataToMembers(
          chat.members,
          {
            messages: [sentMessage],
            unreachedMessages
          },
          event.requestId,
          client
        );
      } catch (error) {
        console.error(error);
      }
    });
  }
  async doOnOtherEvents(event, client) {
    try {
      await this.doOnChatFetchMessageData(event, client);
      return false;
    } catch (e) {
    }
    try {
      await this.doOnChatsFetchData(event, client);
      return false;
    } catch (e) {
    }
    try {
      await this.doOnChatFetchData(event, client);
      return false;
    } catch (e) {
    }
    return false;
  }
};

// src/back/soki/SokiServer.ts
var SokiServer = class extends SokiServerChats {
  static {
    __name(this, "SokiServer");
  }
};

// src/back/back.index.ts
new SokiServer().start();
/*! Bundled license information:

is-buffer/index.js:
  (*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
