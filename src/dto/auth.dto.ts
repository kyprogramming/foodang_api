import { RestaurantPayload } from "./restaurant.dto";
import { CustomerPayload } from "./customer.dto";
import { UserPayload } from "./user.dto";

export type AuthPayload = RestaurantPayload | CustomerPayload | UserPayload;
