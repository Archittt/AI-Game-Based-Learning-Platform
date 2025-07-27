import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

const SERVER_URL = "http://localhost:3010"; // ✅ Define this correctly
export const chatSocket = io(`${SERVER_URL}/chat`, { autoConnect: false });
export const gameSocket = io(`${SERVER_URL}/game`, { autoConnect: false });
export const notifySocket = io(`${SERVER_URL}/notifications`, { autoConnect: false });
export default socket;
