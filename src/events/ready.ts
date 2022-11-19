import { client } from "..";

client.on('ready', () => {
    console.log(`Logged in ${client.user.tag}`);
})