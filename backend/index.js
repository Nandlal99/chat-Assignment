
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors());

app.get("/", (req, res, next) => {
    res.send("Hello world");
})


io.on("connection", (socket) => {

    socket.on("message", ({ message, roomName }) => {
        // console.log(data);
        io.to(roomName).emit("receive-message", message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    })
})


server.listen(port, () => {
    console.log(`Server is running on ${port}`)
})