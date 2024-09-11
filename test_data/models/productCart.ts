import { IProductCartModel, IPrice, IPricesList } from "./ICartProducts.model";
import { Edition, PurchaseType, DurationEnum } from "../parameters.enum";

export class ProductCart implements IProductCartModel {
    name: string;
    edition: Edition;
    purchaseType: PurchaseType | null;
    duration: DurationEnum;
    unitPrice: IPrice | null;
    totalPrice: IPrice | null;
    quantity: number;
    prioritySupport: boolean;

    constructor(
        name: string,
        edition: Edition | null,
        purchaseType: PurchaseType | null,
        duration: DurationEnum,
        unitPrice: IPrice | null,
        totalPrice: IPrice | null,
        quantity: number,
        prioritySupport: boolean,
    ) {
        this.name = name;
        this.edition = edition;
        this.duration = duration;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.quantity = quantity;
        this.prioritySupport = prioritySupport;
        this.purchaseType = purchaseType;
    }

    async setPrice(priceObject: IPricesList) {
        this.unitPrice = await priceObject.unitPrice;
        this.totalPrice = await priceObject.totalPrice;
    }
}
