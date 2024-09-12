import { Types } from "mongoose";

interface IVendor extends Document {
    name: string;
    phone: string;
    email: string;
    website: string;
    address: {
        street: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    primary_contact_person: {
        first_name: string;
        last_name: string;
        position: string;
        phone: string;
        email: string;
    };
    restaurant_ids: Types.ObjectId[] | [];
}
export default IVendor;
