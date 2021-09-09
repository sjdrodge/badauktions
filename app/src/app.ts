import express from "express";
import redis from "redis";

const client = redis.createClient({
  host: "redis",
});
const app = express();
const port = process.env.PORT || 3000;

client.on("error", (error) => {
  console.error(error);
});

app.get("/", (req, res) => {
  client.incr("visits", (err, visits) => {
    res.send(`<h1>Hello, World!</h1> ${visits} visits to this page so far!`);
  });
});

const server = app.listen(port, () => {
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
