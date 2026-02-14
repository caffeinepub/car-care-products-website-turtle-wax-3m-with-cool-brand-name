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
    name: string;
    tags?: Array<string>;
    shortDescription: string;
    brand: string;
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getProduct(id: bigint): Promise<Product>;
    getProductsByBrand(brand: string): Promise<Array<Product>>;
    getProductsGroupedByBrand(): Promise<Array<[string, Array<Product>]>>;
}
