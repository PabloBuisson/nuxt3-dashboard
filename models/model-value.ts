export interface ModelValue {
  value: any;
  isValid: boolean;
  validators?: Validator[];
}

export type Validator = "required" | "email" | "number";

export const errorMessageByValidatorName: Record<Validator, string> = {
  required: "This field is required",
  email: "This field must be an email",
  number: "This field must be a number",
};
