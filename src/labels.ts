import type { Difficulty, Operator } from './types';

// Real math signs on screen; the engine keeps '-' as the subtraction operator
export const displayOperator = (op: Operator): string => (op === '-' ? '−' : op);

export const operatorOptions: { value: Operator; label: string }[] = [
  { value: '+', label: 'Addition' },
  { value: '-', label: 'Subtraktion' },
  { value: '×', label: 'Multiplikation' },
  { value: '÷', label: 'Division' },
];

export const difficultyLabels: Record<Difficulty, string> = {
  Easy: 'Lätt',
  Medium: 'Medel',
  Hard: 'Svår',
};

export const difficultyOptions = (Object.keys(difficultyLabels) as Difficulty[]).map((value) => ({
  value,
  label: difficultyLabels[value],
}));
