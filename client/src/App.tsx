import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [visits, setVisits] = useState("");

  useEffect(() => {
    fetch("/api/visits")
      .then((res) => res.text())
      .then(setVisits)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const socket = io("/", { path: "/api/socket.io" });

    socket.on("visit", (ev) => {
      setVisits(ev as string);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>Hello, World!</h1>
      {visits} visits to this page so far!
    </div>
  );
}

export default App;
