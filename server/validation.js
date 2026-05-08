export const ROLES = ['Admin', 'Member'];
export const STATUSES = ['To Do', 'In Progress', 'Done'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export function requireFields(body, fields) {
  const missing = fields.filter(field => {
    const value = body[field];
    return value === undefined || value === null || String(value).trim() === '';
  });
  if (missing.length) {
    return `${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} required.`;
  }
  return null;
}

export function cleanString(value, max = 255) {
  return String(value || '').trim().slice(0, max);
}

export function uniqueNumbers(values) {
  return [...new Set((values || []).map(Number).filter(Number.isInteger))];
}
