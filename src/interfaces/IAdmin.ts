export interface IAdmin extends Document {
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
}
export default IAdmin;
