/**
 * Return the date Date of the string dd/MM/yyyy
 * @param date dd/MM/yyyy
 * @returns Date object
 */
export const useDateStringToDate = (date: string): Date => {
  const dateElements = date.split("/");
  return new Date(+dateElements[2], +dateElements[1] - 1, +dateElements[0]);
};