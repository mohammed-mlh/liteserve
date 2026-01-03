export type QueryResult = {
  query: string;
  type: 'read' | 'write';
  executionTime: number;
  success: boolean;
  error?: string;
  rowsAffected?: number;
  lastInsertRowid?: number;
}