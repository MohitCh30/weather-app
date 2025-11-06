declare module 'sql.js' {
  export default function initSqlJs(config?: any): Promise<any>;

  export interface Database {
    run(query: string, params?: any[]): void;
    prepare(query: string): any;
    export(): Uint8Array;
    free(): void;
  }
}
