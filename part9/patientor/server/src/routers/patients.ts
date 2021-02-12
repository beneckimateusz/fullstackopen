import express from 'express';
import patientService from '../services/patientService';
import { toNewEntry, toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveAll());
});

router.get('/:id', (req, res) => {
  const patient = patientService.get(req.params.id);

  patient ? res.send(patient) : res.sendStatus(404);
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.add(newPatient);

    res.status(201).send(addedPatient);
  } catch (err) {
    res.status(400).send({ error: (err as Error).message });
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(req.params.id, newEntry);

    res.status(201).send(addedEntry);
  } catch (err) {
    res.status(400).send({ error: (err as Error).message });
  }
});

export default router;
