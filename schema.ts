export interface Survey {
  title: string;
  questions: ({
    type: "text";
    name: string;
  } | {
    type: "textarea";
    name: string;
  } | {
    type: "email";
    name: string;
  } | {
    type: "radio";
    name: string;
    values: string[];
  } | {
    type: "checkbox";
    name: string;
  } | {
    type: "range";
    name: string;
    min: number;
    max: number;
    value: number;
  })[];
}
