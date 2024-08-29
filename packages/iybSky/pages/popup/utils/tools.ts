import { message } from "antd";
import dayjs from "dayjs";
import clonedeep from "lodash.clonedeep";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { firstUpperCase, parseUrl } from '@common/utils/tools'

dayjs.extend(customParseFormat);

/**
 * 计算x岁差/多少天的日期
 * @param age 年龄
 * @param days 天数
 * @param type 差值类型
 * @returns dayjs对象
 */
export const getBirthdate = (age: number, days = 0, type = "asc") => {
  // 获取当前日期
  const currentDate = new Date();

  // 计算出生日期的年份
  const birthYear = currentDate.getFullYear() - age;

  // 使用出生年份创建一个新日期对象
  const birthdate = new Date(
    birthYear,
    currentDate.getMonth(),
    type === "asc" ? currentDate.getDate() - days : currentDate.getDate() + days
  );

  const dateStr = birthdate.toLocaleDateString();
  const [year, month, day] = dateStr.split("/");
  const str = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  return dayjs(str, "YYYY-MM-DD");
};

/**
 * 复制文本
 * @param  {object}   data    复制数据
 * @config {string}   text    文本
 * @param  {function} cb      回调
 */
export const copy = (
  data: { text: string },
  cb?: (data?: any) => void | undefined
) => {
  const { text } = data || {};

  if (typeof text !== "string") {
    console.error("请传入字符串");
    return false;
  }

  if (cb) {
    cb(data);
  }

  try {
    const div = document.createElement("div");

    div.innerHTML = text;
    document.body.appendChild(div);

    window.getSelection().removeAllRanges();

    const range = document.createRange();
    range.selectNode(div);
    window.getSelection().addRange(range);

    const success = document.execCommand("copy");

    if (success) {
      message.success("复制成功");
    } else {
      message.error("复制失败");
    }

    window.getSelection().removeAllRanges();
    document.body.removeChild(div);

    return true;
  } catch (error) {
    console.error(error);
  }

  return false;
};

// 获取随机数
export const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// 本身就是对象的widget key
const keyWithObject = [
  // 利益演示
  "benefits",
  // 职业
  "occupation",
  // 地区
  "city",
  "place",
  "area"
]
export const isObjectWidget = (key: string) => {
  return keyWithObject.some((item) => key.endsWith(item) || key.endsWith(firstUpperCase(item))) || key === 'cert';
}

/**
 *
 * @param obj eg: {detail:{applicant: {name: '张三'}}}
 * @param prefix
 * @returns eg: ['detail.applicant.name']
 */
export function flattenObject(obj, prefix = "") {
  if (!obj) return [];

  let result = [];

  Object.entries(obj).forEach(([key, value]) => {
    const currentKey = prefix
      ? isNaN(Number(key))
        ? `${prefix}.${key}`
        : `${prefix}[${key}]`
      : key;

    if (typeof obj[key] === "object" && !isObjectWidget(key)) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          result = result.concat(
            flattenObject(item, `${currentKey}[${index}]`)
          );
        });
      } else {
        result = result.concat(flattenObject(obj[key], currentKey));
      }
    } else {
      result.push(currentKey);
    }
  });

  return result;
}

/**
 * 获取省市区的枚举值
 * @param options
 * @returns
 *  [{
 *   label: "市辖区",
 *   value: "410101",
 *   parents: [
 *     {
 *       label: "河南省",
 *       value: "410000",
 *     },
 *     {
 *       label: "郑州市",
 *       value: "410100",
 *     },
 *   ],
 * }]
 */
export const genSelectAsyncEnumsFromOptions = (options, result = []) => {
  const index = getRandom(0, options.length - 1);

  const item = clonedeep(options[index] || {});
  delete item.children;
  result.push(item);

  if (options[index]?.children) {
    genSelectAsyncEnumsFromOptions(options[index]?.children, result);
  }

  const lastIndex = result.length - 1;
  const lastItem = result[lastIndex];

  if (!lastIndex) {
    return lastItem;
  }

  return {
    ...lastItem,
    parents: result.filter((item, index) => index !== lastIndex),
  };
};

/**
 * 获取省市区的枚举值
 * @param options
 * @returns
 *  {
 *    "level": "1",
 *    "label": "土地整治工程技术人员",
 *    "value": "H0202002-1-1",
 *    "parents": [
 *      {
 *        "label": "农牧渔业人员",
 *        "value": "H02"
 *      },
 *      {
 *        "label": "农业技术人员",
 *        "value": "H0202"
 *      }
 *    ]
 *  }
 */
export const genPickerStackEnumsFromOptions = (options, result = []) => {
  const index = getRandom(0, options.length - 1);

  const item = clonedeep(options[index] || {});
  delete item.children;
  result.push(item);

  if (options[index]?.children) {
    genPickerStackEnumsFromOptions(options[index]?.children, result);
  }

  const lastIndex = result.length - 1;
  const lastItem = result[lastIndex];
  return {
    ...lastItem,
    parents: result
      .filter((item, index) => index !== lastIndex)
      .map((item) => ({ label: item.label, value: item.value })),
  };
};

export const getSelectAsyncEnums = (options, widgetKey) => {
  switch (widgetKey) {
    case "select-async":
      return genSelectAsyncEnumsFromOptions(options);
    case "picker-stack":
    case "picker-step":
      return genPickerStackEnumsFromOptions(options);
    default:
      return [];
  }
};


const SKY_HOST_REG = /^sky(-)?(test|flow|fat|uat)?\.(baoyun18|iyunbao|baoinsurance|zhongan)\.com$/;

const SKY_PAGES = [
  '/m/short2020/trial',
  '/m/short2020/insure'
]
export const checkSkyPage = (url) => {
  if (!url) return;

  const { host, pathname } = parseUrl(url);
  return (host.match(SKY_HOST_REG) || host.match('localhost:')) && SKY_PAGES.includes(pathname);
}
