type RatingValue = 1 | 2 | 3;
type RatingDescription = 'miserable' | 'kinda good' | 'perfect';

interface Rating {
  value: RatingValue;
  description: RatingDescription;
}

export interface Result {
  periodLength: number;
  trainingDays: number;
  hoursAverageTarget: number;
  hoursAverage: number;
  success: boolean;
  rating: RatingValue;
  ratingDescription: RatingDescription;
}

const getRating = (average: number, averageTarget: number): Rating => {
  const ratio = average / averageTarget;

  if (ratio <= 0.5) return { value: 1, description: 'miserable' };
  if (ratio < 1) return { value: 2, description: 'kinda good' };
  return { value: 3, description: 'perfect' };
};

export const calculateExercises = (
  exerciseDurations: number[],
  hoursAverageTarget: number
): Result => {
  const periodLength = exerciseDurations.length;
  const hoursAverage = exerciseDurations.reduce((a, b) => a + b) / periodLength;
  const rating = getRating(hoursAverage, hoursAverageTarget);

  return {
    periodLength,
    trainingDays: exerciseDurations.filter(d => d > 0).length,
    hoursAverageTarget,
    hoursAverage,
    success: rating.value === 3,
    rating: rating.value,
    ratingDescription: rating.description,
  };
};

try {
  const args = process.argv.slice(2).map(n => Number(n));
  if (args.some(n => isNaN(n))) {
    throw new Error("Usage: npm run calculateExercises target duration...");
  }

  const [target, ...durations] = args;
  console.log(calculateExercises(durations, target));
} catch (err) {
  console.error((err as Error).message);
}
