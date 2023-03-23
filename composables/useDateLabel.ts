/**
 * /**
 * Return the date day : Today, Monday, etc.
 * @param date dd-MM-yyyy or dd/MM/yyy
 * @param separator How the incoming date is formatted => Slash (/) or Dash (-)
 * @param format How to format the incoming date = Today, 22/03/2023, etc.
 * @returns string
 */
export const useDateLabel = (
  date: string,
  separator: DateSeparator = DateSeparator.Slash,
  format: DateLabelFormat = DateLabelFormat.Weekday
): string => {
  if (
    date &&
    separator === DateSeparator.Dash &&
    format === DateLabelFormat.Weekday
  ) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
    };
    const [year, month, day] = date.split("-");
    const dateToFormat = new Date(+year, +month - 1, +day);

    if (dateToFormat.toDateString() === new Date().toDateString()) {
      return "Today";
    }
    return dateToFormat.toLocaleDateString("en-US", options);
  } else if (
    date &&
    separator === DateSeparator.Slash &&
    format === DateLabelFormat.Weekday
  ) {
    const [day, month, year] = date.split("/");
    const dateToFormat = new Date(+year, +month - 1, +day);

    if (dateToFormat.toDateString() === new Date().toDateString()) {
      return "Today";
    }
    return date;
  }
  return date;
};

export enum DateLabelFormat {
  Weekday = "Weekday",
}

export enum DateSeparator {
  Slash = "Slash",
  Dash = "Dash",
}
