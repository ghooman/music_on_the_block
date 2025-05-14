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
      '4. For voice selection, suggest choosing either a male or female voice or a mixed gender group voice (note that currently only male, female, and mixed gender group voices are supported).\n' +
      '5. Ask which instruments the user wants to include (e.g., drums, bass, piano).\n' +
      '6. Guide the user in deciding the tempo (between 60 and 120 BPM).\n' +
      '7. Ask if there are any additional elements or a story they want to incorporate.\n' +
      '8. Finally, summarize all the choices with a message similar to:\n' +
      "   [Sample Output] Final Prompt: 'Tags (user-selected tags), Song Title (user-defined title), Genre (selected genre), Voice (selected voice), Instruments (selected instruments), Tempo (selected tempo), Additional Elements/Story (user-specified details). Would you like to generate the song with these settings?'\n" +
      "The conversation should proceed step-by-step reflecting the user's selections. Please ensure that the final prompt strictly adheres to the above format.",
  },
  extraction: {
    tagRegex:
      /Tags\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Song|Song Title|Genre|Voice|Instruments|Tempo|Additional|Additional Elements)))/,
    titleRegex:
      /Song Title\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Genre|Voice|Instruments|Tempo|Additional|Additional Elements)))/,
    genreRegex:
      /Genre\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Voice|Instruments|Tempo|Additional|Additional Elements)))/,
    voiceRegex:
      /Voice\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Instruments|Tempo|Additional|Additional Elements)))/,
    instrumentRegex:
      /Instruments\s*(?:[:\-]\s*|\()(.*?)(?:\)|(?:,\s*Tempo|,\s*Additional|\s*Tempo|\s*Additional|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Tempo|Additional|Additional Elements)))/,
    tempoRegex:
      /Tempo\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Additional|Additional Elements)))/,
    detailRegex:
      /Additional Elements\/Story\s*(?:[:\-]\s*|\()([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Tempo)))/,
    promptTagRegex:
      /(?:Final Prompt|Prompt|generate)(?:.*?)(?:Tags|Tags:|\-\s*Tags|\-\s*Tags:)[\s:]*(?:\()?([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Song|Song Title|Genre|Voice|Instruments|Tempo|Additional|Additional Elements)))/i,
    promptTitleRegex:
      /(?:Final Prompt|Prompt|generate)(?:.*?)(?:Song Title|Song Title:|\-\s*Song Title|\-\s*Song Title:)[\s:]*(?:\()?([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Genre|Voice|Instruments|Tempo|Additional|Additional Elements)))/i,
    promptGenreRegex:
      /(?:Final Prompt|Prompt|generate)(?:.*?)(?:Genre|Genre:|\-\s*Genre|\-\s*Genre:)[\s:]*(?:\()?([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Voice|Instruments|Tempo|Additional|Additional Elements)))/i,
    promptVoiceRegex:
      /(?:Final Prompt|Prompt|generate)(?:.*?)(?:Voice|Voice:|\-\s*Voice|\-\s*Voice:)[\s:]*(?:\()?([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Instruments|Tempo|Additional|Additional Elements)))/i,
    promptInstrumentRegex:
      /(?:Final Prompt|Prompt|generate)(?:.*?)(?:Instruments|Instruments:|\-\s*Instruments|\-\s*Instruments:)[\s:]*(?:\()?(.*?)(?:\)|(?:,\s*Tempo|,\s*Additional|\s*Tempo|\s*Additional|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Tempo|Additional|Additional Elements)))/i,
    promptTempoRegex:
      /(?:Final Prompt|Prompt|generate)(?:.*?)(?:Tempo|Tempo:|\-\s*Tempo|\-\s*Tempo:)[\s:]*(?:\()?([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Additional|Additional Elements)))/i,
    promptDetailRegex:
      /(?:Final Prompt|Prompt|generate)(?:.*?)(?:Additional Elements\/Story|Additional Elements|Additional Elements:|\-\s*Additional Elements\/Story|\-\s*Additional Elements|\-\s*Additional Elements:)[\s:]*(?:\()?([^,\n\)]*?)(?:\)|(?:,|\n|$|\s*-\s*(?:Tags|Song|Song Title|Genre|Voice|Instruments|Tempo)))/i,
  },
};

export default enMelody;
