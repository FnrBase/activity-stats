import process from "node:process";

// setup dotenv and define client
if (!process.env.MONGO_URI) require('dotenv').config();
import { IntentsBitField, Options, Partials, ActivityType } from "discord.js";
import { setup } from "./lib/imports";
import { ManagerBot } from './lib/client';

export const client = new ManagerBot({
    partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
    makeCache: Options.cacheWithLimits({
        GuildStickerManager: 0
    }),
    allowedMentions: { parse: ['roles', 'users'] },
    presence: {
        status: process.env.NODE_ENV === 'production' ? "online" : "dnd",
        activities: [{ name: "What member's playing", type: ActivityType.Watching }]
    }
});

setup(client);
client.login(process.env.TOKEN);