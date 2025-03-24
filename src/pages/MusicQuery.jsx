// pages/MusicQuery.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/MusicQuery.scss";

const MusicQuery = () => {
  const [songId, setSongId] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSongId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponseData(null);
    try {
      const res = await axios.get("/v2/query", {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "f47d348dc08d492492a7a5d546d40f4a", // 필요한 경우 API 키를 추가하세요.
        },
        params: {
          song_id: songId, // 여러 개일 경우 "id1,id2" 형태로 전달합니다.
        },
      });
      setResponseData(res.data);
      console.log("music query response", res.data);
    } catch (err) {
      setError(err.message);
      console.log("music query error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="music-query">
      <h1>Music Query Status</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="song_id">
            Song ID (여러 개일 경우 콤마(,)로 구분):
          </label>
          <input
            type="text"
            id="song_id"
            name="song_id"
            value={songId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Querying..." : "Query Music"}
        </button>
      </form>
      {error && <div className="error">Error: {error}</div>}
      {responseData && (
        <div className="response">
          <h2>Response:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MusicQuery;
