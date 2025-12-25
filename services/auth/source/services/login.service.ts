import auth from "~/utilities/auth.js";
import type { Login } from "~/utilities/models.d.ts";

export default async function loginService(login: Login) {
  const result = await auth.api.signInEmail({
    body: login,
  });

  return {
    user: result.user,
    token: result.token,
  };
}
