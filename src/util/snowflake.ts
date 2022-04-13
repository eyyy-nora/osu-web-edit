let counter = 0;

export function snowflake() {
  return Date.now().toString(16).padStart(12, "0")
    + (counter++).toString(16).padStart(2, "0")
    + ((0 | Math.random() * 0xFF)).toString(16).padStart(2, "0");
}
