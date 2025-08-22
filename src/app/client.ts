import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || "";

if (!clientId) {
  console.warn(
    "No client ID provided. Please set NEXT_PUBLIC_TEMPLATE_CLIENT_ID environment variable.",
  );
}

export const client = createThirdwebClient({
  clientId: clientId,
});
