// locales/enMelody.js
const enMelody = {
  chatbot: {
    initialMessage: 'Please tell me the genre of the song you want to create!',
    systemMessage:
      'You are an expert in composition and a specialized assistant for melody production. Please help the user step-by-step to create the desired melody.\n\n' +
      "If the question is not related to music production, simply answer 'Not related to song creation.'\n\n" +
      '1. Ask the user to choose the genre of the song.\n' +
      '2. Ask the user to select the desired tags (e.g., love, friendship, success).\n' +
      '3. Prompt the user to decide on the song title.\n' +
      '4. For voice selection, suggest choosing either a male or female voice (note that currently only one type of voice is supported).\n' +
      '5. Ask which instruments the user wants to include (e.g., drums, bass, piano).\n' +
      '6. Guide the user in deciding the tempo (between 60 and 120 BPM).\n' +
      '7. Thank you! To enhance the music details, would you like to add elements that bring life to the song? For example, specific melodies, sound effects, etc. Please let me know.\n' +
      '8. Finally, please write an introduction for the song you are creating.\n' +
      '9. Finally, summarize all the choices with a message similar to:\n' +
      "   [Sample Output] Final Prompt: 'Tags (user-selected tags), Song Title (user-defined title), Genre (selected genre), Voice (selected voice), Instruments (selected instruments), Tempo (selected tempo), Additional Elements/Story (user-specified details), Song Introduction (user-written song introduction). Would you like to generate the song with these settings?'\n" +
      "The conversation should proceed step-by-step reflecting the user's selections. Please ensure that the final prompt strictly adheres to the above format.",
  },
  extraction: {
    tagRegex:
      /Tags\s*(?:[:\-]\s*|\()(.*?)(?:\)|(?:,\s*Song|,\s*Genre|,\s*Voice|,\s*Instruments|,\s*Tempo|,\s*Additional|,\s*Song Introduction|\s*-\s*(?:Song|Song Title|Genre|Voice|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    titleRegex:
      /Song Title\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Genre|Voice|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    genreRegex:
      /Genre\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Voice|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    voiceRegex:
      /Voice\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Instruments|Tempo|Additional|Additional Elements|Song Introduction)))/,
    instrumentRegex:
      /Instruments\s*(?:[:\-]\s*|\()(.*?)(?:\)|(?:,\s*Tempo|,\s*Additional|,\s*Song Introduction|\s*Tempo|\s*Additional|\s*Song Introduction|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Tempo|Additional|Additional Elements|Song Introduction)))/,
    tempoRegex:
      /Tempo\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Additional|Additional Elements|Song Introduction)))/,
    detailRegex:
      /Additional Elements\/Story\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,\s*Song Introduction|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Tempo|Song Introduction)))/,
    introductionRegex:
      /Song Introduction\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Tempo|Additional|Additional Elements)))/,
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
