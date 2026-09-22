import { IntakeScreen } from "./screens/IntakeScreen";
import { QuestionScreen } from "./screens/QuestionScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { QuizProvider, useQuiz } from "./state/QuizContext";

function Router() {
  const { state } = useQuiz();

  switch (state.screen) {
    case "intake":
      return <IntakeScreen />;
    case "quiz":
      return <QuestionScreen />;
    case "result":
      return <ResultScreen />;
  }
}

export default function App() {
  return (
    <QuizProvider>
      <Router />
    </QuizProvider>
  );
}
