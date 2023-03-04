export enum Verdict {
  Queued,
  Accepted,
  PartiallyAccepted,
  WrongAnswer,
  TimeLimitExceeded,
  MemoryLimitExceeded,
  RuntimeError,
  CompilationError,
  JudgeError,
  Pending,
  None = 255
}
