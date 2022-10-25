import { useMemo, useState, useContext } from "preact/hooks";
import { createContext } from "preact";
import { TypeHelper } from "../../helper/TypeHelper";
import { InfoRecord as InfoRecordModel, PRICE_DATE_CATEGORY_OPTION, TierPrice } from "./models/InfoRecord";
import { FormDropdownOption } from "../../assets/models/Form";

interface FormInputBase {
  name: string;
  required?: boolean;
  value: any;
  onChange: (value: any) => void;
}

type FormInputProp = FormInputBase;

type FormDropdownProp = {
  options: any;
} & FormInputBase;

interface ContextOptions {
  flagRequired: boolean;
  enableAlternativeInput: boolean;
}

interface Context {
  options: ContextOptions;
  setOptions: (options: ContextOptions) => void;
}

const InfoRecordContext = createContext<Context | null>(null);

const RequiredFlag = (props: any) => {
  const {
    options: { flagRequired },
  } = useContext<Context>(InfoRecordContext as any);
  const { alwaysEnable } = props;

  return <>{(flagRequired || alwaysEnable) && <span class="required">*</span>}</>;
};

const FormLabel = (props: any) => {
  const { label, required } = props;

  return (
    <div class="form-label">
      <label>{label}</label>
      {required && <RequiredFlag />}
      {props.children}
    </div>
  );
};

const FormDropdown = (props: FormDropdownProp) => {
  const { required = true, options, name } = props;
  const label = useMemo(() => {
    return (name || "").replace(/([A-Z])/g, " $1");
  }, [name]);

  return (
    <div class="control-group">
      <FormLabel label={label} required={required} />
      <select name="cars" id="cars">
        {options.map((option: FormDropdownOption) => (
          <option value="volvo">{option.label}</option>
        ))}
      </select>
    </div>
  );
};

const FormInput = (props: FormInputProp) => {
  const { required = false, name, value, onChange } = props;
  const label = useMemo(() => {
    return (name || "").replace(/([A-Z])/g, " $1");
  }, [name]);

  return (
    <div class="control-group">
      <FormLabel label={label} required={required} />
      <input placeholder={label} value={value} onChange={(e: any) => onChange(e.target.value)} />
    </div>
  );
};

const FormCalendar = (props: FormInputProp) => {
  const { required = true, name } = props;
  const [value] = useState(new Date().toUTCString());
  const label = useMemo(() => {
    return (name || "").replace(/([A-Z])/g, " $1");
  }, [name]);

  return (
    <div class="control-group">
      <FormLabel label={label} required={required} />
      <input type="date" value={value} defaultValue={value} />
    </div>
  );
};

type ActiveField = "input" | "dropdown";

const FormHalfInputDropdown = (props: any) => {
  const { name, options, value, onChange } = props;
  const {
    options: { enableAlternativeInput },
  } = useContext<Context>(InfoRecordContext as any);
  const label = useMemo(() => {
    return (name || "").replace(/([A-Z])/g, " $1");
  }, [name]);
  const [activeField, setActiveField] = useState<ActiveField>("input");

  const onChangeField = () => setActiveField(activeField == "input" ? "dropdown" : "input");

  return (
    <div class="form-half-input-dropdown">
      <div>
        {enableAlternativeInput ? (
          <>
            <FormLabel label={label}>
              <span class="clickable" onClick={() => onChangeField()}>
                {activeField == "input" ? "➡️" : "⬅️"}
              </span>
            </FormLabel>
            <input class={activeField == "input" ? "active" : ""} placeholder={label} />
            <select class={activeField == "dropdown" ? "active" : ""} name="" id="">
              {options.map((option: FormDropdownOption) => (
                <option value="volvo">{option.label}</option>
              ))}
            </select>
          </>
        ) : (
          <FormInput name={name} value={value} onChange={onChange} />
        )}
      </div>
    </div>
  );
};

const Switch = (props: any) => {
  const { label, value, onChange } = props;

  return (
    <div class="form-switch">
      <label class="switch">
        <input type="checkbox" checked={value} onChange={() => onChange(!value)} />
        <span class="slider"></span>
      </label>
      <span class="label">{label}</span>
      {props.children}
    </div>
  );
};

