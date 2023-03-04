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
  specs: Specs;
}

export interface Specs {
  os: string;
  cpu: string;
  mem: number;
}
