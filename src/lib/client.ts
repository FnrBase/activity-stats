import { Client, type ClientEvents, Collection, type Snowflake } from "discord.js";
import { Command, CommandMessages } from "./imports";

export const cancelledEvents: EventData<keyof ClientEvents>[] = [];

export interface EventData<T extends keyof ClientEvents> {
    listener: T,
    args: ClientEvents[T]
}

export class ManagerBot extends Client<true> {
    commands = new Collection<string, Command>();
    messages = new Collection<string, CommandMessages>();
    cooldowns = new Collection<string, Collection<Snowflake, number>>();
}