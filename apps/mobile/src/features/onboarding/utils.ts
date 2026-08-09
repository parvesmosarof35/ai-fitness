export const ftInToCm = (feet: number, inches: number): number => {
  return (feet * 12 + inches) * 2.54;
};

export const lbsToKg = (lbs: number): number => {
  return lbs * 0.453592;
};
