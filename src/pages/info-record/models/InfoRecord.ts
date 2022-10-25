import { FormDropdownOption } from "../../../assets/models/Form";

export interface InfoRecord {
  infoRecordId: string;
  infoRecordNo: string;
  priceDateCategory: number | null;
  effectiveDate: string;
  expiredDate: string;
  purOrg: string;
  plant: string;
  materialCode: string;
  supplierMatCode: string;
  productName: string;
  productDescription: string;
  categoryName: string;
  uom: string;
  unitPrice: number | null;
  per: number | null;
  currency: string;
  vendorNumber: string;
  noteForDiscount: string;
  vatType: string;
  minOrder: number | null;
  maxOrder: number | null;
  standardQuantity: number | null;
  purchasingGroup: string;
  conversionBase: number | null;
  baseUnit: string;
  conversionOrder: number | null;
  orderUnit: string;
  tierPriceList: TierPrice[];
}

export interface TierPrice {
  tierPriceId: number | null;
  fromUnitPrice: number | null;
  fromQuantity: number | null;
}

enum PriceDateCategory {
  PO = "PO Date",
  DELIVERY = "Delivery Date",
  CURRENT = "Current Date",
}

export const PRICE_DATE_CATEGORY_OPTION: FormDropdownOption[] = [
  { label: PriceDateCategory.PO, value: "1" },
  { label: PriceDateCategory.DELIVERY, value: "2" },
  { label: PriceDateCategory.CURRENT, value: "3" },
];
