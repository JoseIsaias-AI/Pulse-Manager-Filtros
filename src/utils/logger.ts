export function log(...args: unknown[]): void {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...args);
  }
}
