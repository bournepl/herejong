
export class SignUpInfo {
    username: string;
    name: string;
    role: string[];
    password: string;
   

    constructor(
        username: string, 
        name: string, 
        password: string, 
   ) {

        this.username = username;
        this.name = name;
        this.password = password;
        this.role = ['admin'];
      
    }
}
