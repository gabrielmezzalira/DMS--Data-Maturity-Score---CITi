import { useEffect, useRef } from "react";
import { NavFooter } from "../components/NavFooter";
import { ProgressBar } from "../components/ProgressBar";
import { PillarBadge } from "../components/PillarBadge";
import { QuestionCard } from "../components/QuestionCard";
import { PILLARS, QUESTIONS } from "../data/questions";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { useQuiz } from "../state/QuizContext";

export function QuestionScreen() {
  const { state, dispatch } = useQuiz();
  const { currentQuestionIndex, answers } = state;
  const question = QUESTIONS[currentQuestionIndex];
  const pillar = PILLARS.find((p) => p.id === question.pillar)!;
  const selectedLevel = answers[question.id];
  const isLast = currentQuestionIndex === QUESTIONS.length - 1;
  const canGoNext = selectedLevel !== undefined;
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearAutoAdvance() {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }

  function goNext() {
    clearAutoAdvance();
    if (isLast) {
      dispatch({ type: "FINISH_QUIZ" });
    } else {
      dispatch({ type: "NEXT" });
    }
  }

  function goPrev() {
    clearAutoAdvance();
    dispatch({ type: "PREV" });
  }

  function selectLevel(level: 1 | 2 | 3 | 4) {
    dispatch({ type: "ANSWER", questionId: question.id, level });
    clearAutoAdvance();
    if (!isLast) {
      autoAdvanceTimer.current = setTimeout(() => {
        dispatch({ type: "NEXT" });
      }, 400);
    }
  }

  useEffect(() => clearAutoAdvance, [currentQuestionIndex]);

  useKeyboardNav({
    onNext: goNext,
    onPrev: goPrev,
    onSelect: selectLevel,
    canGoNext,
  });

  return (
    <div className="ambient-glow screen-fade mx-auto flex min-h-[100svh] max-w-[820px] flex-col justify-center gap-8 px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <ProgressBar
            pillars={PILLARS}
            currentPillarId={question.pillar}
            percentComplete={Math.round((currentQuestionIndex / QUESTIONS.length) * 100)}
          />
        </div>
        <PillarBadge label={pillar.label} />
      </div>

      <QuestionCard question={question} selectedLevel={selectedLevel} onSelect={selectLevel} />

      <NavFooter
        onPrev={goPrev}
        onNext={goNext}
        canGoBack={currentQuestionIndex > 0}
        canGoNext={canGoNext}
        isLast={isLast}
      />
    </div>
  );
}
