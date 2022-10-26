export interface Survey {
  title: string;
  subtitle?: string;
  description?: string;
  author?: string;
  keywords?: string[];
  questions: ({
    type: "text";
    name: string;
    description?: string;
    placeholder?: string;
  } | {
    type: "textarea";
    name: string;
    description?: string;
    placeholder?: string;
  } | {
    type: "email";
    name: string;
    description?: string;
    placeholder?: string;
  } | {
    type: "radio";
    name: string;
    description?: string;
    values: string[];
  } | {
    type: "checkbox";
    name: string;
    description?: string;
  } | {
    type: "range";
    name: string;
    description?: string;
    min: number;
    max: number;
    value: number;
  })[];
}
