import { PCAD, SAT } from "../config";
import { PCADataTypes } from "../types";

/**
 * 生成省市区数据
 * @returns
 */
export const genPCAData = () => {
  const PCAArea = []; // ['省,市,区']
  const PCAP = []; // ['省']
  const PCAC = []; // [['省','市', '市', '市', '市']]
  const PCAA = []; // [[['区', '区', '区', '区', '区']]]
  const PCAN = PCAD.split("#");

  for (let i = 0; i < PCAN.length; i++) {
    PCAA[i] = [];
    const TArea = PCAN[i].split("$")[1].split("|");
    for (let j = 0; j < TArea.length; j++) {
      PCAA[i][j] = TArea[j].split(",");

      // 只有省市两级
      if (PCAA[i][j].length == 1) {
        PCAA[i][j][1] = SAT;
      }

      TArea[j] = TArea[j].split(",")[0];
    }
    PCAArea[i] = PCAN[i].split("$")[0] + "," + TArea.join(",");
    PCAP[i] = PCAArea[i].split(",")[0];
    PCAC[i] = PCAArea[i].split(",");
  }

  return {
    PCAArea,
    PCAP,
    PCAC,
    PCAA,
  };
};

export const getAllAreas = () => {
  const { PCAA } = genPCAData();
  const areas = [];

  for (let i = 0; i < PCAA.length; i++) {
    for (let j = 0; j < PCAA[i].length; j++) {
      for (let k = 0; k < PCAA[i][j].length; k++) {
        const area = PCAA[i][j][k];
        const [code, name] = area.split("-");
        areas.push({
          area,
          code,
          name,
        });
      }
    }
  }

  return areas;
};

// 获取城市
export const getCities = (data: PCADataTypes, province: string) => {
  const index = data.PCAP.indexOf(province);
  return data.PCAC[index].slice(1);
};

// 获取区域
export const getAreas = (
  data: PCADataTypes,
  province: string,
  city: string
) => {
  const index = data.PCAP.indexOf(province);
  const cities = data.PCAC[index].slice(1);
  const index2 = cities.indexOf(city);
  return data.PCAA[index][index2].slice(1);
};
