
/*import React, { useEffect, useState } from "react";
//import socket from "./socket";
import { gameSocket } from "../socket/gameSocket";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    socket.on("xleaderboard-update", (newScore) => {
      setScores((prev) => {
        const updated = [...prev, newScore];
        return updated.sort((a, b) => b.score - a.score);
      });
    });

    return () => socket.off("leaderboard-update");
    gameSocket.disconnect();
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

export default Leaderboard;*/
import React, { useEffect, useState } from "react";
//import { gameSocket } from "../socket/gameSocket";

import gameSocket from '../socket/gameSocket'; // ✅ correct


const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Use the correct socket reference
    gameSocket.on("leaderboard-update", (newScore) => {
      setScores((prev) => {
        const updated = [...prev, newScore];
        return updated.sort((a, b) => b.score - a.score);
      });
    });

    // Cleanup on unmount
    return () => {
      gameSocket.off("leaderboard-update");
      gameSocket.disconnect(); // Optional: if not shared globally
    };
  }, []);

  return (
    <div>
      <h2>Live Leaderboard</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            {score.username}: {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;

