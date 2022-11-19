import { ChatInputCommandInteraction, Message, type PermissionsString } from 'discord.js';
import { readdirSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { ManagerBot } from './client';

export function findCommand(dir: string, pattern: string) {
    let results: string[] = [];
    readdirSync(dir).forEach(innerPath => {
        innerPath = resolve(dir, innerPath);
        const stat = statSync(innerPath);

        if (stat.isDirectory()) results = results.concat(findCommand(innerPath, pattern));
        else if (stat.isFile() && innerPath.endsWith(pattern)) results.push(innerPath);
    });

    return results;
}

export function setup(client: ManagerBot) {
    // set commands
    const cmdFiles = findCommand("./dist/commands", '.js');
    if (cmdFiles.length <= 0) console.log("There are no commands to load ..");
    else {
        cmdFiles.forEach(file => {
            const command: Command | CommandMessages = require(file).default

            command.category = file.split(sep).at(-2)! as Category;

            // check if command is slash or prefix and register them in their collections
            if (command.type === 'slash') {
                client.commands.set(command.name, command);   
            } else {
                client.messages.set(command.name, command as CommandMessages);
            }
        })
        console.log(`Loaded ${cmdFiles.length} commands.`);
    }

    // setup events
    const events = readdirSync("./dist/events").filter(event => event.endsWith(".js"));
    if (events.length <= 0) return console.log("There are no events to load ..");
    events.forEach(file => require(`../events/${file}`));
    console.log(`Loaded ${events.length} events.`);
}

export interface Command {
    name: string;
    type: "slash";
    permissions?: PermissionsString;
    devs?: boolean;
    category?: Category;
    cooldown?: number;
    run(interaction: ChatInputCommandInteraction): Promise<void>
}

export interface CommandMessages {
    name: string;
    type: "prefix"
    devs?: true;
    category?: Category;
    cooldown?: number;
    run(message: Message, args: string[]): any
}

export type Category = "Admin" | "Staff" | "General" | "Info";