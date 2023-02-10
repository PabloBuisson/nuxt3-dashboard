interface ModelValue {
  value: any;
  isValid: boolean;
  validators?: Validator[]
}

type Validator = "required" | "email" | "number";