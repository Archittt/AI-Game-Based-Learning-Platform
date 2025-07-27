import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3010"; // ✅ Define this correctly

const gameSocket = io(`${SERVER_URL}/game`, { autoConnect: false });

export default gameSocket;


