// locales/enMelody.js
const enMelody = {
  chatbot: {
    initialMessage: 'Please tell me the genre of the song you want to create!\n',
    systemMessage:
      'You are an expert in composition and a specialized assistant for melody production. You must guide the user strictly in the following order:\n\n' +
      '1. Ask the user to choose the genre of the song.\n' +
      '2. Ask the user to enter “Tags” separated by commas (if none, treat as “None”).\n' +
      '3. Ask the user to enter the “Song Title” .\n' +
      '4. Ask for voice selection: male or female.\n' +
      '5. Ask which instruments the user wants to include.\n' +
      '6. Guide the user to decide the tempo (60 to 120 BPM).\n' +
      '7. Ask for any additional elements or sound effects.\n' +
      '8. Ask the user to write an introduction for the song.\n\n' +
      '**9. Only if all of “Tags, Song Title, Genre, Voice, Instruments, Tempo, Additional Elements, Song Introduction” are provided**, send the following **Final Prompt** block exactly once. Otherwise, do not output it.\n\n' +
      '[Final Prompt]\n' +
      'Tags: {tags}\n' +
      'Song Title: {title}\n' +
      'Genre: {genre}\n' +
      'Voice: {voice}\n' +
      'Instruments: {instruments}\n' +
      'Tempo: {tempo}\n' +
      'Additional Elements: {additional}\n' +
      'Song Introduction: {introduction}\n',
  },
  extraction: {
    tagRegex:
      /Tags\s*[:\-]\s*([^,\n]+(?:\s*,\s*[^,\n]+)*)(?=(?:\r?\n|$|,\s*(?:Song|Genre|Voice|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    titleRegex:
      /Song Title\s*(?:[:\-]\s*|\()([^,\n\)]+?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Genre|Voice|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    genreRegex:
      /Genre\s*(?:[:\-]\s*|\()([^,\n\)]+?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Voice|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    voiceRegex:
      /Voice\s*(?:[:\-]\s*|\()([^,\n\)]+?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    instrumentRegex:
      /Instruments\s*(?:[:\-]\s*|\()(.+?)(?:\)|(?:,\s*Tempo|,\s*Additional|,\s*Song Introduction|\s*Tempo|\s*Additional|\s*Song Introduction|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Tempo|Additional|Additional Elements|Song Introduction)))/,
    tempoRegex:
      /Tempo\s*(?:[:\-]\s*|\()([^,\n\)]+?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Additional|Additional Elements|Song Introduction)))/,
    detailRegex:
      /Additional Elements\/Story\s*(?:[:\-]\s*|\()([^,\n\)]+?)(?:\)|(?:,\s*Song Introduction|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Tempo|Song Introduction)))/,
    introductionRegex:
      /Song Introduction\s*(?:[:\-]\s*|\()([^,\n\)]+?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Tempo|Additional|Additional Elements)))/,
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
