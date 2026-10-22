// Node 24 runtime API, absent from the project's Node 20 type definitions.
declare module "node:sqlite" {
  type Value = string | number | null;
  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): {
      run(...values: Value[]): { changes: number | bigint };
      get(...values: Value[]): Record<string, Value> | undefined;
      all(...values: Value[]): Record<string, Value>[];
    };
  }
}
