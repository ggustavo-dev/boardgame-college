import { useState } from 'react';
import { Dices } from 'lucide-react';

type DiceRollerProps = {
  onRoll: (value: number) => void;
  disabled: boolean;
};

const DICE_FACES = [
  [
    [false, false, false],
    [false, true, false],
    [false, false, false],
  ],
  [
    [true, false, false],
    [false, false, false],
    [false, false, true],
  ],
  [
    [true, false, false],
    [false, true, false],
    [false, false, true],
  ],
  [
    [true, false, true],
    [false, false, false],
    [true, false, true],
  ],
  [
    [true, false, true],
    [false, true, false],
    [true, false, true],
  ],
  [
    [true, false, true],
    [true, false, true],
    [true, false, true],
  ],
];

type DiceDisplayProps = {
  value: number;
  isRolling: boolean;
};

function DiceDisplay({ value, isRolling }: DiceDisplayProps) {
  const face = DICE_FACES[value - 1] || DICE_FACES[0];

  return (
    <div
      className={`w-20 h-20 bg-white rounded-xl shadow-lg p-3 ${
        isRolling ? 'animate-bounce' : ''
      }`}
    >
      <div className="grid grid-cols-3 gap-1 h-full">
        {face.map((row, rowIndex) =>
          row.map((dot, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="flex items-center justify-center"
            >
              {dot && (
                <div className="w-2.5 h-2.5 bg-gray-800 rounded-full" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function DiceRoller({ onRoll, disabled }: DiceRollerProps) {
  const [currentValue, setCurrentValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    if (disabled || isRolling) return;

    setIsRolling(true);

    let iterations = 0;
    const maxIterations = 15;

    const interval = setInterval(() => {
      setCurrentValue(Math.floor(Math.random() * 6) + 1);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setCurrentValue(finalValue);
        setIsRolling(false);
        onRoll(finalValue);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <DiceDisplay value={currentValue} isRolling={isRolling} />

      <button
        onClick={handleRoll}
        disabled={disabled || isRolling}
        className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <Dices className="w-5 h-5" />
        {isRolling ? 'Rolando...' : 'Rolar Dado'}
      </button>
    </div>
  );
}
