export interface UserToken {
  token: {
    access_token: string;
    refresh_token: string;
  };
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    // adicione outras propriedades do usuário, se necessário
  };
}