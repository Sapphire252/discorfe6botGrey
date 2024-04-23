const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require('axios');

function randomPicUrl(response, usedIndices) {
  let randomIndex = Math.floor(Math.random() * response.data.posts.length);
  let post;

  if (usedIndices.includes(randomIndex)) {
    return randomPicUrl(response, usedIndices);
  } else {
    post = response.data.posts[randomIndex];
    usedIndices.push(randomIndex);
    return post.file.url;
  }
}

function containsBlacklistedTags(tags, blacklist) {
  for (const tag of tags) {
    let checkTagElem = tag.split(' ');
    for (const e of checkTagElem) {
      if (blacklist.includes(e.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('e621')
    .setDescription('Get a random image from e621 with the given tags')
    .addStringOption(option =>
      option
        .setName('tags')
        .setDescription('Tags to search for')
        .setRequired(true))
    .addIntegerOption(option =>
      option
        .setName('limit')
        .setDescription('Number of images to send')
        .setRequired(false)),
  
  async execute(interaction) {
    const limit = interaction.options.getInteger('limit');
    const tags = interaction.options.getString('tags').split(',');
    const blacklist = ['death', 'gore', 'tentacles', 'fart', 'scat', 'animated', 'type:mp4', 'type:webm'];
    const e621ApiUrl = "https://e621.net/posts.json?tags=order:random " + tags;

    console.log(`Constructed URL: ${e621ApiUrl}`); // Log the constructed UR
    
    try {
      if (!interaction.channel.nsfw) {
        await interaction.reply({ content: "This command can only be used in NSFW channels." });
        return;
      }

      if (containsBlacklistedTags(tags, blacklist)) {
        await interaction.reply({ content: "Content contains blacklisted tags." });
        return;
      }

      const response = await axios.get(e621ApiUrl, {
        headers: { "User-Agent": "Discord Bot (SapphireTheShark on 621)" }
      });

      console.log(response.data.posts.length);

      await interaction.reply({ content: "Success. Here you go:" });

      const usedIndices = [];
      let i = 0;
      const sentImageUrls = []; // Array to capture sent image URLs

      if (limit && limit > response.data.posts.length) {
        await interaction.channel.send("Sorry, there are not enough images to satisfy your request.");
        return;
      }

      while (i < limit || i == 0) {
        const imageUrl = randomPicUrl(response, usedIndices);

        if (imageUrl === null) {
          continue;
        }

        await interaction.channel.send({ files: [imageUrl] });

        sentImageUrls.push(imageUrl); // Capture the sent image URL

        i++;
      }

      // Log the captured image URLs
      console.log("Sent image URLs:");
      for (const url of sentImageUrls) {
        console.log(url);
      }

    } catch (e) {
      await interaction.channel.send("Something went wrong. Sorry");
      console.log(e);
    }
  },
};
