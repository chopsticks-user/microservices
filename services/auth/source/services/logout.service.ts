import auth from "~/utilities/auth.js";

export default async function logoutService(headers: Record<string, string>) {
  return auth.api.signOut({
    headers,
  });
}
