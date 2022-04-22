import { Event} from "@netlify/functions/dist/function/event";

export type ParameterDefinition = {
  [key: string]: "string" | "number" | "boolean";
}

export type ParsedParameters<T extends ParameterDefinition> = {
  [Key in keyof T]:
    T[Key] extends "string" ? string :
    T[Key] extends "number" ? number :
    T[Key] extends "boolean" ? boolean : never;
}

export function params<T extends ParameterDefinition>(
  schema: T,
  event: Event
): ParsedParameters<T> {
  const parsed = {} as any;
  for (const [key, typeHint] of Object.entries(schema)) {
    const stringValue = (event.queryStringParameters ?? {})[key];
    switch (typeHint) {
      case "number":
        if (!stringValue) throw new Error(`Query parameter ${key} is required!`);
        const num = parseInt(stringValue, 10);
        if (!num || isNaN(num)) throw new Error(`Query parameter ${key} is of type ${typeHint}!`);
        parsed[key] = num;
        break;
      case "boolean":
        parsed[key] = !!stringValue && stringValue !== "false";
        break;
      case "string":
        if (!stringValue) throw new Error(`Query parameter ${key} is required!`);
        parsed[key] = stringValue;
    }
  }
  return parsed;
}
