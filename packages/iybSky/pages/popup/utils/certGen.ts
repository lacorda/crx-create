/**
 * 身份证号生成器
 */
export default class CertNoGenerator {
  model = {
    woman: -2,
    man: -1,
    random: "00",
    size: 30,
    day: 31,
  };

  addRandom() {
    this.model.random = "" + (parseInt(this.model.random) + 1);
    if (parseInt(this.model.random) < 10) {
      this.model.random = "0" + this.model.random;
    }
    if (Number(this.model.random) >= 100) {
      this.model.random = "00";
    }
  }

  getRandom(isFemale: boolean) {
    if (isFemale) {
      this.model.woman += 2;
      if (this.model.woman >= 10) {
        this.model.woman = 0;
        this.addRandom();
      }
    } else {
      this.model.man += 2;
      if (this.model.man >= 10) {
        this.model.man = 1;
        this.addRandom();
      }
    }
  }

  //生成校验码
  getCode(id: string) {
    const AI = id.split("");
    const JY = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    const WI = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let sum = 0;
    for (let i = 0; i < WI.length; i++) {
      sum += Number(AI[i]) * WI[i];
    }
    return JY[sum % 11];
  }

  create(area: string, birthday: string, gender: string) {
    const isFemale = gender === "female";

    const randomArray = [];
    for (let index = 0; index < this.model.size; index++) {
      this.getRandom(isFemale);
      const order = this.model.random;
      const sex = isFemale ? this.model.woman : this.model.man;
      const date = birthday.replace(/-/g, "");
      const id = area + date + order + sex;
      const code = this.getCode(id);

      randomArray.push(id + code);
    }

    return randomArray;
  }
}
