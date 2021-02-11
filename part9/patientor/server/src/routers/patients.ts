import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveAll());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.add(newPatient);

    res.status(201).send(addedPatient);
  } catch (err) {
    res.status(400).send((err as Error).message);
  }
});

export default router;