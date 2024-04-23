const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!'),
	async execute(interaction) {
		const pingStart = Date.now();
		const reply = await interaction.reply({ content: 'Yes master?' });
		const pingEnd = Date.now();
		const latency = pingEnd - pingStart;

		const apiLatency = interaction.client.ws.ping;

		await reply.edit(`Latency: ${latency}ms\nAPI Latency: ${apiLatency}ms`);
	}
}
