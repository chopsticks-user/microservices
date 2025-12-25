export interface Login {
  email: string;
  password: string;
  rememberMe: boolean;
  callbackUrl: URL;
}

export interface SignUp {
  name: string;
  email: string;
  password: string;
  image: string;
  callbackUrl: URL;
}
