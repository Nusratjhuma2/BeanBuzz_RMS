/**
 * Format currency in BDT (Bangladeshi Taka)
 * @param amount - The amount to format (in paisa, so 100 = 1 BDT)
 * @param showSymbol - Whether to show the BDT symbol (default: true)
 * @returns Formatted currency string
 */
export function formatBDT(amount: number, showSymbol: boolean = true): string {
  // Convert from paisa to taka (divide by 100) and format with 2 decimal places
  const formattedAmount = (amount / 100).toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return showSymbol ? `৳${formattedAmount}` : formattedAmount;
}

/**
 * Format currency in BDT without decimals for whole amounts
 * @param amount - The amount to format (in paisa)
 * @returns Formatted currency string without decimals
 */
export function formatBDTSimple(amount: number): string {
  const taka = Math.round(amount / 100);
  return `৳${taka.toLocaleString('en-BD')}`;
}