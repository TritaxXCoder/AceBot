const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')

module.exports = class AboutCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'about',
      group: 'util',
      memberName: 'about',
      description: 'Displays information about the bot.',
      aliases: ['info'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      },
      guarded: true
    })
  }

  async run (message) {
    var clientInvite = await this.client.generateInvite()
    var totalGuilds; var totalChannels; var totalUsers; var isSharded
    if (!this.client.shard) {
      totalGuilds = await this.client.guilds.size
      totalChannels = await this.client.channels.size
      totalUsers = await this.client.users.size
      isSharded = 'Master'
    } else {
      var totalGuildsData = await this.client.shard.fetchClientValues('guilds.size')
      totalGuilds = await totalGuildsData.reduce((prev, val) => prev + val, 0)
      var totalChannelsData = await this.client.shard.fetchClientValues('channels.size')
      totalChannels = await totalChannelsData.reduce((prev, val) => prev + val, 0)
      var totalUsersData = await this.client.shard.fetchClientValues('users.size')
      totalUsers = await totalUsersData.reduce((prev, val) => prev + val, 0)
      isSharded = this.client.shard.count
    }
    message.say({
      content: '',
      embed: {
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        fields: [
          { 'name': 'Developer', 'value': 'Aceheliflyer#0950', 'inline': true },
          { 'name': 'Version', 'value': require('../../package.json').version, 'inline': true },
          { 'name': 'Library', 'value': `discord.js v${require('discord.js/package.json').version}`, 'inline': true },
          { 'name': 'Guilds', 'value': totalGuilds, 'inline': true },
          { 'name': 'Channels', 'value': totalChannels, 'inline': true },
          { 'name': 'Users', 'value': totalUsers, 'inline': true },
          { 'name': 'Shards', 'value': isSharded, 'inline': true },
          { 'name': 'Bot Invite', 'value': `[Click here!](${clientInvite})`, 'inline': true },
          { 'name': 'Server Invite', 'value': `[Click here!](${this.client.config.startConfig.invite})`, 'inline': true },
          { 'name': 'GitHub', 'value': `[Click here!](${require('../../package.json').homepage})`, 'inline': true },
          {
            'name': 'Contributors',
            'value': stripIndents`
              **⟨[33,97,29,7,6]|[3,1,4,7,9]⟩#0725 -** Helped a lot with issues I had.
              **Michael | ASIANBOI#9310 -** Gave me the code to work on the update command.
              **Ariathe#4163 -** Gave me the avatar for AceBot.
            `,
            'inline': false
          }
        ],
        color: 0x7289DA
      }
    })
  }
}
