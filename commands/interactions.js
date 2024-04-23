    const { SlashCommandBuilder } = require("@discordjs/builders");
    const fs = require("fs");
    const path = require("path");

    module.exports = {
      data: new SlashCommandBuilder()
        .setName("interact")
        .setDescription("Perform an interaction with a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to interact with")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("interact")
            .setDescription("The interaction to perform")
            .setRequired(true)
            .addChoices(
              { name: "Kiss", value: "kiss" },
              { name: "Hug", value: "hug" },
              { name: "Slap", value: "slap" },
              { name: "Spank", value: "spank" },
              { name: "Bang", value: "bang" },
              // Add 10 more interactions
              { name: "Cuddle", value: "cuddle" },
              { name: "Tickle", value: "tickle" },
              { name: "suck", value: "suck" },
            )
        ),
      async execute(interaction) {
        const user = interaction.options.getUser("user");
        const author = interaction.user;
        const selectedInteraction = interaction.options.getString("interact");

        let output;

        if (user.id === author.id) {
          const selfInteractOutputs = {
            kiss: [
              "You pucker up and try to kiss yourself... not sure how that works.",
              "You give a kiss to the air?",
              "You blow a kiss to the mirror.",
            ],
            hug: [
              "You try to hug yourself... it's a bit awkward.",
              "You wrap your arms around yourself and give a gentle squeeze.",
              "You give yourself a warm hug.",
            ],
            slap: [
              "You raise your hand to slap yourself...",
              "You playfully slap yourself and giggle. Too much energy?",
              "You pretend to give yourself a friendly slap on the wrist.",
            ],
            spank: [
              "You give yourself a playful spank.",
              "You pat yourself on the backside.",
              "You playfully spank yourself and give a wink. Someone's feeling sassy!",
              "You spank your own butt and leave a low moan.",
            ],
            bang: [
              "You decide to have a private moment with yourself.",
              "You go somewhere more private and masturbate.",
              "You engage in a heated session of playing with yourself.",
            ],
            cuddle: [
              "You give yourself a warm cuddle.",
              "You wrap your arms around yourself tightly.",
              "You snuggle with yourself and feel all warm and fuzzy inside.",
            ],
            tickle: [
              "You tickle yourself and burst into laughter.",
              "You wiggle your fingers and tickle yourself.",
              "You giggle uncontrollably as you tickle yourself.",
            ],
            suck: [
              "You curl up and suck your own dick.",
              "You suck your own dick and give a mischievous smirk.",
              "You playfully suck on your dick.",
            ],
          };
          const selfOutputOptions = selfInteractOutputs[selectedInteraction];
          output = selfOutputOptions[Math.floor(Math.random() * selfOutputOptions.length)];
        } else {
          const interactOutputs = {
            kiss: [
              `*${author} leans in and gives ${user} a sweet kiss.*`,
              `*${author} gives ${user} a gentle peck on the cheek.*`,
              `*${author} surprises ${user} with a passionate kiss.*`,
            ],
            hug: [
              `*${author} gives ${user} a warm hug.*`,
              `*${author} wraps their arms around ${user} and holds tight.*`,
              `*${author} embraces ${user} in a tight hug.*`,
            ],
            slap: [
              `*${author} slaps ${user} on the cheek.*`,
              `*${author} playfully gives ${user} a hard slap on the arm.*`,
              `*${author} raises their hand and gives ${user} a hard slap.*`,
            ],
            spank: [
              `*${author} playfully spanks ${user}'s bottom.*`,
              `*${author} gives ${user} a teasing spank.*`,
              `*${author} smiles and gives ${user} a hard spank.*`,
              `*${author} begs for more as ${user} relentlessly spanks them.*`,
              `*${author} spanks ${user} for disobeying their master.*`,
            ],
            bang: [
              `*${author} bends ${user} over and takes their member in their ass.*`,
              `*${author} bangs ${user} with moans leaving their mouths.*`,
              `*While ${author} and ${user} are on the couch, ${author} bangs ${user} hard.*`,
              `*${author} bangs ${user} hard with their dick.*`,
            ],
            cuddle: [
              `*${author} cuddles up to ${user}, finding comfort and warmth.*`,
              `*${author} wraps their arms around ${user} and pulls them close for a cuddle.*`,
              `*${author} snuggles up to ${user} and enjoys the warmth of their embrace.*`,
            ],
            tickle: [
              `*${author} tickles ${user} and watches them burst into laughter.*`,
              `*${author} playfully tickles ${user}'s sides and enjoys their adorable giggles.*`,
              `*${author} uses their fingers to tickle ${user} and laughs at their resulting laughter.*`,
            ],
            suck: [
              `*${author} playfully sucks ${user}'s cock, murring gently.*`,
              `*${author} sucks on ${user}'s dick, sending shivers down their spine.*`,
              `*${author} gives ${user} a nice deep blowjob*`,
            ],
          };
          const outputOptions = interactOutputs[selectedInteraction];
          output = outputOptions[Math.floor(Math.random() * outputOptions.length)];
        }


        // Check if the interaction is "bang", "suck" or "spank" and if the channel is NSFW
        if ((selectedInteraction === "bang" || selectedInteraction === "suck" || selectedInteraction === "spank") && !interaction.channel.nsfw) {
          await interaction.reply({ content: "Sorry, this interaction can only be used in NSFW channels.", ephemeral: true });
          return;
        }

        // Prepare the response and image path
        let imagePath;
        if (["hug", "slap", "suck", "bang"].includes(selectedInteraction)) {
          const imgFolder = `${selectedInteraction}img`; // Use a template literal to create the folder name
          const imgFiles = fs.readdirSync(path.join(__dirname, imgFolder));
          if (imgFiles.length > 0) {
            const randomImg = imgFiles[Math.floor(Math.random() * imgFiles.length)];
            imagePath = path.join(__dirname, imgFolder, randomImg);
          } else {
            console.log(`No images found in the ${imgFolder} directory.`);
          }
        }

        // Send the interaction message and image together
        const replyOptions = { content: output };
        if (imagePath) {
          replyOptions.files = [{ attachment: imagePath }];
        }
        await interaction.reply(replyOptions);
        },
        };
