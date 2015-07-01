declare module 'aurelia-path' {
  export function relativeToFile(name: string, file: string): string;
  export function join(path1: string, path2: string): string;
  export function buildQueryString(a: string, traditional?: boolean): string;
}