import { RestaurantPayload } from "./restaurant.dto";
import { CustomerPayload } from "./customer.dto";
import { UserPayload } from "./user.dto";
import { AdminPayload } from "./admin.dto";

export type AuthPayload = RestaurantPayload | CustomerPayload | UserPayload | AdminPayload;
