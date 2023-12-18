import { useSafeState, useMount } from "ahooks";
import classnames from "classnames";
import { Select, Space } from "antd";
import { genBem } from "@common/utils/tools";
import { genPCAData, getCities, getAreas } from "../utils/pca";
import { SelectPCAProps } from "../types";

const PCAData = genPCAData();
const { PCAP } = PCAData;

const SelectPCA = (props: SelectPCAProps) => {
  const { className, onChange, defaultValue } = props;
  const bem = genBem("component-select-pca");

  const cls = classnames(bem(), className);

  const [province, setProvince] = useSafeState("");

  const [cities, setCities] = useSafeState([]);
  const [city, setCity] = useSafeState("");

  const [areas, setAreas] = useSafeState([]);
  const [area, setArea] = useSafeState("");

  const initProvince = () => {
    const p = PCAP[0];
    setProvince(p);

    return p;
  };

  const updateCity = (p) => {
    const cs = getCities(PCAData, p);
    const c = cs[0];
    setCities(cs);
    setCity(c);
    return c;
  };

  const updateArea = (p, c) => {
    const as = getAreas(PCAData, p, c);
    const a = as[0];
    setAreas(as);
    setArea(a);

    return a;
  };

  useMount(() => {
    if (defaultValue) {
      const { province: p, city: c, area: a } = defaultValue;
      setProvince(p);

      const cs = getCities(PCAData, p);
      setCities(cs);
      setCity(c);

      const as = getAreas(PCAData, p, c);
      setAreas(as);
      setArea(a);
      return;
    }

    const defaultProvince = initProvince();
    const defaultCity = updateCity(defaultProvince);
    const defaultArea = updateArea(defaultProvince, defaultCity);
    if (onChange) {
      onChange({
        province: defaultProvince,
        city: defaultCity,
        area: defaultArea,
      });
    }
  });

  const handleChangeProvince = (value: string) => {
    setProvince(value);
    const c = updateCity(value);
    const a = updateArea(value, c);

    if (onChange) {
      onChange({
        province: value,
        city: c,
        area: a,
      });
    }
  };

  const handleChangeCity = (value: string) => {
    setCity(value);
    const a = updateArea(province, value);

    if (onChange) {
      onChange({
        province,
        city: value,
        area: a,
      });
    }
  };

  const handleChangeArea = (value: string) => {
    setArea(value);

    if (onChange) {
      onChange({
        province,
        city,
        area: value,
      });
    }
  };

  return (
    <div className={cls}>
      <Space wrap>
        <Select
          value={province}
          onChange={handleChangeProvince}
          options={PCAP.map((p) => {
            const [, label] = p.split("-");
            return {
              label,
              value: p,
            };
          })}
        />
        <Select
          value={city}
          onChange={handleChangeCity}
          options={cities.map((c) => {
            const [, label] = c.split("-");
            return {
              label,
              value: c,
            };
          })}
        />
        <Select
          value={area}
          onChange={handleChangeArea}
          options={areas.map((a) => {
            const [, label] = a.split("-");
            return {
              label,
              value: a,
            };
          })}
        />
      </Space>
    </div>
  );
};

export default SelectPCA;
