import { IToy } from "./School";

export enum VendorOrderType {
    NGO = 'NGO',
    SCHOOL = 'SCHOOL'
};

export interface VendorCartItem {
    toyId: string;
    quantity: number;
    brand: string;
    subBrand: string;
    price: number;
};

export interface ShowVendorOrder {
    toy: IToy,
    quantity: number
};

export enum VendorOrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    DISPATCHED = 'DISPATCHED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
};

export interface VendorOrderStatusInfo {
    timestamps: string;
    personName: string;
    contactNumber: string;
    status: VendorOrderStatus
}

export interface VendorOrder {
    id: string;
    listOfToysSentLink: [
        {
            toy: IToy;
            quantity: number;
            price: number;
        }
    ];
    brand: string;
    subBrand: string;
    address: string;
    isAddedOrRemovedFromTheStock: boolean;
    type: VendorOrderType;
    description: string;
    from: string;
    to: string;
    school: string;
    quantity: number;
    status: VendorOrderStatusInfo[];
}


export interface IOtherProduct {
  order: string;
  item: string;  
  quantity: number;
  id?:string;
}