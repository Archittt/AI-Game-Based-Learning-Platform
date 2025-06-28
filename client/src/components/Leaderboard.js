
import React, { useEffect, useState } from "react";
import socket from "./socket";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    socket.on("leaderboard-update", (newScore) => {
      setScores((prev) => {
        const updated = [...prev, newScore];
        return updated.sort((a, b) => b.score - a.score);
      });
    });

    return () => socket.off("leaderboard-update");
  }, []);

  return (
    <div>
      <h2>Live Leaderboard</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>{score.username}: {score.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
