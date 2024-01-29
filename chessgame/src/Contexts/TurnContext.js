import React, { useContext, useState } from "react";

export const TurnContext = React.createContext();
export const TurnUpdateContext = React.createContext();

export function useTurn() {
  return [useContext(TurnContext), useContext(TurnUpdateContext)];
}

export default function TurnProvider({ children }) {
  const [turn, setTurn] = useState("white");

  const toggleTurn = () => {
    console.log("updating turn");
    setTurn((prevTurn) => (prevTurn === "white" ? "black" : "white"));
  };

  return (
    <TurnContext.Provider value={turn}>
      <TurnUpdateContext.Provider value={toggleTurn}>
        {children}
      </TurnUpdateContext.Provider>
    </TurnContext.Provider>
  );
}
