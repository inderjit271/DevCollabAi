const jwt = require("jsonwebtoken")
const cookie = require("cookie");
const User = require("../models/user.model");
const Project = require("../models/project.model")

const initializeSocket = (io) => {

    io.use(async (socket,next) => {
        try{
         const cookies = cookie.parse(socket.handshake.headers.cookie || "");

         const token = cookies.token;
         if(!token){
            return next(new Error("unauthorized"))
         }
         const decoded = jwt.verify(token,process.env.JWT_SECRET)

         const user = await user.findById(decoded.id).select("-password")
         
         if(!user) {
            return next(new Error("User not found"))
         }
        socket.user = user
        next()
        }catch(err) {
            next(new Error("Authentication Failed"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`${socket.user.name} Connected`);

        socket.on("join-project",async (projectId) => {
            try{
                const project = await Project.findById(projectId)

                if(!project) {
                    return socket.emit("error",{
                        message: "Project not found"
                    });
                }
                const isMember = project.members.find(
                    member => member.toString() === socket.user._id.toString()
                );

                if(!isMember) {
                    return socket.emit("error", {
                        message: "You are not a member of this project"
                    });
                }

                socket.join(projectId);
                console.log(`${socket.user.name} joined project ${project.title}`);

                socket.emit("joined-project", {
                    success: true,
                    projectId,
                    message: "Joined project successfully"
                });
            } catch(error) {
                socket.emit("error", {
                    message: "Internal server Error"
                });
            }
        });

// Leave Project Room

socket.on("leave-project", (projectId) => {

    socket.leave(projectId);

    console.log(`${socket.user.name} left project ${projectId}`);

    socket.emit("left-project", {
        success: true,
        projectId,
        message: "Left project room successfully"
    });

});

// Send Message

socket.on("send-message", async (data) => {

    try {

        const { projectId, message } = data;

        const project = await Project.findById(projectId);

        if (!project) {
            return socket.emit("error", {
                message: "Project not found"
            });
        }

        const isMember = project.members.find(
            member => member.user.toString() === socket.user._id.toString()
        );

        if (!isMember) {
            return socket.emit("error", {
                message: "You are not a member of this project"
            });
        }

        io.to(projectId).emit("receive-message", {
            sender: {
                id: socket.user._id,
                name: socket.user.name,
            },
            message,
            createdAt: new Date(),
        });

    } catch (error) {

        socket.emit("error", {
            message: "Internal Server Error"
        });

    }

});

        socket.on("disconnect", () => {
            console.log(`${socket.user.name} Disconnected`);
        });
    });
};

module.exports = initializeSocket;