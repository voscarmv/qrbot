import { aiClient, aicache } from "./bot.js";
import { messageStore } from "./api.js";
import { ChatService } from "@voscarmv/aichatbot";
import { Bot, InputFile } from "grammy";
import "dotenv/config";

const chat = new ChatService({
    aiClient,
    messageStore
});
if (!process.env.TELEGRAM_KEY) {
    throw new Error("TELEGRAM_KEY is not defined");
}
const bot = new Bot(process.env.TELEGRAM_KEY);

bot.on("message:text", async (ctx) => {
    const user_id = ctx.message.from.id.toString();
    const content = ctx.message.text;
    console.log(new Date(), "from:", user_id, content);
    const replyFn = (content: string) => {
        if(content.length === 0) return;
        console.log(new Date(), "to:", user_id, content);
        ctx.reply(content);
    }
    const send = async (file: Buffer) => await ctx.replyWithDocument(new InputFile(file));
    chat.processMessages({
        user_id, content, replyFn,
        additionalToolsArgs: { aicache, send },
    });
});

bot.start();