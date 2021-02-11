import { v4 as uuidv4 } from 'uuid';
import patients from '../../data/patients';
import { NewPatient, NonSensitivePatient, Patient } from '../types';

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

const add = (newPatient: NewPatient): Patient => {
  const patient = newPatient as Patient;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  patient.id = uuidv4() as string;

  patients.push(patient);
  return patient;
};

export default { getAll, getNonSensitiveAll, add };
