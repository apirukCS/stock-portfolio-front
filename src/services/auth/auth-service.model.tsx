export interface LoginResponse {
  user_id: number;
  username: string;
  access_token: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}
