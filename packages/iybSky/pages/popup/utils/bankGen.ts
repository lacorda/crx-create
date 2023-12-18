import { bankCardPrefix } from "../config";

/**
 * 银行卡号生成器
 */
export default class BankCardGenerator {
  size = 30;

  // 获取不包括Luhn Code的银行卡号
  getBankCardWithoutLunmCode(bankNo: string) {
    // bankNo 银行代码
    //控制位数. 19位的银行卡 cardinalNumber=12. 16位的银行卡 cardinalNumber=9
    let cardinalNumber = 12;
    const prefix = bankCardPrefix[bankNo] ?? bankCardPrefix["104"];

    if (["303", "308", "310"].includes(bankNo)) {
      cardinalNumber = 9;
    } else if (["309"].includes(bankNo)) {
      cardinalNumber = 11;
    }

    //生成不包括Luhm校验码的银行卡号
    let bankCardWithoutLunmCode = prefix;
    for (let j = 0; j < cardinalNumber; j++) {
      bankCardWithoutLunmCode += Math.floor(Math.random() * 10);
    }
    return bankCardWithoutLunmCode;
  }

  // 获取Luhn Code
  getLuhnCode(bankCardWithoutLunmCode) {
    if (bankCardWithoutLunmCode == "") return "";
    const no = bankCardWithoutLunmCode.split("").reverse().join("");

    // 定义奇数/偶数数据
    const addArr = [];
    const evenArr = [];

    // 奇数/偶数数组分开
    for (let i = 0; i < no.length; i++) {
      if (i % 2 == 0) {
        addArr[i / 2] = no[i];
      } else {
        evenArr[(i - 1) / 2] = no[i];
      }
    }
    //奇数数组内容x2
    // 如果乘以2得到的数字是两位,把这两位相加得到一位数字.
    // 如果相加后的内容时两位数,减去9.
    for (let i = 0; i < addArr.length; i++) {
      let temp = parseInt(addArr[i]) * 2;
      if (temp > 9) {
        temp =
          parseInt(String(temp).charAt(0)) + parseInt(String(temp).charAt(1));
        if (temp > 9) {
          temp = temp - 9;
        }
      }
      addArr[i] = temp;
    }
    //两个数组合并
    const arr = addArr.concat(evenArr);
    let oddEvenCount = 0;

    for (let i = 0; i < arr.length; i++) {
      oddEvenCount += parseInt(arr[i]);
    }
    //生成Lnhn code
    const LuhnCode = oddEvenCount % 10 == 0 ? 0 : 10 - (oddEvenCount % 10);
    return LuhnCode;
  }

  create(bankNo: string) {
    const randomArray = [];
    for (let index = 0; index < this.size; index++) {
      const bankCardWithoutLunmCode = this.getBankCardWithoutLunmCode(bankNo);
      const bankCard =
        bankCardWithoutLunmCode +
        this.getLuhnCode(bankCardWithoutLunmCode) +
        "";
      randomArray.push(bankCard);
    }

    return randomArray;
  }
}
