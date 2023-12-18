import { firstNames, lastNames } from "../config";
import { getRandom } from "./tools";

/**
 * 姓名生成器
 */
export default class NameGenerator {
  genRandomText(nameList = [], len: number) {
    // 随机选择length个字母组成名字的一部分
    let namePart = "";
    for (let i = 0; i < len; i++) {
      const randomIndex = getRandom(0, nameList.length - 1);
      namePart += nameList[randomIndex];
    }
    return namePart;
  }

  create(len = 3) {
    // 从名字和姓氏列表中随机选择一个
    const firstName = this.genRandomText(firstNames, 1);
    const lastName = this.genRandomText(lastNames, len - 1);

    return firstName + lastName;
  }
}
