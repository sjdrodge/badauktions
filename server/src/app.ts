import express from "express";
import http from "http";
import redis from "redis";
import socketIO from "socket.io";

const redisClient = redis.createClient({
  host: "redis",
});
const app = express();
const port = process.env.PORT || 3000;

redisClient.on("error", (error) => {
  console.error(error);
});

app.get("/", (req, res) => {
  redisClient.incr("visits", (err, visits) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
<script src="/socket.io/socket.io.js"></script>
<script>
const socket = io();
</script>
</head>
<body>
<h1>Hello, World!</h1>
${visits} visits to this page so far!
</body>
</html>`);
  });
});

const server = http.createServer(app);
const io = new socketIO.Server(server, {});

io.on("connection", (socket) => {
  console.log(
    `New socket.io connection: ${socket.id} from ${socket.handshake.address}`,
  );
  socket.on("disconnect", (reason) => {
    console.log(`Closed socket.io connection: ${socket.id} due to "${reason}"`);
  });
});

server.listen(port, () => {
  console.log(`Badauktions listening at http://localhost:${port}`);
});

function shutdown() {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
    process.exit();
  });
}

const signals = ["SIGINT", "SIGTERM"];
for (const signal of signals) {
  process.on(signal, () => {
    console.info(
      `Received ${signal}. Shutting down gracefully...`,
      new Date().toISOString(),
    );
    shutdown();
  });
}
