import { useAlertStore, type AlertType } from "@/src/state/alertStore";

function push(type: AlertType, title: string, message?: string) {
  const text = message ? `${title}: ${message}` : title;
  return useAlertStore.getState().push({ type, message: text });
}

export function toastSuccess(title: string, message?: string) {
  return push("success", title, message);
}

export function toastError(title: string, message?: string) {
  return push("error", title, message);
}

export function toastInfo(title: string, message?: string) {
  return push("info", title, message);
}

export function toastWarning(title: string, message?: string) {
  return push("warning", title, message);
}

