export interface ModelValue {
  value: any;
  isValid: boolean;
  validators?: Validator[];
}

export type Validator = "required" | "email" | "number";

export const errorMessageByValidatorName: Record<Validator, string> = {
  required: "This field is required",
  email: "Please enter an email address",
  number: "Please enter a number",
};
