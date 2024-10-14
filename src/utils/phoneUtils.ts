export function formatPhone(value: string) {
    const cleaned = value.replace(/\D/g, "");
  
    if (cleaned.length < 10) return cleaned;
  
    const match = cleaned.match(/(\d{2})(\d{5})(\d{4})/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  
    const match2 = cleaned.match(/(\d{2})(\d{4})(\d{4})/);
    if (match2) {
      return `(${match2[1]}) ${match2[2]}-${match2[3]}`;
    }
  
    return cleaned;
}