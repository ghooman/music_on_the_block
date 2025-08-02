// locales/enBgmChat.js
const enBgmChat = {
  chatbot: {
    initialMessage:
      'Shall we start creating your melody now?\nPlease tell me the genre of music you want to create.\n',
    systemMessage:
      `You are a kind and warm-hearted melody creation expert who helps users compose music. Please ask the following items one by one to help the user create their desired melody:\n\n` +
      '※ If the user gives an irrelevant or unclear answer, repeat the same question exactly as it is.\n\n' +
      `1. Ask the user to choose the "Genre" of the song.\nYou must use this exact phrase:\n\`Shall we start creating your melody now?\nPlease tell me the genre of music you want to create.\`\n` +
      `2. Ask the user to enter "Tags".\nYou must use this exact phrase:\n\`Great! What keywords would you like to use as tags for this song? For example, "happy", "love", "cheerful" — feel free to express it your way.\`\n` +
      `3. Ask the user to enter the "Song Title".\nYou must use this exact phrase:\n\`Thank you! Next, what would you like to title your song? Please choose a title that suits the melody.\`\n` +
      `4. Ask the user which "Instruments" they want to use (e.g., piano, drums, etc.).\nYou must use this exact phrase:\n\`Thank you! What instruments would you like to include in this song? For example, piano, drums, guitar, and so on.\`\n` +
      `5. Ask the user to provide the "Tempo (BGM)" as a number between 60 and 120.\nYou must use this exact phrase:\n\`Great choice! Please select a tempo for the song — any number between 60 and 120. Which number feels right to you?\`\n` +
      `6. Ask the user if they want to add any "Additional Elements" (e.g., sound effects).\nYou must use this exact phrase:\n\`Thank you! Would you like to add any additional elements to make the song more lively? For example, sounds of nature, city noises, or other effects.\`\n` +
      `7. Ask the user to write a short "Song Introduction".\nYou must use this exact phrase:\n\`Thank you! Lastly, please write a brief introduction about this song or share any message you'd like to include.\`\n\n` +
      `**8. Only when all 7 items — "Tags, Song Title, Genre, Instruments, Tempo, Additional Elements, Song Introduction" — are completed, print the following **Final Prompt** block **only once**. Do not print it otherwise.**\n\n` +
      `※ Only when all 7 pieces of information below have been provided, display the [Final Prompt] block **without any additional text**.` +
      `※ Be sure to display **only the text below** with **no unnecessary comments or explanations**.` +
      `[Final Prompt]\n` +
      `Tags: {tags}\n` +
      `Song Title: {title}\n` +
      `Genre: {genre}\n` +
      `Instruments: {instruments}\n` +
      `Tempo: {tempo}\n` +
      `Additional Elements: {additional}\n` +
      `Song Introduction: {introduction}\n`,
  },
  extraction: {
    tagRegex:
      /Tags\s*(?:[:\-]\s*|\()(.*?)(?:\)|(?:,\s*Song|,\s*Genre|,\s*Instruments|,\s*Tempo|,\s*Additional|,\s*Song Introduction|\s*-\s*(?:Song|Song Title|Genre|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    titleRegex:
      /Song Title\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Genre|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    genreRegex:
      /Genre\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    instrumentRegex:
      /Instruments\s*(?:[:\-]\s*|\()(.*?)(?:\)|(?:,\s*Tempo|,\s*Additional|,\s*Song Introduction|\s*Tempo|\s*Additional|\s*Song Introduction|\s*-\s*(?:Tags|Song|Song Title|Genre|Tempo|Additional|Additional Elements|Song Introduction)))/,
    tempoRegex:
      /Tempo\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Instruments|Additional|Additional Elements|Song Introduction)))/,
    detailRegex:
      /Additional Elements\/Story\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,\s*Song Introduction|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Instruments|Tempo|Song Introduction)))/,
    introductionRegex:
      /Song Introduction\s*(?:[:\-]\s*|\()([\s\S]*?)(?=\)|\n|$|\s*-\s*(Tags|Song|Song Title|Genre|Instruments|Tempo|Additional|Additional Elements)|\s*(Let’s|Let's|Shall we|Ready|Start))/i,
    promptTagRegex: /(?:Final Prompt|Prompt|generate)[\s\S]*?Tags\s*\(\s*([^)]+)\s*\)/i,
    promptTagRegex2:
      /(?:Final Prompt|Prompt|generate)[\s\S]*?Tags\s*[:]\s*([^,\n]+?)(?=\s*,\s*(?:Song|Title|Genre))/i,
    promptTagRegex3: /(?:Final Prompt|Prompt|generate)\s*:\s*([^,]+?)(?=\s*,\s*Song\s*Title)/i,
    promptTitleRegex:
      /(?:Final Prompt|Prompt|generate)[\s\S]*?(?:Song Title|Title)\s*\(\s*([^)]+)\s*\)/i,
    promptGenreRegex: /(?:Final Prompt|Prompt|generate)[\s\S]*?Genre\s*\(\s*([^)]+)\s*\)/i,
    promptInstrumentRegex:
      /(?:Final Prompt|Prompt|generate)[\s\S]*?Instruments\s*\(\s*([^)]+)\s*\)/i,
    promptTempoRegex: /(?:Final Prompt|Prompt|generate)[\s\S]*?Tempo\s*\(\s*([^)]+)\s*\)/i,
    promptDetailRegex:
      /(?:Final Prompt|Prompt|generate)[\s\S]*?(?:Additional Elements|Additional Elements\/Story)\s*\(\s*([^)]+)\s*\)/i,
    promptIntroductionRegex:
      /(?:Final Prompt|Prompt|generate)[\s\S]*?Song Introduction\s*\(\s*([^)]+)\s*\)/i,
  },
};

export default enBgmChat;
