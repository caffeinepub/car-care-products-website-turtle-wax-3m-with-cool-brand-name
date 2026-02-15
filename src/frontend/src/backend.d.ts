import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    imgPath: string;
    originalMrp: bigint;
    name: string;
    tags?: Array<string>;
    shortDescription: string;
    brand: string;
    discountedPrice: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(id: bigint, brand: string, name: string, shortDescription: string, imgPath: string, originalMrp: bigint, discountedPrice: bigint, tags: Array<string> | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: bigint): Promise<Product>;
    getProductDetails(id: bigint): Promise<Product>;
    getProductsByBrand(brand: string): Promise<Array<Product>>;
    getProductsGroupedByBrand(): Promise<Array<[string, Array<Product>]>>;
    isCallerAdmin(): Promise<boolean>;
    updateProduct(id: bigint, brand: string | null, name: string | null, shortDescription: string | null, imgPath: string | null, originalMrp: bigint | null, discountedPrice: bigint | null, tags: Array<string> | null): Promise<void>;
}