const InfoRecordProperty = TypeHelper.interfaceToEnum<InfoRecordModel>();
const TierPriceProperty = TypeHelper.interfaceToEnum<TierPrice>();

export const InfoRecordItem = (props: any) => {
  const { onChange, value, addTierPrice, removeTierPrice } = props;
  const { infoRecordId, infoRecordNo, priceDateCategory, effectiveDate, expiredDate, purOrg, plant, materialCode, supplierMatCode, productName, productDescription, categoryName, uom, unitPrice, per, currency, vendorNumber, noteForDiscount, vatType, minOrder, maxOrder, standardQuantity, purchasingGroup, conversionBase, baseUnit, conversionOrder, orderUnit, tierPriceList } = value;

  return (
    <div class="info-record">
      <FormInput name={InfoRecordProperty.infoRecordId} value={infoRecordId} onChange={(value: any) => onChange(InfoRecordProperty.infoRecordId, value)} />
      <FormInput name={InfoRecordProperty.infoRecordNo} required value={infoRecordNo} onChange={(value: any) => onChange(InfoRecordProperty.infoRecordNo, value)} />
      <FormHalfInputDropdown name={InfoRecordProperty.priceDateCategory} options={PRICE_DATE_CATEGORY_OPTION} value={priceDateCategory} onChange={(InfoRecordProperty.priceDateCategory, value)} />
      <FormCalendar name={InfoRecordProperty.effectiveDate} required value={effectiveDate} onChange={(value: any) => onChange(InfoRecordProperty.effectiveDate, value)} />
      <FormCalendar name={InfoRecordProperty.expiredDate} required value={expiredDate} onChange={(value: any) => onChange(InfoRecordProperty.expiredDate, value)} />
      <FormInput name={InfoRecordProperty.purOrg} required value={purOrg} onChange={(value: any) => onChange(InfoRecordProperty.purOrg, value)} />
      <FormInput name={InfoRecordProperty.plant} value={plant} onChange={(value: any) => onChange(InfoRecordProperty.plant, value)} />
      <FormInput name={InfoRecordProperty.materialCode} required value={materialCode} onChange={(value: any) => onChange(InfoRecordProperty.materialCode, value)} />
      <FormInput name={InfoRecordProperty.supplierMatCode} value={supplierMatCode} onChange={(value: any) => onChange(InfoRecordProperty.supplierMatCode, value)} />
      <FormInput name={InfoRecordProperty.productName} value={productName} onChange={(value: any) => onChange(InfoRecordProperty.productName, value)} />
      <FormInput name={InfoRecordProperty.productDescription} value={productDescription} onChange={(value: any) => onChange(InfoRecordProperty.productDescription, value)} />
      <FormInput name={InfoRecordProperty.categoryName} required value={categoryName} onChange={(value: any) => onChange(InfoRecordProperty.categoryName, value)} />
      <FormInput name={InfoRecordProperty.uom} value={uom} onChange={(value: any) => onChange(InfoRecordProperty.uom, value)} />
      <FormInput name={InfoRecordProperty.unitPrice} required value={unitPrice} onChange={(value: any) => onChange(InfoRecordProperty.unitPrice, value)} />
      <FormInput name={InfoRecordProperty.per} required value={per} onChange={(value: any) => onChange(InfoRecordProperty.per, value)} />
      <FormInput name={InfoRecordProperty.currency} required value={currency} onChange={(value: any) => onChange(InfoRecordProperty.currency, value)} />
      <FormInput name={InfoRecordProperty.vendorNumber} value={vendorNumber} onChange={(value: any) => onChange(InfoRecordProperty.vendorNumber, value)} />
      <FormInput name={InfoRecordProperty.noteForDiscount} value={noteForDiscount} onChange={(value: any) => onChange(InfoRecordProperty.noteForDiscount, value)} />
      <FormInput name={InfoRecordProperty.vatType} required value={vatType} onChange={(value: any) => onChange(InfoRecordProperty.vatType, value)} />
      <FormInput name={InfoRecordProperty.minOrder} required value={minOrder} onChange={(value: any) => onChange(InfoRecordProperty.minOrder, value)} />
      <FormInput name={InfoRecordProperty.maxOrder} required value={maxOrder} onChange={(value: any) => onChange(InfoRecordProperty.maxOrder, value)} />
      <FormInput name={InfoRecordProperty.standardQuantity} required value={standardQuantity} onChange={(value: any) => onChange(InfoRecordProperty.standardQuantity, value)} />
      <FormInput name={InfoRecordProperty.purchasingGroup} required value={purchasingGroup} onChange={(value: any) => onChange(InfoRecordProperty.purchasingGroup, value)} />
      <FormInput name={InfoRecordProperty.conversionBase} required value={conversionBase} onChange={(value: any) => onChange(InfoRecordProperty.conversionBase, value)} />
      <FormInput name={InfoRecordProperty.baseUnit} value={baseUnit} onChange={(value: any) => onChange(InfoRecordProperty.baseUnit, value)} />
      <FormInput name={InfoRecordProperty.conversionOrder} required value={conversionOrder} onChange={(value: any) => onChange(InfoRecordProperty.conversionOrder, value)} />
      <FormInput name={InfoRecordProperty.orderUnit} value={orderUnit} onChange={(value: any) => onChange(InfoRecordProperty.orderUnit, value)} />
      {tierPriceList?.length > 0 &&
        tierPriceList.map((tierPrice: TierPrice, index: number) => {
          return (
            <div>
              <FormInput name={TierPriceProperty.tierPriceId} required value={tierPrice.tierPriceId} onChange={(value: any) => onChange(TierPriceProperty.tierPriceId, value, index)} />
              <FormInput name={TierPriceProperty.fromQuantity} required value={tierPrice.fromQuantity} onChange={(value: any) => onChange(TierPriceProperty.fromQuantity, value, index)} />
              <FormInput name={TierPriceProperty.fromUnitPrice} required value={tierPrice.fromUnitPrice} onChange={(value: any) => onChange(TierPriceProperty.fromUnitPrice, value, index)} />
              <button class="delete" onClick={() => removeTierPrice(index)}>
                ❌
              </button>
            </div>
          );
        })}
      <button class="add" onClick={addTierPrice}>
        ➕ TierPrice
      </button>
    </div>
  );
};

