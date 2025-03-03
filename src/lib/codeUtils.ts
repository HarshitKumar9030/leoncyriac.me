import crypto from 'crypto';

// Helper function to generate verification hash
export function generateVerificationHash(data: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex')
    .toUpperCase();
}

// Helper function to generate redeem codes (admin use only)
export function generateRedeemCode(type: 'SM' | 'MD' | 'LG' | 'XL', secret: string): string {
  const prefix = 'BLOG';
  
  // Type section: First two chars represent type, last two are random
  const typeSection = type + generateRandomString(2);
  
  // Time section: Encode current time (days since epoch) in base36
  const currentDays = Math.floor(Date.now() / 86400000).toString(36).toUpperCase().padStart(4, '0');
  const timeSection = currentDays.substring(0, 4);
  
  // Data to verify
  const dataToVerify = `${prefix}-${typeSection}-${timeSection}`;
  
  // Generate verification hash
  const verificationSection = generateVerificationHash(dataToVerify, secret).substring(0, 4);
  
  return `${prefix}-${typeSection}-${timeSection}-${verificationSection}`;
}

// Helper function to generate random string
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}