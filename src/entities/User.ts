export interface User {
  id: string;
  fullname: string;
  email: string;
  password: string;
  profile?: string;
  verify_token: string; 
  verified:boolean;
}
//  update required