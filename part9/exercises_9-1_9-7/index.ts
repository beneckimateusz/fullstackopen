import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises, Result } from './exerciseCalculator';

interface ApiError {
  error: string;
}

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  try {
    if (isNaN(height) || isNaN(weight)) {
      throw new Error('malformatted parameters');
    }

    const result = { height, weight, bmi: calculateBmi(height, weight) };
    res.send(result);
  } catch (err) {
    const error: ApiError = { error: (err as Error).message };
    res.status(400).send(error);
  }
});

// sure as hell it's not done properly
app.post('/exercises', (req, res) => {
  const dailyExercises = req.body.dailyExercises;
  const target = req.body.target;

  try {
    if (!dailyExercises || !target) {
      throw new Error('parameters missing');
    }

    if (
      Array.isArray(dailyExercises) &&
      dailyExercises.every((de) => !isNaN(de)) &&
      !isNaN(target)
    ) {
      const result: Result = calculateExercises(
        dailyExercises.map(de => Number(de)),
        Number(target)
      );
      res.send(result);
    } else {
      throw new Error('malformatted parameters');
    }
  } catch (err) {
    const error: ApiError = { error: (err as Error).message };
    res.status(400).send(error);
  }
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
