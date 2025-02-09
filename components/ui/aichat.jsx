"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

const AIChatBox = ({
  userQuery,
  setQuery,
  currentMode,
  response,
  showResponse,
  setResponse,
  setShowResponse,
}) => {
  const [firstQuery, setFirstQuery] = useState(false);

  const changeQuery = (value) => {
    setQuery(value);
  };

  const querySubmit = async (e) => {
    if (e.key === "Enter" && currentMode === "AI Mode") {
      if (showResponse) {
        setShowResponse(false);
      }
      try {
        const checkCache = await fetch("/api/check_cache", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userQuery }),
          method: "POST",
        });
        let data = await checkCache.json();
        if (data.result) {
          setResponse(data.response[0].metadata.response);
        } else {
          setFirstQuery(true);
          toast("Congrats! 🎉", {
            description:
              "This is a brand new query to us! This means you will save water and electricity for every person who asks this question in the future! 🌍",
            action: {
              label: "X",
              onClick: () => {},
            },
          });
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
    <div>
      {/* <Dialog open={firstQuery} onOpenChange={(open) => setFirstQuery(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-black text-2xl">
              Congrats! 🎉
            </DialogTitle>
            <DialogDescription className="text-md font-normal pt-4">
              This is a brand new query to us!
              <br />
              This means you will{" "}
              <span className="font-bold">save water and electricity</span> for
              every person who asks this question in the future! 🌍
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}

      <Input
        onKeyDown={querySubmit}
        onChange={(e) => changeQuery(e.target.value)}
        type="input"
        placeholder="Enter your query"
        className="w-[50vw]"
      />
    </div>
  );
};

export default AIChatBox;
