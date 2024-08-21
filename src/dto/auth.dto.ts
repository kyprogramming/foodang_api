import { RestaurantPayload } from "./restaurant.dto";
import { CustomerPayload } from "./customer.dto";

export type AuthPayload = RestaurantPayload | CustomerPayload;
