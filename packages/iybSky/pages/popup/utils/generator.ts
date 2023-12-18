import clonedeep from "lodash.clonedeep";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  genderTypes,
  occupationEnums,
  cityEnums,
  areaEnums,
  mobilePrefixEnums,
  emailDomainsEnums,
  characters,
  asyncWidgets,
} from "../config";
import CertNoGenerator from "./certGen";
import NameGenerator from "./nameGen";
import BankGenerator from "./bankGen";
import { getAllAreas } from "./pca";
import {
  getRandom,
  getBirthdate,
  flattenObject,
  getSelectAsyncEnums,
} from "./tools";

dayjs.extend(customParseFormat);

const CertNoGen = new CertNoGenerator();
const NameGen = new NameGenerator();
const BankCardGen = new BankGenerator();
const areas = getAllAreas();

export const genRandomArea = () => {
  const index = getRandom(0, areas.length - 1);
  return areas[index].code;
};

// 随机生成一个 10年内 的起期
export const createDescDay = () => {
  return getRandom(0, 365 * 10 - 1);
};

export const genRandomBirthday = (startAge = 18, entAge = 60) => {
  const age = getRandom(startAge, entAge);
  const days = getRandom(0, 364);
  return getBirthdate(age, days).format("YYYY-MM-DD");
};

export const genRandomGender = () => {
  const index = getRandom(0, 1);
  return genderTypes[index].value;
};

export const genName = () => {
  return NameGen.create();
};

export const genCertNo = (
  area = genRandomArea(),
  birthday = genRandomBirthday(),
  gender = genRandomGender()
) => {
  const certNos = CertNoGen.create(area, birthday, gender);

  const index = getRandom(0, certNos.length - 1);

  return certNos[index];
};

export const genBankCard = (code?: string) => {
  const bankCards = BankCardGen.create(code || "104");
  const index = getRandom(0, bankCards.length - 1);

  return bankCards[index];
};

export const genOccupation = () => {
  const index = getRandom(0, occupationEnums.length - 1);
  return occupationEnums[index];
};

export const genCity = () => {
  const index = getRandom(0, cityEnums.length - 1);
  return cityEnums[index];
};

export const genArea = () => {
  const index = getRandom(0, areaEnums.length - 1);
  return areaEnums[index];
};

export const genDoorPlat = () => {
  const index1 = getRandom(1, 12);
  const index2 = getRandom(1, 88);
  const index3 = getRandom(1, 8);
  return `${index1}号楼${index2}0${index3}室`;
};

export const genAddress = () => {
  const index = getRandom(1, 999);
  return `学院路${index}号${genDoorPlat()}`;
};

