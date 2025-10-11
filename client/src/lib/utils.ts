import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format money as currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format phone number
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the input is valid
  if (cleaned.length !== 10) {
    return phoneNumber;
  }
  
  // Format as (XXX) XXX-XXXX
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

// Scroll to element
export function scrollToElement(elementId: string, offset: number = 0): void {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Calculate energy savings
export function calculateEnergySavings(
  squareFootage: number, 
  systemAge: string, 
  efficiency: number
): {
  currentCost: number;
  newCost: number;
  savings: number;
  roi: number;
} {
  let currentEfficiency = 0;
  
  // Estimate current efficiency based on age
  switch (systemAge) {
    case '0-5':
      currentEfficiency = 0.85;
      break;
    case '6-10':
      currentEfficiency = 0.78;
      break;
    case '11-15':
      currentEfficiency = 0.70;
      break;
    case '16+':
      currentEfficiency = 0.60;
      break;
    default:
      currentEfficiency = 0.65;
  }
  
  // Base calculation for per square foot energy costs
  const baseCostPerSqFt = 1.2;
  
  // Calculate costs
  const currentCost = Math.round(squareFootage * baseCostPerSqFt * (1 / currentEfficiency));
  const newCost = Math.round(squareFootage * baseCostPerSqFt * (1 / efficiency));
  const savings = currentCost - newCost;
  
  // Estimate system cost for ROI calculation
  const estimatedSystemCost = squareFootage < 2000 ? 6500 : 8500;
  
  // ROI in years (rounded to 1 decimal place)
  const roi = Math.round((estimatedSystemCost / savings) * 10) / 10;
  
  return {
    currentCost,
    newCost,
    savings,
    roi
  };
}
