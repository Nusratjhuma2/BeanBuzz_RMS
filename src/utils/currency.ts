/**
 * Format currency in BDT (Bangladeshi Taka)
 * @param amount - The amount to format (in taka)
 * @param showSymbol - Whether to show the BDT symbol (default: true)
 * @returns Formatted currency string
 */
export function formatBDT(amount: number, showSymbol: boolean = true): string {
  const formattedAmount = amount.toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return showSymbol ? `৳${formattedAmount}` : formattedAmount;
}

/**
 * Format currency in BDT for calculations (with decimals when needed)
 * @param amount - The amount to format (in taka)
 * @returns Formatted currency string with decimals if needed
 */
export function formatBDTWithDecimals(amount: number): string {
  const formattedAmount = amount.toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return `৳${formattedAmount}`;
}