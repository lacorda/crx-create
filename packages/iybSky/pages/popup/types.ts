export type SelectPCAValue = {
  province: string;
  city: string;
  area: string;
};

export type SelectPCAProps = {
  className?: string;
  onChange?: (value: SelectPCAValue) => void;
  defaultValue?: SelectPCAValue;
};

export type PCADataTypes = {
  PCAArea: Array<string>;
  PCAP: Array<string>;
  PCAC: Array<Array<string>>;
  PCAA: Array<Array<Array<string>>>;
};
