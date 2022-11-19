import { Command } from "../../lib/imports";

export default {
    name: "ping",
    type: "slash",
    async run(interaction) {
        if (!interaction.inCachedGuild()) return;

        interaction.reply('Pong.');
    }
} as Command;