import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import style from "./App.module.css";

type SockRef = Socket<DefaultEventsMap, DefaultEventsMap> | null;

function App() {
  const [visits, setVisits] = useState("");
  const [presses, setPresses] = useState("");

  const socket = useRef<SockRef>(null);

  useEffect(() => {
    fetch("/api/visits")
      .then((res) => res.text())
      .then(setVisits)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/button_clicks")
      .then((res) => res.text())
      .then(setPresses)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const newSocket = io("/", { path: "/api/socket.io" });

    newSocket.on("visit", (ev) => {
      setVisits(ev as string);
    });

    newSocket.on("click_count", (ev) => {
      setPresses(ev as string);
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
        I have been pressed {presses} times so far!
      </button>
    </div>
  );
}

export default App;
