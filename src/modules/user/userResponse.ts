export class UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;

  constructor(user: any) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.role = user.role;
  }
}
