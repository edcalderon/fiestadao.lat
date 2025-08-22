import { createThirdwebClient } from "thirdweb";

// Get the client ID from environment variables
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

// Throw an error during build time if the client ID is not set
if (process.env.NODE_ENV === 'production' && !clientId) {
  throw new Error(
    'Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID environment variable.\n' +
    'Please set it in your .env.local file or deployment environment.\n' +
    'Get your client ID from https://thirdweb.com/dashboard' 
  );
}

// In development, use a dummy client ID if not set
const safeClientId = process.env.NODE_ENV === 'development' && !clientId 
  ? 'development-client-id' 
  : clientId;

if (!safeClientId) {
  throw new Error('Failed to initialize Thirdweb client');
}

export const client = createThirdwebClient({
  clientId: safeClientId,
});