const defaultOptions = {
  flagRequired: true,
  enableAlternativeInput: true,
};

const defaultTierPriceValue: TierPrice = {
  tierPriceId: null,
  fromUnitPrice: null,
  fromQuantity: null,
};

const defaultItemValue: InfoRecordModel = {
  infoRecordId: "",
  infoRecordNo: "",
  priceDateCategory: null,
  effectiveDate: new Date().toString(),
  expiredDate: new Date().toString(),
  purOrg: "",
  plant: "",
  materialCode: "",
  supplierMatCode: "",
  productName: "",
  productDescription: "",
  categoryName: "",
  uom: "",
  unitPrice: null,
  per: null,
  currency: "",
  vendorNumber: "",
  noteForDiscount: "",
  vatType: "",
  minOrder: null,
  maxOrder: null,
  standardQuantity: null,
  purchasingGroup: "",
  conversionBase: null,
  baseUnit: "",
  conversionOrder: null,
  orderUnit: "",
  tierPriceList: [],
};

export const InfoRecord = (props: any) => {
  const [items, setItems] = useState<InfoRecordModel[]>([{ ...defaultItemValue }]);
  const [options, setOptions] = useState(defaultOptions);
  const [resultStr, setResultStr] = useState<string>("");

  const setResult = (items: InfoRecordModel[]) => {
    let result = "";
    let delimiter = "|";
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let resultLine = "";
      Object.keys(item).forEach((key, j) => {
        const tempValue = item[key as keyof InfoRecordModel];
        if (key == "tierPriceList") {
          let tierPriceValue = tempValue as TierPrice[];
          if (tierPriceValue?.length > 0) {
            let tierPriceTemplate = resultLine;
            for (let tpId = 0; tpId < (tempValue as TierPrice[]).length; tpId++) {
              let temp = tierPriceTemplate;
              if (tpId == 0) {
                temp = "";
              }
              const tierPrice = (tempValue as TierPrice[])[tpId];
              temp += delimiter + (tierPrice.tierPriceId ? tierPrice.tierPriceId : "");
              temp += delimiter + (tierPrice.fromQuantity ? tierPrice.fromQuantity : "");
              temp += delimiter + (tierPrice.fromUnitPrice ? tierPrice.fromUnitPrice : "");
              temp += "\n";
              console.log({ temp });
              result += temp;
            }
          }
        } else {
          if (j != 0) {
            result += delimiter;
            resultLine += delimiter;
          }
          result += tempValue || "";
          resultLine += tempValue || "";
        }
      });
      if (i != items.length) {
        result += "\n";
      }
    }
    setResultStr(result);
  };

  const onItemChange = (index: number, field: keyof InfoRecordModel, value: string | number | null, tierPriceIndex?: number) => {
    const tempItems = [...items];
    let tempItem = tempItems[index] as any;
    if (tierPriceIndex != undefined || tierPriceIndex != null) {
      tempItem.tierPriceList[tierPriceIndex][field] = value;
    } else {
      tempItem[field] = value;
    }

    setItems(tempItems);
    setResult(tempItems);
  };

  const addInfoRecord = () => {
    setItems([...items, { ...defaultItemValue }]);
  };

  const addTierPrice = (index: number) => {
    const tempItems = [...items];
    const tempItem = tempItems[index];
    tempItem.tierPriceList = [...tempItem.tierPriceList, { ...defaultTierPriceValue }];
    setItems(tempItems);
  };

  const removeTierPrice = (itemIndex: number, tierPriceIndex: number) => {
    const tempItems = [...items];
    const tempItem = tempItems[itemIndex];
    tempItem.tierPriceList.splice(tierPriceIndex, 1);
    setItems(tempItems);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultStr);
  };

  return (
    <InfoRecordContext.Provider value={{ options, setOptions }}>
      <div class="form-info-record">
        <div class="options">
          <Switch name="displayIsRequired" label="Display `required` flag " value={options.flagRequired} onChange={(value: boolean) => setOptions({ ...options, flagRequired: value })}>
            <RequiredFlag alwaysEnable />
          </Switch>
          <Switch name="" label="Enable dropdown selection" value={options.enableAlternativeInput} onChange={(value: boolean) => setOptions({ ...options, enableAlternativeInput: value })} />
        </div>
        <div class="working-space">
          <div class="info-records">
            {items.map((item, index) => (
              <>
                <span>{index + 1}</span> <InfoRecordItem key={`info-record-${index}`} value={item} onChange={(field: keyof InfoRecordModel, value: any, tierPriceIndex: number) => onItemChange(index, field, value, tierPriceIndex)} addTierPrice={() => addTierPrice(index)} removeTierPrice={(tierPriceIndex: number) => removeTierPrice(index, tierPriceIndex)} />
              </>
            ))}
          </div>
          <div class="actions">
            <button class="add" onClick={() => addInfoRecord()}>
              ➕ Add Info record
            </button>
            <button class="copy-to-clipboard" onClick={() => copyToClipboard()}>
              🎉 Copy to clipboard
            </button>
          </div>
          <div class="result">
            <textarea value={resultStr} placeholder={"ID92300016|5300000984|3|2022/10/01|9999/12/31|TH01|DCPA|4001000127|ZZZZ10021011112|เห็ดแชมปิญอง ขนาดกลาง พิเศษ|เห็ดแชมปิญอง ขนาดกลาง พิเศษ|100104:DAILY-VEGE-LOCAL||0.00|0||1002109||V1|5.000|50.000|5.000|H01|1|KG|1|KG|0002|50.000|103.00106"} />
          </div>
        </div>
      </div>
    </InfoRecordContext.Provider>
  );
};
