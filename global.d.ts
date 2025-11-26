// global.d.ts

/**
 * This declaration tells TypeScript that any module ending in '.css' is a valid module
 * even though it doesn't have a corresponding type declaration file.
 * This resolves the "Cannot find module or type declarations" error for CSS imports.
 */
declare module '*.css' {
  // You can specify a type here, but 'any' or an empty object is usually fine
  // since you don't typically access an export from a CSS import.
  const content: any;
  export default content;
}