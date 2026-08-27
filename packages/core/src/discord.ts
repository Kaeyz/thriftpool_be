import type { TextChannel } from "discord.js";
import { Client, GatewayIntentBits, Events, ChannelType } from "discord.js";

const channels = {
  serverLogs: "server-logs",
};

type ChannelKey = keyof typeof channels;

type MessageData = {
  type: string;
  env: string;
  subject: string;
  data: object;
};

export type DiscordConfig = {
  key: string;
  guildName: string;
  serverName: string;
}

export class DiscordService {

  private key: string;
  private guildName: string;
  private servername: string;
  private bot = new Client({ intents: [GatewayIntentBits.Guilds] });
  private botIsReady = false;
  
  constructor(config: DiscordConfig) {
    this.key = config.key;
    this.guildName = config.guildName;
    this.servername = config.serverName;
  }

  private loginBot() {
    void this.bot.login(this.key);
  }

  setupDiscordBot() {
    void this.loginBot();

    return new Promise<void>((resolve, reject) => {
      this.bot.once(Events.ClientReady, (client) => {
        // eslint-disable-next-line no-console
        console.log(`✅ Discord is ready! Logged in as ${client.user?.tag}`);
        this.botIsReady = true;
        return resolve();
      });

      // Errors
      this.bot.on("error", (err) => {
        // eslint-disable-next-line no-console
        console.error("❌ Discord client error:", err);
        this.botIsReady = false;
        return reject("❌ Discord client error:");
      });
    });
  }

  private getTargetGuild() {
    const guild = this.bot.guilds.cache.find((g) => g.name.toLowerCase() === this.guildName.toLowerCase());
    if (!guild) throw new Error("❌ Discord server not found");
    return guild;
  }

  private generateMessage(data: MessageData) {
    return (
      "📧 **Mail**\n" +
      `**Server:** ${this.servername}\n` +
      `**Env:** ${data.env}\n` +
      `**Type:** ${data.type}\n` +
      `**Subject:** ${data.subject}\n` +
      `**Data:**\n\`\`\`json\n${JSON.stringify(data.data, null, 2)}\n\`\`\``
    );
  }

  async sendMessage(channelKey: ChannelKey, data: MessageData) {
    if (!this.botIsReady) await this.loginBot();
    const guild = this.getTargetGuild();
    const channel = guild.channels.cache.find(
      (c): c is TextChannel => c.type === ChannelType.GuildText && c.name === channels[channelKey]
    );
    void (channel && channel.send(this.generateMessage(data)));
  }
}
