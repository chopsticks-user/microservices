import auth from "~/utilities/auth.js";

export default async function refreshService(headers: Record<string, string>) {
  const tokenResult = await auth.api.getToken({
    headers,
  });

  return {
    token: tokenResult.token,
  };
}
