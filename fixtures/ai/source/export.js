export function a() { return 1 }
export function b() { return 0 }
export const c = 'asdf';
const d = 1234;

// @deprecated Use the named exports instead.
const toExport = { a, b, c };

export default toExport;
