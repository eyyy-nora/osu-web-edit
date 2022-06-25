export function issueTemplater(error: string, category: string, type: string): Object {
  return {
    "error": error,
    "category": category,
    "type": type,
  }
}
