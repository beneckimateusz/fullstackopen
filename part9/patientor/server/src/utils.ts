/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gender, NewEntry, NewPatient } from './types';

const isString = (obj: any): obj is string => {
  return typeof obj === 'string' || obj instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (obj: any): obj is Gender => {
  return Object.values(Gender).includes(obj);
};

const isEntryType = (type: string): boolean => {
  return ['OccupationalHealthcare', 'Hospital', 'HealthCheck'].includes(type);
};

const parseEntryType = (obj: any): string => {
  if (!obj || !isString(obj) || !isEntryType(obj)) {
    throw new Error(`Incorrect or missing entry type: ${obj}`);
  }

  return obj;
};

const parseString = (obj: any, propertyName: string): string => {
  if (!obj || !isString(obj)) {
    throw new Error(`Incorrect or missing ${propertyName}: ${obj}`);
  }

  return obj;
};

const parseDate = (obj: any, propertyName: string): string => {
  if (!obj || !isString(obj) || !isDate(obj)) {
    throw new Error(`Incorrect or missing ${propertyName}: ${obj}`);
  }

  return obj;
};

const parseGender = (obj: any): Gender => {
  if (!obj || !isGender(obj)) {
    throw new Error(`Incorrect or missing gender: ${obj}`);
  }

  return obj;
};

export const toNewPatient = (object: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(object.name, 'name'),
    dateOfBirth: parseDate(object.dateOfBirth, 'dateOfBirth'),
    ssn: parseString(object.ssn, 'ssn'),
    gender: parseGender(object.gender),
    occupation: parseString(object.occupation, 'occupation'),
    entries: [],
  };

  return newPatient;
};

export const toNewEntry = (object: any): NewEntry => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const newEntry: NewEntry = {
    type: parseEntryType(object.type),
    date: parseDate(object.date, 'date'),
    description: parseString(object.description, 'description'),
    specialist: parseString(object.specialist, 'specialist'),
    ...object,
  };

  return newEntry;
};
