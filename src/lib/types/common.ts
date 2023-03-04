export interface RestError {
  code: number;
  message: string;
}

export type WorkerEvent = {
  type: 'compile';
  data: CompileRequest;
} | {
  type: 'init' | 'abort'
}

export interface CompileRequest {
  args?: string[];
  input: string;
  content: string;
}

export type WorkerMessage = {
  event: 'ready'
} | {
  event: 'output';
  data: string;
} | {
  event: 'compileStart' | 'compileEnd';
  timestamp: number;
};
