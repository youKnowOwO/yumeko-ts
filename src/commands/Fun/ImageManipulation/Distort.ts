import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("distort", {
    aliases: ["distort"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_DISTORT_DESCRIPTION"),
        usage: "distort [user|image] [--level=<number>]",
        examples: ["distort"]
    },
    category: "fun",
    permissions: {
        client: ["ATTACH_FILES"]
    },
    args: [
        {
            identifier: "level",
            match: "flag",
            type: "number",
            flag: "level",
            default: 10
        },
        {
            identifier: "image",
            match: "rest",
            type: "image",
            default: (msg: Message): string => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { image, level } : { image: string; level: number }): Promise<Message> {
        const m = await msg.channel.send(msg.ctx.lang("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/distort")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image, level } as any);
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "distort.png"}]});
    }
}