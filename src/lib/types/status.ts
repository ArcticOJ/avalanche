export type Status = {
  judges?: Record<string, Judge>;
  version: string;
}
export type JudgeInfo = {
  memory: number;
  os: string;
  parallelism: number;
  bootedSince: number;
}
export type Runtime = {
  id: string;
  name: string;
  compiler: string;
  arguments: string;
  version: string;
}
export type Judge = {
  alive: boolean;
  info?: JudgeInfo;
  runtimes?: Runtime[];
}