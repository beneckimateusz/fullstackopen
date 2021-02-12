import { v4 as uuidv4 } from 'uuid';
import patients from '../../data/patients';
import {
  Entry,
  NewEntry,
  NewPatient,
  NonSensitivePatient,
  Patient
} from '../types';

const getAll = (): Patient[] => {
  return patients;
};

const getNonSensitiveAll = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const get = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const add = (newPatient: NewPatient): Patient => {
  const patient = newPatient as Patient;
  patient.id = uuidv4();

  patients.push(patient);
  return patient;
};

const addEntry = (patientId: string, newEntry: NewEntry): Entry => {
  const entry = newEntry as Entry;
  entry.id = uuidv4();

  patients.find(p => p.id === patientId)?.entries.push(entry);
  return entry;
};

export default { getAll, getNonSensitiveAll, get, add, addEntry };
