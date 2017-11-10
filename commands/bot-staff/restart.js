const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const moment = require('moment')
require('moment-duration-format')

module.exports = class RestartCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'restart',
      group: 'bot-staff',
      memberName: 'restart',
      description: 'Restarts the bot.',
      details: 'Only the bot owner(s) may use this command.',
      clientPermissions: ['EMBED_LINKS'],
      guarded: true
    })
  }
  hasPermission (message) {
    return this.client.isOwner(message.author)
  }
  async run (message) {
    await message.say({
      content: '',
      embed: {
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: this.client.shard ? `Restart requested, please wait. | Shard ID: ${this.client.shard.id}/${this.client.shard.count - 1}` : 'Restart requested, please wait.',
        description: (stripIndents`
          **Uptime:** ${moment.duration(this.client.uptime).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]')}
          **Since**: ${moment().subtract(this.client.uptime, 'ms').format('L LTS')} ${new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1]}
        `),
        color: 0x7289DA
      }
    })
    await this.client.log.info(this.client.shard ? `Restarting! | Shard ID: ${this.client.shard.id}` : 'Restarting!', 'Restart')
    await this.client.destroy()
    await process.exit()
  }
}
