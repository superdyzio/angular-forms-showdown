import { Address } from "./address";
import { WritableSignal } from "@angular/core";

export interface User {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    country: string;
    state: string;
    newsletter: boolean;
    newsletterFrequency: string;
    addresses: Address[];
  }
  
export type UserForm = Omit<User, 'addresses'> & {
  addresses: WritableSignal<Address>[];
}