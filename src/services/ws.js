import io from "socket.io-client";
const socket = io(":8282/");

export { socket };
