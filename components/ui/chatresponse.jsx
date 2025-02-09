"use client";

import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ChatResponse = ({
  response,
  setResponse,
  showResponse,
  setShowResponse,
  userQuery,
  userWin,
  setUserWin,
}) => {
  //   console.log(response);
  const { user } = useUser();
  const [showButtons, setShowButtons] = useState(true);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState(response[0]);

  const acceptedResponse = () => {
    toast("Thanks! 🎉", {
      description:
        "You accepted a cached response! This means you saved water and electricity and gained 10 points for your reef! 🌍",
      action: {
        label: "X",
        onClick: () => {},
      },
    });
    const { searchCount, points } = user.unsafeMetadata;
    user?.update({
      unsafeMetadata: { points: points + 10, searchCount: searchCount + 1 },
    });
    // console.log(user?.unsafeMetadata.points);
    setShowButtons(false);
  };

  const regenerateResponse = async () => {
    if (showResponse) {
      setShowResponse(false);
    }
    toast("Oh no! 😟", {
      classNames: {
        title: "text-red-950",
        description: "text-red-950",
      },
      style: {
        background: "#ff938c",
      },
      description:
        "You regenerated an existing response. You lost 10 points for this action.",
      action: {
        label: "X",
        onClick: () => {},
      },
    });
    // console.log("regenerating");
    const response = await fetch("/api/get_ai_response", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userQuery }),
      method: "POST",
    });
    let data = await response.json();
    setResponse([data.completion]);
    // console.log(data.completion);
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
    const { searchCount, points } = user.unsafeMetadata;
    user?.update({
      unsafeMetadata: { points: points - 10, searchCount: searchCount + 1 },
    });
    // console.log(user?.unsafeMetadata.points);
    setShowResponse(true);
  };

  const prevResponse = () => {
    if (currentResponseIndex === 0) {
      setCurrentResponseIndex(response.length - 1);
      setCurrentResponse(response[response.length - 1]);
    } else {
      setCurrentResponseIndex(currentResponseIndex - 1);
      setCurrentResponse(response[currentResponseIndex - 1]);
    }
  };

  const nextResponse = () => {
    if (currentResponseIndex === response.length - 1) {
      setCurrentResponseIndex(0);
      setCurrentResponse(response[0]);
    } else {
      setCurrentResponseIndex(currentResponseIndex + 1);
      setCurrentResponse(response[currentResponseIndex + 1]);
    }
  };

  useEffect(
    (response) => {
      setShowButtons(true);
    },
    [response]
  );
  return (
    <div>
      <Dialog open={userWin} onOpenChange={(open) => setUserWin(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Congrats 🎉</DialogTitle>
            <DialogDescription>
              You've reached 200 points! In your honor we've donated to the
              coral reef alliance! Your coral and points have been reset,
              continue searching efficiently!
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button type="submit" onClick={() => setUserWin(false)}>
              Save the ocean 🌊
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div
        id="responseDiv"
        className="backdrop-blur-lg my-4 p-4 bg-white bg-opacity-25 rounded-lg shadow-lg w-[65vw] border border-gray-200 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex justify-between gap-5">
          {response.length > 1 && showButtons && (
            <Button onClick={prevResponse}>
              <ChevronLeft />
            </Button>
          )}
          <div>
            <ReactMarkdown>{currentResponse}</ReactMarkdown>
          </div>
          {response.length > 1 && showButtons && (
            <Button onClick={nextResponse}>
              <ChevronRight />
            </Button>
          )}
        </div>
        <br />
      </div>
      {showButtons && (
        <div className="flex gap-2 justify-end">
          <Button onClick={acceptedResponse}>Accept Cached</Button>
          <Button onClick={regenerateResponse} variant="destructive">
            Regenerate
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatResponse;
