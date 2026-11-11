export type ServiceResult<T = void> =
  | { ok: true; data: T; message: string }
  | { ok: false; message: string };

export function ok<T>(data: T, message = ""): ServiceResult<T> {
  return { ok: true, data, message };
}

export function fail<T = never>(message: string): ServiceResult<T> {
  return { ok: false, message };
}

export type ActionResult = ServiceResult<void>;
