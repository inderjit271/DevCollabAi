import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export const joinProject = (projectId) => {
    socket.emit("join-project", projectId);
};

export const leaveProjectRoom = (projectId) => {
    socket.emit("leave-project", projectId);
};

export const sendMessage = (projectId, message) => {
    socket.emit("send-message", {
        projectId,
        message,
    });
};

export const getSocket = () => {
    return socket;
};

export default socket;