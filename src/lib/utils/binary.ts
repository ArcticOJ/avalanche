export function lowerBound<T1, T2>(arr: T1[], x: T2, cmp: (v: T1, x: T2) => number): T1 {
  let l = 0,
    r = arr.length - 1;
  while (l <= r) {
    const pivot = Math.floor((l + r) / 2);
    if (cmp(arr[pivot], x) <= 0)
      l = pivot + 1;
    else
      r = pivot - 1;
  }
  return arr[l - 1];
}

export function binarySearch<T1, T2>(arr: T1[], x: T2, cmp: (v: T1, x: T2) => number): T1 {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    const pivot = Math.floor((l + r) / 2);
    if (cmp(arr[pivot], x) === 0) return arr[pivot];
    else if (cmp(arr[pivot], x) < 0)
      l = pivot + 1;
    else
      r = pivot - 1;
  }
  return null;
}
