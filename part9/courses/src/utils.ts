/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discrimiminated union member: ${JSON.stringify(value)}`
  );
};
