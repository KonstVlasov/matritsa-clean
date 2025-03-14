export function displayError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (Array.isArray(error)) {
    return error.map(item => (isFieldError(item) ? item.message : String(item))).join('; ');
  }

  if (isFieldError(error)) {
    return error.message;
  }

  if (isServerError(error)) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }

  return String(error);
}

export function isServerError(value: unknown): value is { name: string; message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

export function isFieldError(value: unknown): value is { field: string; message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'field' in value &&
    typeof value.field === 'string' &&
    'message' in value &&
    typeof value.message === 'string'
  );
}
