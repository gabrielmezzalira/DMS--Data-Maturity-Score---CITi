import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { initialState, quizReducer, type QuizAction, type QuizState } from "./quizReducer";

type QuizContextValue = {
  state: QuizState;
  dispatch: Dispatch<QuizAction>;
};

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  return <QuizContext.Provider value={{ state, dispatch }}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within a QuizProvider");
  return ctx;
}
