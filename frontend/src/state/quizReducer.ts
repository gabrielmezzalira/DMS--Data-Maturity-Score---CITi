import { QUESTIONS } from "../data/questions";
import type { ComputedResult, IntakeData } from "../types/quiz";

export type Screen = "intake" | "quiz" | "result";

export type QuizState = {
  screen: Screen;
  currentQuestionIndex: number;
  answers: Partial<Record<string, 1 | 2 | 3 | 4>>;
  intake: IntakeData | null;
  submissionStatus: "idle" | "submitting" | "success" | "error";
  result: ComputedResult | null;
};

export const initialState: QuizState = {
  screen: "intake",
  currentQuestionIndex: 0,
  answers: {},
  intake: null,
  submissionStatus: "idle",
  result: null,
};

export type QuizAction =
  | { type: "SUBMIT_INTAKE"; payload: IntakeData }
  | { type: "ANSWER"; questionId: string; level: 1 | 2 | 3 | 4 }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GO_TO"; index: number }
  | { type: "FINISH_QUIZ" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS"; result: ComputedResult }
  | { type: "SUBMIT_ERROR"; result: ComputedResult }
  | { type: "RESTART" };

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SUBMIT_INTAKE":
      return { ...state, intake: action.payload, screen: "quiz", currentQuestionIndex: 0 };
    case "ANSWER":
      return { ...state, answers: { ...state.answers, [action.questionId]: action.level } };
    case "NEXT":
      return { ...state, currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, QUESTIONS.length - 1) };
    case "PREV":
      return { ...state, currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0) };
    case "GO_TO":
      return { ...state, currentQuestionIndex: action.index };
    case "FINISH_QUIZ":
      return { ...state, screen: "result" };
    case "SUBMIT_START":
      return { ...state, submissionStatus: "submitting" };
    case "SUBMIT_SUCCESS":
      return { ...state, submissionStatus: "success", result: action.result };
    case "SUBMIT_ERROR":
      return { ...state, submissionStatus: "error", result: action.result };
    case "RESTART":
      return initialState;
    default:
      return state;
  }
}
