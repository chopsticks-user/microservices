import auth from "~/utilities/auth.js";
import type { SignUp } from "~/utilities/models.d.ts";

export default async function signupService(signup: SignUp) {
  const result = await auth.api.signUpEmail({
    body: signup,
  });

  return {
    user: result.user,
    token: result.token,
  };
}
