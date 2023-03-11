export class ProcExit extends Error {
  constructor(code) {
    super(`Process exited with code ${code}.`);
    this.code = code;
  }
}

export class MemoryLimitExceeded extends Error {
  constructor(lim) {
    super(`Memory limit exceeded, maximum memory is ${lim} bytes.`);
  }
}

export class NotImplemented extends Error {
  constructor(modname, fieldname) {
    super(`${modname}.${fieldname} not implemented.`);
  }
}

export class AbortError extends Error {
  constructor(msg = 'abort') {
    super(msg);
  }
}

export class AssertError extends Error {
  constructor(msg) {
    super(msg);
  }
}
