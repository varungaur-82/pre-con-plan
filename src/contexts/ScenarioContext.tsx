import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ScenarioParameters {
  deliveryMethod: string;
  designAssistEnvelope: boolean;
  designAssistMEP: boolean;
  gmpTiming: string;
  structuralSteelTiming: number;
  switchgearTiming: number;
  roofingTiming: number;
  elevatorTiming: number;
  chillersTiming: number;
  curtainWallTiming: number;
  hvacTiming: number;
  precastTiming: number;
}

interface ScenarioContextType {
  parameters: ScenarioParameters;
  updateParameter: <K extends keyof ScenarioParameters>(
    key: K,
    value: ScenarioParameters[K]
  ) => void;
  resetParameters: () => void;
}

const defaultParameters: ScenarioParameters = {
  deliveryMethod: "design-bid-build",
  designAssistEnvelope: false,
  designAssistMEP: false,
  gmpTiming: "50",
  structuralSteelTiming: 50,
  switchgearTiming: 50,
  roofingTiming: 50,
  elevatorTiming: 50,
  chillersTiming: 50,
  curtainWallTiming: 50,
  hvacTiming: 50,
  precastTiming: 50,
};

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [parameters, setParameters] = useState<ScenarioParameters>(defaultParameters);

  const updateParameter = <K extends keyof ScenarioParameters>(
    key: K,
    value: ScenarioParameters[K]
  ) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  const resetParameters = () => {
    setParameters(defaultParameters);
  };

  return (
    <ScenarioContext.Provider value={{ parameters, updateParameter, resetParameters }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error("useScenario must be used within a ScenarioProvider");
  }
  return context;
}
