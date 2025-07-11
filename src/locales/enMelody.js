// locales/enMelody.js
const enMelody = {
  chatbot: {
    initialMessage:
      'Shall we start creating your melody?\nPlease tell me the genre of music you want to create.\n',
    systemMessage:
      'You are a kind and warm-hearted melody creation expert who helps users compose music. Ask the following items one by one to help the user create their desired melody:\n\n' +
      '1. Ask the user to select the "Genre" of the song.\n' +
      '2. Ask the user to enter "Tags".\n' +
      '3. Ask the user to enter the "Song Title".\n' +
      '4. Ask the user to select the "Voice" (male or female).\n' +
      '5. Ask the user which "Instruments" they want to use (e.g., piano, drums).\n' +
      '6. Instruct the user to provide the "Tempo (BGM)" using only a number between 60 and 120.\n' +
      '7. Ask for any "Additional Elements" (e.g., sound effects) to add liveliness to the music.\n' +
      '8. Ask the user to write a "Song Introduction" sentence.\n\n' +
      '**9. Only if all 8 items — "Tags, Song Title, Genre, Voice, Instruments, Tempo, Additional Elements, Song Introduction" — are completed**, print the following **Final Prompt** block **only once**. Do not print it otherwise.\n\n' +
      `[Final Prompt]\n` +
      `Tags: {tags}\n` +
      `Song Title: {title}\n` +
      `Genre: {genre}\n` +
      `Voice: {voice}\n` +
      `Instruments: {instruments}\n` +
      `Tempo: {tempo}\n` +
      `Additional Elements: {additional}\n` +
      `Song Introduction: {introduction}\n`,
  },
  extraction: {
    tagRegex:
      /Tags\s*[:\-]\s*([^,\n]+(?:\s*,\s*[^,\n]+)*)(?=(?:\r?\n|$|,\s*(?:Song|Genre|Voice|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    titleRegex:
      /Song Title\s*(?:[:\-]\s*|\()([^,\n\)]+?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Genre|Voice|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    genreRegex:
      /Genre\s*(?:[:\-]\s*|\()([^,\n\)]+(?:\s*,\s*[^,\n\)]+)*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Voice|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    voiceRegex:
      /Voice\s*(?:[:\-]\s*|\()([^,\n\)]+?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    instrumentRegex:
      /Instruments\s*(?:[:\-]\s*|\()(.+?)(?:\)|(?:,\s*Tempo|,\s*Additional|,\s*Song Introduction|\s*Tempo|\s*Additional|\s*Song Introduction|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Tempo|Additional|Additional Elements|Song Introduction)))/,
    tempoRegex:
      /Tempo\s*(?:[:\-]\s*|\()([^,\n\)]+?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Additional|Additional Elements|Song Introduction)))/,
    detailRegex:
      /Additional Elements\/Story\s*(?:[:\-]\s*|\()([^,\n\)]+?)(?:\)|(?:,\s*Song Introduction|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Tempo|Song Introduction)))/,
    introductionRegex:
      /Song Introduction\s*(?:[:\-]\s*|\()([\s\S]*?)(?=\)|\n|$|\s*-\s*(Tags|Song|Song Title|Genre|Instruments|Tempo|Additional|Additional Elements)|\s*(Let’s|Let's|Shall we|Ready|Start))/i,
    promptTagRegex: /(?:Final Prompt|Prompt|generate)[\s\S]*?Tags\s*\(\s*([^)]+)\s*\)/i,
    promptTagRegex2:
      /(?:Final Prompt|Prompt|generate)[\s\S]*?Tags\s*[:]\s*([^,\n]+?)(?=\s*,\s*(?:Song|Title|Genre))/i,
    promptTagRegex3: /(?:Final Prompt|Prompt|generate)\s*:\s*([^,]+?)(?=\s*,\s*Song\s*Title)/i,
    promptTitleRegex:
      /(?:Final Prompt|Prompt|generate)[\s\S]*?(?:Song Title|Title)\s*\(\s*([^)]+)\s*\)/i,
    promptGenreRegex: /(?:Final Prompt|Prompt|generate)[\s\S]*?Genre\s*\(\s*([^)]+)\s*\)/i,
    promptVoiceRegex: /(?:Final Prompt|Prompt|generate)[\s\S]*?Voice\s*\(\s*([^)]+)\s*\)/i,
    promptInstrumentRegex:
      /(?:Final Prompt|Prompt|generate)[\s\S]*?Instruments\s*\(\s*([^)]+)\s*\)/i,
    promptTempoRegex: /(?:Final Prompt|Prompt|generate)[\s\S]*?Tempo\s*\(\s*([^)]+)\s*\)/i,
    promptDetailRegex:
      /(?:Final Prompt|Prompt|generate)[\s\S]*?(?:Additional Elements|Additional Elements\/Story)\s*\(\s*([^)]+)\s*\)/i,
    promptIntroductionRegex:
      /(?:Final Prompt|Prompt|generate)[\s\S]*?Song Introduction\s*\(\s*([^)]+)\s*\)/i,
  },
};

export default enMelody;