export const genEmail = () => {
  let username = "";
  const len = getRandom(6, 12);
  for (let i = 0; i < len; i++) {
    username += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  // 组合生成随机邮箱
  const index = getRandom(0, emailDomainsEnums.length - 1);
  return `${username}@${emailDomainsEnums[index]}`;
};

export const genMobile = () => {
  const index = getRandom(0, mobilePrefixEnums.length - 1);

  let remainingDigits = "";
  for (let i = 0; i < 8; i++) {
    remainingDigits += Math.floor(Math.random() * 10); // 生成0到9之间的随机数字
  }

  return mobilePrefixEnums[index] + remainingDigits;
};

/**
 * 随机生成器
 */
export default class RandomGenerator {
  size: number;

  descDay = 0;

  beginDate: dayjs.Dayjs;

  constructor(size = 2) {
    this.size = size;
  }

  genValidateBegin() {
    this.beginDate = dayjs().subtract(this.descDay, "day");
    return this.beginDate.format("YYYY-MM-DD");
  }

  genValidateEnd() {
    if (!this.beginDate) {
      const randonDay = getRandom(365 / 2, 365 * 20 - 1);
      return dayjs().add(randonDay, "day").format("YYYY-MM-DD");
    }

    return this.beginDate.add(365 * 20, "day").format("YYYY-MM-DD");
  }

  genRandomInput(key: string) {
    const map = {
      // 姓名
      "name#input": genName,

      // 身份证号
      "certType#select": () => "SFZ",
      "certNo#input": genCertNo,
      "cert#select-cert": () => ({
        certType: "SFZ",
        certNo: genCertNo(),
      }),

      // 日期组件：证件起期/证件止期/出生日期
      "validateBegin#date": this.genValidateBegin.bind(this),
      "validate#date": this.genValidateEnd.bind(this),
      "birthday#date": genRandomBirthday,

      // 职业
      // "occupation#picker-stack": genOccupation,
      // "occupation#picker-step": genOccupation,

      // 收入
      "income#input": () => String(getRandom(10, 40)),
      "familyIncome#input": () => String(getRandom(40, 100)),

      // 所在地区
      // "city#select-async": genCity,
      // "postalcity#select-async": genCity,
      // "postalCity#select-async": genCity,

      // 详细地址 - 地图
      "area#address": genArea,
      "postalarea#address": genArea,
      "postalArea#address": genArea,

      // 详细地址 - 输入
      "address#input": genAddress,
      "area#input": genAddress,
      "postalarea#input": genAddress,
      "postalArea#input": genAddress,

      // 门牌号
      "doorPlate#input": genDoorPlat,
      "postaldoorPlate#input": genDoorPlat,
      "postalDoorPlate#input": genDoorPlat,

      // 邮政编码
      "zipcode#input": () => String(getRandom(100000, 999999)),
      "postalzipcode#input": () => String(getRandom(100000, 999999)),

      // 邮箱
      "email#input": genEmail,
      "email#email": genEmail,

      // 手机号
      "mobile#input": genMobile,

      // 短信验证码
      "smsCode#input": () => "888888",
      "smscode#input": () => "888888",
      "smsCode#smscode": () => "888888",
      "smscode#smscode": () => "888888",

      // 身高
      "height#input": () => String(getRandom(150, 190)),

      // 体重
      "weight#input": () => String(getRandom(40, 80)),
    };

    if (!map[key]) return;

    return map[key]();
  }

  genRandomRadio(options: any[] = []) {
    const index = getRandom(0, options.length - 1);
    return options[index]?.value || "";
  }

  genRandomSelect(options: any[] = [], isNations = false) {
    if (isNations) {
      // 有中国就选中国
      const CHNIndex = options.findIndex((item) => item.value === "CHN");
      if (CHNIndex > -1) {
        return "CHN";
      }
    }
    const index = getRandom(0, options.length - 1);
    return options[index]?.value || "";
  }

  genRandomSelectAsync(map: Record<string, any>, data: any) {
    const { widget, initFetchKey } = data;
    if (!map[initFetchKey]) {
      return;
    }

    return getSelectAsyncEnums(map[initFetchKey], widget);
  }

  create(pathMap: Record<string, any>, params: Record<string, any>) {
    if (!pathMap) return;

    this.descDay = createDescDay();

    const loop = (map: Record<string, any>) => {
      Object.entries(map).forEach(([key, value]) => {
        const genRandomInput = this.genRandomInput(`${key}#${value?.widget}`);
        if (
          value?.widget &&
          (value?.wprops?.readOnly ||
            value?.wprops?.readonly ||
            value?.wprops?.disabled)
        ) {
          // 只读的组件不处理
          delete map[key];
        } else if (genRandomInput) {
          // 输入类型组件
          map[key] = genRandomInput;
        } else if (value?.widget === "input" && key === "bankCard") {
          // 银行卡号：要与开户行匹配
          map[key] = genBankCard(map?.bank?.value);
          // } else if (value?.widget === "agree-terms") {
          //   // 协议
          //   map[key] = true;
          // } else if (value?.widget === "radio") {
          // 不处理单选框，因为单选框伴随着联动，会影响其他字段的显示
          //   // 单选框
          //   map[key] = this.genRandomRadio(value?.wprops?.options);
        } else if (value?.widget === "input") {
          // 其他的输入框
          map[key] = `来自插件的${value.wprops.label}`;
        } else if (value?.widget === "select") {
          // 下拉选项select
          map[key] = this.genRandomSelect(
            value?.wprops?.options,
            key === "nations"
          );
        } else if (asyncWidgets.includes(value?.widget)) {
          // 异步请求下拉选项
          map[key] = this.genRandomSelectAsync(params.selectAsyncMap, value);
        } else if (value?.widget === "date") {
          if (key !== "EFFECTIVE_DATE") {
            // 排除保单生效日
            map[key] = genRandomBirthday();
          } else {
            delete map[key];
          }
        } else if (key === "benefits") {
          // 先不处理受益人列表
          delete map[key];
        } else if (
          Object.prototype.toString.call(value) === "[object Object]" &&
          !value.widget
        ) {
          loop(value);
        } else {
          delete map[key];
        }
      });
    };

    const newPathMap = clonedeep(pathMap);
    loop(newPathMap);

    // FIXME: 包含了隐藏的
    const flattenPaths = flattenObject(newPathMap);

    return {
      data: newPathMap,
      paths: flattenPaths,
    };
  }
}
