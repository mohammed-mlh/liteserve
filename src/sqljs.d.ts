declare module 'sql.js' {
  export interface BindParams {
    [key: string]: any;
    [index: number]: any;
  }

  export interface QueryExecResult {
    columns: string[];
    values: any[][];
  }

  export class Database {
    constructor(data?: ArrayLike<number> | Buffer);
    run(sql: string, params?: BindParams): void;
    exec(sql: string): QueryExecResult[];
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
  }

  export class Statement {
    bind(values?: BindParams): void;
    step(): boolean;
    get(params?: BindParams): any[];
    getColumnNames(): string[];
    reset(): void;
    freemem(): void;
    free(): boolean;
  }

  export default function initSqlJs(options?: {
    locateFile?: (file: string) => string;
  }): Promise<{
    Database: typeof Database;
    Statement: typeof Statement;
  }>;
}

