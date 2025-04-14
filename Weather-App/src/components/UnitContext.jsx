import React, { createContext, useState, useEffect } from "react";

export const UnitContext = createContext();
export const UnitProvider = ({ children }) => {
  const [unit, setUnit] = useState("metric");

  useEffect(() => {
    const savedUnit = localStorage.getItem("unit");
    if (savedUnit) {
      setUnit(savedUnit);
    }
  }, []);

  const changeUnit = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem("unit", newUnit);
  };

  return (
    <UnitContext.Provider value={{ unit, changeUnit }}>
      {children}
    </UnitContext.Provider>
  );
};