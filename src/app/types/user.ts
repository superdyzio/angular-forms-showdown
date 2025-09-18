import { Address } from "./address";

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
  