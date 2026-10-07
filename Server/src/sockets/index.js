const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const User = require("../models/user.model");
const Project = require("../models/project.model");
const Message = require("../models/message.model");


const initializeSocket = (io) => {

    // =========================
    // SOCKET AUTHENTICATION
    // =========================

    io.use(async (socket, next) => {

        try {

            const cookies = cookie.parse(
                socket.handshake.headers.cookie || ""
            );

            const token = cookies.token;


            if (!token) {

                return next(
                    new Error("Unauthorized")
                );

            }


            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );


            const user = await User.findById(
                decoded.id
            ).select("-password");


            if (!user) {

                return next(
                    new Error("User not found")
                );

            }


            socket.user = user;

            next();

        } catch (error) {

            console.log(
                "Socket authentication error:",
                error.message
            );

            next(
                new Error("Authentication failed")
            );

        }

    });


    // =========================
    // SOCKET CONNECTION
    // =========================

    io.on("connection", (socket) => {

        console.log(
            `${socket.user.name} Connected`
        );


        // =========================
        // JOIN PROJECT ROOM
        // =========================

        socket.on(
            "join-project",
            async (projectId) => {

                try {

                    const project =
                        await Project.findById(
                            projectId
                        );


                    if (!project) {

                        return socket.emit(
                            "error",
                            {
                                message:
                                    "Project not found",
                            }
                        );

                    }


                    // Check if user is a member

                    const isMember =
                        project.members.find(
                            (member) => {

                                const memberUserId =
                                    member.user?._id ||
                                    member.user;

                                return (
                                    memberUserId
                                        ?.toString() ===
                                    socket.user._id
                                        .toString()
                                );

                            }
                        );


                    if (!isMember) {

                        return socket.emit(
                            "error",
                            {
                                message:
                                    "You are not a member of this project",
                            }
                        );

                    }


                    // Join Socket.IO room

                    socket.join(projectId);


                    console.log(
                        `${socket.user.name} joined project ${project.title}`
                    );


                    socket.emit(
                        "joined-project",
                        {
                            success: true,
                            projectId,
                            message:
                                "Joined project successfully",
                        }
                    );

                } catch (error) {

                    console.log(
                        "Join project error:",
                        error.message
                    );


                    socket.emit(
                        "error",
                        {
                            message:
                                "Internal Server Error",
                        }
                    );

                }

            }
        );


        // =========================
        // LEAVE PROJECT ROOM
        // =========================

        socket.on(
            "leave-project",
            (projectId) => {

                socket.leave(projectId);


                console.log(
                    `${socket.user.name} left project ${projectId}`
                );


                socket.emit(
                    "left-project",
                    {
                        success: true,
                        projectId,
                        message:
                            "Left project room successfully",
                    }
                );

            }
        );


        // =========================
        // SEND MESSAGE
        // =========================


socket.on(
    "send-message",
    async (data) => {

        try {

            const {
                projectId,
                message,
            } = data;


            if (
                !projectId ||
                !message?.trim()
            ) {

                return socket.emit(
                    "error",
                    {
                        message:
                            "Project ID and message are required",
                    }
                );

            }


            // =========================
            // FIND PROJECT
            // =========================

            const project =
                await Project.findById(
                    projectId
                );


            if (!project) {

                return socket.emit(
                    "error",
                    {
                        message:
                            "Project not found",
                    }
                );

            }


            // =========================
            // CHECK MEMBERSHIP
            // =========================

            const isMember =
                project.members.find(
                    (member) => {

                        const memberUserId =
                            member.user?._id ||
                            member.user;

                        return (
                            memberUserId
                                ?.toString() ===
                            socket.user._id
                                .toString()
                        );

                    }
                );


            if (!isMember) {

                return socket.emit(
                    "error",
                    {
                        message:
                            "You are not a member of this project",
                    }
                );

            }


            // =========================
            // SAVE MESSAGE
            // =========================

            const newMessage =
                await Message.create({
                    project: projectId,
                    sender: socket.user._id,
                    message: message.trim(),
                });


            // =========================
            // SEND TO PROJECT ROOM
            // =========================

            io.to(projectId).emit(
                "receive-message",
                {
                    _id: newMessage._id,

                    sender: {
                        id: socket.user._id,
                        name: socket.user.name,
                    },

                    message:
                        newMessage.message,

                    createdAt:
                        newMessage.createdAt,
                }
            );

        } catch (error) {

            console.log(
                "Send message error:",
                error.message
            );


            socket.emit(
                "error",
                {
                    message:
                        "Internal Server Error",
                }
            );

        }

    }
);

        // =========================
        // DISCONNECT
        // =========================

        socket.on(
            "disconnect",
            () => {

                console.log(
                    `${socket.user?.name || "User"} Disconnected`
                );

            }
        );

    });

};


module.exports = initializeSocket;