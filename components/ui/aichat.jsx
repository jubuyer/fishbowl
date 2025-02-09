"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

const AIChatBox = ({
  currentMode,
  response,
  showResponse,
  setResponse,
  setShowResponse,
}) => {
  const [userQuery, setQuery] = useState("");

  const changeQuery = (value) => {
    setQuery(value);
  };

  const querySubmit = async (e) => {
    if (e.key === "Enter" && currentMode === "AI Mode") {
      if(showResponse){
        setShowResponse(false)
      }
      try {
        // console.log("in query submit");
        const checkCache = await fetch("/api/check_cache", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userQuery }),
          method: "POST",
        });
        let data = await checkCache.json();
        // console.log(data.result);
        if (data.result) {
          setResponse(data.response[0].metadata.response);
        } else {
          const response = await fetch("/api/get_ai_response", {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userQuery }),
            method: "POST",
          });
          data = await response.json();
          setResponse([data.completion]);
          //   console.log(data.completion);
          const embeddingResponse = await fetch("/api/get_embeddings", {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: userQuery }),
            method: "POST",
          }).then((res) => res.json());
          await fetch("/api/insert_db", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: userQuery,
              response: data.completion,
              embeddingVector: embeddingResponse.embedding,
            }),
          });
        }
        setShowResponse(true);
        setTimeout(() => {
          document
            .getElementById("responseDiv")
            .scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Input
      onKeyDown={querySubmit}
      onChange={(e) => changeQuery(e.target.value)}
      type="input"
      placeholder="Enter your query"
      className="w-[50vw]"
    />
  );
};

export default AIChatBox;
