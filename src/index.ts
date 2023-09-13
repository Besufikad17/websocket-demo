import experss from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = experss();
const server = createServer(app);
const io = new Server(server);
const prisma = new PrismaClient();

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(join(__dirname + "/public/index.html"));
});

app.get("/messages", async(req, res) => {
  const messages = await prisma.text.findMany({ where: {}});
  res.json(messages);
});

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);

  socket.on('message', async(msg) => {
    await prisma.text.create({
      data: {
        socketId: socket.id,
        message: msg,
        sentAt: new Date()
      }
    });
    socket.emit(`${socket.id}: ${msg}`);
  });
});

server.listen(3000, () => {
  console.log("websocket server running..");
});


