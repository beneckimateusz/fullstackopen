type BMICategory =
  | 'Very severely underweight'
  | 'Severely underweight'
  | 'Underweight'
  | 'Normal (healthy weight)'
  | 'Overweight'
  | 'Obese Class I | (Moderately obese)'
  | 'Obese Class II | (Severely obese)'
  | 'Obese Class III | (Very severely obese)';

/**
 *
 * @param height Person's height in centimeters
 * @param weight Person's weight in kilograms
 */
export const calculateBmi = (height: number, weight: number): BMICategory => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  if (bmi < 15) return 'Very severely underweight';
  else if (bmi < 16) return 'Severely underweight';
  else if (bmi < 18.5) return 'Underweight';
  else if (bmi < 25) return 'Normal (healthy weight)';
  else if (bmi < 30) return 'Overweight';
  else if (bmi < 35) return 'Obese Class I | (Moderately obese)';
  else if (bmi < 40) return 'Obese Class II | (Severely obese)';
  else return 'Obese Class III | (Very severely obese)';
};

try {
  const height = Number(process.argv[2]);
  const weight = Number(process.argv[3]);
  if (isNaN(height) || isNaN(weight)) {
    throw new Error("Usage: npm run calculateBmi height weight");
  }

  console.log(calculateBmi(height, weight));
} catch (err) {
  console.error((err as Error).message);
}