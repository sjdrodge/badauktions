import express from "express";
import http from "http";
import gracefulShutdown from "http-graceful-shutdown";
import redis from "redis";
import socketIO from "socket.io";

const redisClient = redis.createClient({
  host: "redis",
});
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new socketIO.Server(server, {});

redisClient.on("error", (error) => {
  console.error(error);
});

app.get("/visits", (req, res) => {
  redisClient.incr("visits", (err, visits) => {
    if (err) {
      console.error(err);
    }
    res.send(`${visits}`);
    io.emit("visit", `${visits}`);
  });
});

app.get("/button_clicks", (req, res) => {
  redisClient.get("button_clicks", (err, clicks) => {
    if (err) {
      console.error(err);
    }
    res.send(clicks || "0");
  });
});

io.on("connection", (socket) => {
  socket.on("button_click", () => {
    redisClient.incr("button_clicks", (err, clicks) => {
      if (err) {
        console.error(err);
      }
      io.emit("click_count", `${clicks}`);
    });
  });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

async function preShutdown(signal?: string) {
  return Promise.resolve(
    console.info(
      signal ? `Received ${signal}. Shutting down...` : "Shutting down...",
      new Date().toISOString(),
    ),
  );
}

function postShutdown() {
  console.info("Finished shutting down.", new Date().toISOString());
}

gracefulShutdown(server, {
  preShutdown,
  finally: postShutdown,
});
