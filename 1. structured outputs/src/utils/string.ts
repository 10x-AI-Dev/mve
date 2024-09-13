export function replaceTokens(template: string, values: { [key: string]: string }): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, token) => {
    return values[token] || match; // Replace with value or leave token if not found
  });
}
