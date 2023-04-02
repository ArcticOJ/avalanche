export interface Health {
  judges: JudgeInfo[];
  uptime: number;
  version: number;
}

export interface JudgeInfo {
  name: string;
  isAlive: true;
  latency: number;
  uptime: number;
  version: string;
  os: string;
  cpu: string;
  mem: number;
  runtimes: Array<Runtime>;
}

export interface Runtime {
  name: string;
  key: string;
  command: string;
  arguments: string;
  version: string;
}
