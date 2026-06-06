export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export type ApiErrorCode = "server" | "network" | "validation";

export class ApiError extends Error {
  code: ApiErrorCode;
  detail?: string;
  constructor(code: ApiErrorCode, detail?: string) {
    super(detail || code);
    this.code = code;
    this.detail = detail;
  }
}

async function readErrorDetail(res: Response): Promise<string | undefined> {
  try {
    const data = await res.json();
    return typeof data?.detail === "string" ? data.detail : undefined;
  } catch {
    return undefined;
  }
}

/** POST multipart/form-data and expect a binary file back (Blob). */
export async function postFile(
  endpoint: string,
  formData: FormData
): Promise<Blob> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new ApiError("network");
  }
  if (!res.ok) {
    const detail = await readErrorDetail(res);
    throw new ApiError("server", detail);
  }
  return res.blob();
}

/** POST multipart/form-data and expect a JSON response. */
export async function postJson<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new ApiError("network");
  }
  if (!res.ok) {
    const detail = await readErrorDetail(res);
    throw new ApiError("server", detail);
  }
  return res.json() as Promise<T>;
}

/** Trigger a browser download for a Blob. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
