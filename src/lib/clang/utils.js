import {AssertError} from './errors.js';

export function readStr(u8, o, len = -1) {
  let str = '';
  let end = u8.length;
  if (len !== -1) end = o + len;
  for (let i = o; i < end && u8[i] !== 0; ++i) str += String.fromCharCode(u8[i]);
  return str;
}

export function assert(cond) {
  if (!cond) {
    throw new AssertError('assertion failed.');
  }
}

export function getInstance(module, imports) {
  return WebAssembly.instantiate(module, imports);
}

export function getImportObject(obj, names) {
  const result = {};
  for (const name of names) {
    result[name] = obj[name].bind(obj);
  }
  return result;
}
