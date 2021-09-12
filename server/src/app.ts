import express from "express";
import http from "http";
import redis from "redis";
import socketIO from "socket.io";

const redisClient = redis.createClient({
  host: "redis",
});
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new socketIO.Server(server, { path: "/api/socket.io" });

redisClient.on("error", (error) => {
  console.error(error);
});

app.get("/api/visits", (req, res) => {
  redisClient.incr("visits", (err, visits) => {
    res.send(`${visits}`);
    io.emit("visit", `${visits}`);
  });
});

app.get("/api/button_clicks", (req, res) => {
  redisClient.get("button_clicks", (err, clicks) => {
    res.send(clicks || "0");
  });
});

io.on("connection", (socket) => {
  console.log(
    `New socket.io connection: ${socket.id} from ${socket.handshake.address}`,
  );
  socket.on("disconnect", (reason) => {
    console.log(`Closed socket.io connection: ${socket.id} due to "${reason}"`);
  });
  socket.on("button_click", () => {
    redisClient.incr("button_clicks", (err, clicks) => {
      io.emit("click_count", `${clicks}`);
    });
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
