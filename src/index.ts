import { aiClient, aicache } from "./bot.js";
import { messageStore } from "./api.js";
import { ChatService } from "@voscarmv/aichatbot";
import { Bot, InputFile } from "grammy";
import axios from 'axios';
import "dotenv/config";

const chat = new ChatService({
    aiClient,
    messageStore
});
if (!process.env.TELEGRAM_KEY) {
    throw new Error("TELEGRAM_KEY is not defined");
}
const bot = new Bot(process.env.TELEGRAM_KEY);

bot.on("message", async (ctx) => {
    const user_id = ctx.message.from.id.toString();
    console.log(ctx.message);
    let content;
    if(ctx.message.text){
        content = ctx.message.text
    } else if(ctx.message.caption){
        content = ctx.message.caption;
    }
    if (!content) { throw new Error('content undefined'); }
    if (ctx.message.photo) {
        const file = await ctx.getFile();
        if (!file.file_path) { throw new Error('file_path undefined'); }
        console.log(file);
        const response = await axios.get(
            `https://api.telegram.org/file/bot${process.env.TELEGRAM_KEY}/${file.file_path}`,
            { responseType: 'arraybuffer' }
        );
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const cachekey = aicache.set(base64);
        content = `${content} --- Photo loaded to Cache Key ${cachekey}`;
    }
    console.log(new Date(), "from:", user_id, content);
    const replyFn = (content: string) => {
        if (content.length === 0) return;
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