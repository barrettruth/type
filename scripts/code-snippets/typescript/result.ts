type Result<T> = {
  ok: boolean;
  value: T | null;
};

const ready: Result<number> = { ok: true, value: 1 };
