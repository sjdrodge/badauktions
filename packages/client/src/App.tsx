import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import style from "./App.module.css";

function App(): JSX.Element {
  const [visits, setVisits] = useState("");
  const [clickCount, setClickCount] = useState("");

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    fetch("/api/visits")
      .then((res) => res.text())
      .then(setVisits)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/button_clicks")
      .then((res) => res.text())
      .then(setClickCount)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const newSocket = io("/", { path: "/api/socket.io" });

    newSocket.on("visit", (ev) => {
      setVisits(ev as string);
    });

    newSocket.on("click_count", (ev) => {
      setClickCount(ev as string);
    });

    socket.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className={style.App}>
      <h1>Hello, World!</h1>
      {visits} visits to this page so far!
      <br />
      <br />
      <button
        className={style.TheButton}
        type="button"
        onClick={() => {
          if (socket.current) socket.current.emit("button_click");
        }}
      >
        I have been clicked {clickCount} times so far!
      </button>
    </div>
  );
}

export default App;
