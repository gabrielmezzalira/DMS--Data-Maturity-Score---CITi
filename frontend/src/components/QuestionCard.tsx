import type { Question } from "../types/quiz";
import { OptionCard } from "./OptionCard";

type QuestionCardProps = {
  question: Question;
  selectedLevel?: 1 | 2 | 3 | 4;
  onSelect: (level: 1 | 2 | 3 | 4) => void;
};

export function QuestionCard({ question, selectedLevel, onSelect }: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--text-primary)] sm:text-[30px]">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-sm text-[color:var(--text-muted)]">{question.subtitle}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {question.options.map((label, i) => {
          const level = (i + 1) as 1 | 2 | 3 | 4;
          return (
            <OptionCard
              key={level}
              level={level}
              label={label}
              selected={selectedLevel === level}
              onClick={() => onSelect(level)}
            />
          );
        })}
      </div>
    </div>
  );
}
