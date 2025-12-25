import auth from "~/utilities/auth.js";
import type { Login, SignUp } from "~/models/auth.model.ts";

export async function loginService(login: Login) {
  const result = await auth.api.signInEmail({
    body: login,
  });

  return {
    user: result.user,
    token: result.token,
  };
}

export async function signupService(signup: SignUp) {
  const result = await auth.api.signUpEmail({
    body: signup,
  });

  return {
    user: result.user,
    token: result.token,
  };
}

export async function logoutService(headers: Record<string, string>) {
  return auth.api.signOut({
    headers,
  });
}

export async function refreshService(headers: Record<string, string>) {
  const tokenResult = await auth.api.getToken({
    headers,
  });

  return {
    token: tokenResult.token,
  };
}
