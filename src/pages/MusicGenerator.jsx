// pages/MusicGenerator.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/MusicGenerator.scss";

const MusicGenerator = () => {
  // 개별 상태 선언
  const [isAuto, setIsAuto] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [title, setTitle] = useState("");
  const [instrumental, setInstrumental] = useState(0);

  // 전체 formData 상태 초기화
  const [formData, setFormData] = useState({
    is_auto: 0,
    prompt: "",
    lyrics: "",
    title: "",
    instrumental: 0,
  });

  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 입력 변경 시 개별 상태와 formData를 동시에 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "is_auto" || name === "instrumental"
        ? parseInt(value, 10)
        : value;

    // 개별 상태 업데이트
    switch (name) {
      case "is_auto":
        setIsAuto(newValue);
        break;
      case "prompt":
        setPrompt(newValue);
        break;
      case "lyrics":
        setLyrics(newValue);
        break;
      case "title":
        setTitle(newValue);
        break;
      case "instrumental":
        setInstrumental(newValue);
        break;
      default:
        break;
    }

    // formData 업데이트
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponseData(null);
    console.log("handleSubmit 보내는 데이터", formData);
    try {
      const res = await axios.post(
        "https://api.topmediai.com/v1/music",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "f47d348dc08d492492a7a5d546d40f4a", // 필요한 경우 API 키를 추가하세요.
          },
        }
      );
      setResponseData(res.data);
      console.log("handleSubmit", res.data);
    } catch (err) {
      setError(err.message);
      console.log("handleSubmit", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="music-generator">
      <h1>AI Music Generator Test</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prompt">Prompt:</label>
          <input
            type="text"
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={handleChange}
            required
            minLength={1}
            maxLength={200}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lyrics">Lyrics:</label>
          <textarea
            id="lyrics"
            name="lyrics"
            value={lyrics}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Music"}
        </button>
      </form>
      {error && <div className="error">Error: {error}</div>}
      {responseData && (
        <div className="response">
          <h2>Response:</h2>
          <div className="music-list">
            {responseData.data &&
              responseData.data.map((item) => (
                <div key={item.item_uuid} className="music-item">
                  <img src={item.image_file} alt={item.title} />
                  <div className="music-info">
                    <h3>{item.title}</h3>
                    <p>{item.lyrics}</p>
                    <p>
                      <strong>Tags:</strong> {item.tags}
                    </p>
                    <audio controls>
                      <source src={item.audio_file} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              ))}
          </div>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;
