const { SlashCommandBuilder } = require("@discordjs/builders");
const https = require('https'); // Change to the 'https' module

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pingwebsite')
    .setDescription('Ping the bot\'s website for server info, speed, and status'),

  async execute(interaction) {
    const websiteUrl = 'https://discorde6bot.sapphireshork.repl.co/';

    const pingWebsite = () => {
      return new Promise((resolve, reject) => {
        https.get(websiteUrl, (websiteResponse) => {
          let data = '';
          const startTime = Date.now();

          websiteResponse.on('data', (chunk) => {
            data += chunk;
          });

          websiteResponse.on('end', () => {
            const endTime = Date.now();
            const timeTaken = endTime - startTime;

            const pingInfo = {
              status: websiteResponse.statusCode,
              speed: data.length / (timeTaken / 1000), // Speed in bytes per second
              rtt: timeTaken, // Round-trip time in milliseconds
              // You may add more details here based on your needs
            };

            resolve(pingInfo);
          });
        }).on('error', (error) => {
          reject(error);
        });
      });
    };

    try {
      const pingResult = await pingWebsite();

      let responseMessage = 'Website Ping Information:\n';
      responseMessage += `Status: ${pingResult.status}\n`;
      responseMessage += `Speed: ${pingResult.speed.toFixed(2)} B/s\n`;
      responseMessage += `Round-Trip Time (RTT): ${pingResult.rtt}ms\n`;
      // Add more information if needed

      await interaction.reply({ content: responseMessage });
    } catch (error) {
      console.error('Error pinging the website:', error);
      await interaction.reply({ content: 'Error pinging the website. Please try again later.' });
    }
  },
};
