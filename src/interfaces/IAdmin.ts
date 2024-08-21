export interface IAdmin extends Document {
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    googleId: string;
    facebookId: string;
    salt: string;
}
export default IAdmin;
