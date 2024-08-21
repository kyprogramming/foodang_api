export interface IFood extends Document {
    restaurantId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: number;
    price: number;
    rating: number;
    images: HTMLCollectionOf<HTMLImageElement>;
}

export default IFood;
