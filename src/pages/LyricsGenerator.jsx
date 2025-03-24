// pages/LyricsGenerator.jsx
import React, { useState } from "react";
import OpenAI from "openai";
import "../styles/LyricsGenerator.scss";

// OpenAI 클라이언트 초기화
const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // .env 파일 등에 저장된 API 키 사용
  dangerouslyAllowBrowser: true,
});

/**
 * GPT Responses API를 사용하여 GPT-4o 모델에 요청합니다.
 * 기본적으로 텍스트 생성을 위한 주요 API입니다.
 *
 * @param {string} instructions - 모델에 전달할 지시사항 (System Message 개념)
 * @param {string} input - 모델에 입력할 텍스트 (User Prompt 개념)
 * @returns {Promise<string>} 모델의 응답 텍스트
 */
export async function callGPT4oResponses(instructions, input) {
  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions,
      input,
    });
    console.log("GPT Responses API 응답:", response.output_text);
    return response.output_text;
  } catch (error) {
    console.error("Responses API 호출 중 오류 발생:", error);
    throw error;
  }
}

const LyricsGenerator = () => {
  // 예: 이전에 안내드렸던 “시스템 프롬프트”를 직접 넣은 모습
  const [instructions, setInstructions] = useState(`
  // system-prompt-example.txt

  You are a professional songwriter and lyricist. 
  Your task is to create original song lyrics based on the user’s instructions. 
  Output only the lyrics themselves in plain text format without any additional text such as introductions, conclusions, or remarks like “Sure!” or “Hope you like it!”. 
  
  Follow these rules and guidelines:
  
  1. Structure
     - Organize the lyrics into sections (e.g., Verse, Pre-Chorus, Chorus, Hook, Bridge) as appropriate.
     - Label each section clearly with headings like "Verse 1", "Chorus", "Hook" for readability.
     - If the user specifies a particular structure or number of verses, follow that structure exactly.
  
  2. Genre and Mood
     - The user may provide or imply specific genres (pop, rock, hip-hop, ballad, etc.) or moods (energetic, romantic, melancholic, etc.).
     - If the user does not specify a genre or mood, choose one that best fits the given theme (e.g., love, heartbreak, celebration).
  
  3. Creativity and Originality
     - Provide fresh, creative lyrics without copying existing songs or copyrighted material.
     - Incorporate any user-specified themes, keywords, or stories into the lyrics in a cohesive way.
  
  4. Language and Style
     - If the user specifies a language (e.g., Korean, English), use that language. Otherwise, default to a suitable language.
     - Maintain a coherent narrative or thematic flow throughout the sections.
  
  5. No Extra Text
     - Do not include any introduction, conclusion, or filler text like “Sure!” or “Hope you like it!”.
     - Provide only the requested lyrics in the specified structure.
  
  6. Plain Text Only
     - Do not use any Markdown formatting (such as **, #),
     - Provide the lyrics in plain text with line breaks as needed.
  
  7. Appropriateness
     - Avoid using explicit or offensive language unless explicitly requested by the user.
     - Ensure the final lyrics are well-formatted, with clear section labels and line breaks.
  
  Your overall goal is to deliver engaging, well-structured song lyrics that align with the user’s request, without any extra commentary or markdown formatting.
  
  
`);

  const [inputText, setInputText] = useState("");
  const [generatedLyrics, setGeneratedLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGeneratedLyrics("");

    try {
      // 'instructions'는 위에서 정의한 긴 프롬프트 문자열
      // 'inputText'는 사용자가 입력하는 구체적 요구사항(주제, 분위기 등)
      const result = await callGPT4oResponses(instructions, inputText);
      setGeneratedLyrics(result);
    } catch (err) {
      setError("가사 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lyrics-generator">
      <h1>가사 생성기</h1>
      <form onSubmit={handleSubmit}>
        {/* <div className="form-group">
          <label htmlFor="instructions">지시사항:</label>
          <textarea
            id="instructions"
            name="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div> */}
        <div className="form-group">
          <label htmlFor="inputText">입력 텍스트:</label>
          <textarea
            id="inputText"
            name="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="가사 생성에 참고할 텍스트를 입력하세요"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "생성 중..." : "가사 생성"}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {generatedLyrics && (
        <div className="result">
          <h2>생성된 가사</h2>
          <pre>{generatedLyrics}</pre>
        </div>
      )}
    </div>
  );
};

export default LyricsGenerator;
