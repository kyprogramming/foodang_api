export class EditRestaurantInput {
    name: string;
    address: string;
    phone: string;
    foodType: [string];
}

export class RestaurantLoginInput {
    email: string;
    password: string;
}

export class RestaurantPayload {
    _id: string;
    email: string;
    name: string;
}

export class CreateOfferInputs {
    offerType: string;
    restaurants: [any];
    title: string;
    description: string;
    minValue: number;
    offerAmount: number;
    startValidity: Date;
    endValidity: Date;
    promocode: string;
    promoType: string;
    bank: [any];
    bins: [any];
    postcode: string;
    isActive: boolean;
}

export class InactivateOfferInputs {
    isActive: boolean;
}

export class MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}
