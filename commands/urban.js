const { SlashCommandBuilder } = require('discord.js');
const urban = require('urban');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('urban')
    .setDescription('Search for a term on Urban Dictionary')
    .addStringOption(option =>
      option.setName('term')
        .setDescription('The term to search for')
        .setRequired(true)),

  async execute(interaction) {
    const term = interaction.options.getString('term');

    // Search for the term on Urban Dictionary and get a random definition
    const definition = await getRandomUrbanDefinition(term);

    if (definition) {
      await interaction.reply(`**${term}:** ${definition}`);
    } else {
      await interaction.reply(`No definition found for "${term}".`);
    }
  },
};

async function getRandomUrbanDefinition(term) {
  return new Promise((resolve, reject) => {
    const searchResult = urban(term);

    searchResult.first((json) => {
      if (json) {
        resolve(json.definition);
      } else {
        resolve(null);
      }
    });
  });
}
