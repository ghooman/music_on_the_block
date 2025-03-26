// src/hooks/useUserDetail.js
import { useQuery } from "react-query";
import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useUserDetail = () => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const query = useQuery(
    "userDetail",
    async () => {
      const response = await axios.get(`${serverApi}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    {
      enabled: !!token, // 토큰이 있을 때만 실행
    }
  );

  useEffect(() => {
    if (!query.isLoading && query.data) {
      // 사용자 정보에서 name이 없으면 sign-up 페이지로 이동
      if (!query.data.name || query.data.name.trim() === "") {
        navigate("/sign-up");
      }
    }
  }, [query.isLoading, query.data, navigate]);
  return query;
};
