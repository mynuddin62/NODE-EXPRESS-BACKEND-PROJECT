export function hasUpperCase(str: string) : boolean {
  return /[A-Z]/.test(str);
}

export function toDateOnly(value: Date | string) : string {
  return new Date(value).toISOString().split("T")[0] || "";
}


