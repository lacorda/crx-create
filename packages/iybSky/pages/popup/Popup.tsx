import { useEffect } from "react";
import {
  message,
  Tabs,
  Button,
  Form,
  Radio,
  DatePicker,
  Space,
  InputNumber,
  Select,
} from "antd";
import type { RadioChangeEvent } from "antd";
import { HighlightOutlined } from "@ant-design/icons";
import { useSetState, useAsyncEffect, useLatest } from "ahooks";
import { sendMessageContent } from "@common/utils/chrome";
import SelectPCA from "./components/selectPCA";
import {
  navs,
  birthTypes,
  marginalTypes,
  genderTypes,
  bankTypes,
  randomTips,
} from "./config";

import { getBirthdate, copy, getRandom } from "./utils/tools";
import BankCardGenerator from "./utils/bankGen";
import RandomGenerator, { genCertNo } from "./utils/generator";
import { SelectPCAValue } from "./types";
import { selectAsyncStorage } from "../../utils/storage";
import "./Popup.scss";

const DEFAULT_AGE = 18;
const DEFAULT_BIRTHDAY = getBirthdate(DEFAULT_AGE);
const RandomGen = new RandomGenerator();
const BankCardGen = new BankCardGenerator();

const Popup = () => {
  const initIdcardValue: any = {
    pca: undefined,
    birthType: birthTypes[0].value,
    marginal: {
      age: DEFAULT_AGE,
      type: marginalTypes[0].value,
      days: 0,
    },
    birthday: DEFAULT_BIRTHDAY,
    gender: genderTypes[0].value,
  };
  const initBankcardValue = {
    bankType: bankTypes[0].value,
  };

  const [state, setState] = useSetState({
    tab: navs[0].key,
    ...initIdcardValue,
    ...initBankcardValue,
    selectAsyncMap: undefined,
    pageData: undefined,
  });

  const pageDataRef = useLatest(state.pageData);

  const {
    tab,
    pca,
    birthType,
    marginal,
    birthday,
    gender,
    bankType,
    selectAsyncMap,
  } = state;

  useEffect(() => {
    sendMessageContent({
      type: "popup-to-content",
      data: { action: "open" }
    });

    chrome.runtime.onMessage.addListener((request) => {
      if (request.type === "iybSkyData") {
        console.log('🍄  popup: >>>>>>>>>>>>>>>>>> 接收消息', Date.now(), request);
        setState({ pageData: request.data });
      }
    });
  }, []);

  useAsyncEffect(async () => {
    const res = await selectAsyncStorage.get();
    setState({ selectAsyncMap: res });
  }, []);

  const handleChangeTab = (key: string) => {
    setState({ tab: key });
  };

  const handleRandom = () => {
    if (!pageDataRef.current) {
      message.error("未获取到页面数据，请重试");
      return;
    }

    try {
      const randomData = RandomGen.create(pageDataRef.current, {
        selectAsyncMap,
      });

      sendMessageContent({
        type: 'popup-to-content',
        data: {
          action: 'random',
          data: randomData,
        }
      });
    } catch (error) {
      message.error(error.message || error);
      return;
    }
  };

  const handleChangePCA = (value: SelectPCAValue) => {
    setState({ pca: value });
  };

  const handleChangeBirthType = (e: RadioChangeEvent) => {
    setState({ birthType: e.target.value });
  };

  const handleChangeAge = (value: number | undefined) => {
    setState({ marginal: { ...marginal, age: value } });
  };

  const handleChangeMarginalType = (value: string) => {
    setState({ marginal: { ...marginal, type: value } });
  };

  const handleChangeDays = (value: number | undefined) => {
    setState({ marginal: { ...marginal, days: value } });
  };

  const handleChangeBirthday = (date: any) => {
    setState({ birthday: date });
  };

  const handleChangeGender = (e: RadioChangeEvent) => {
    setState({ gender: e.target.value });
  };

  const handleIdcardFinish = () => {
    let newBirthday = birthday.format("YYYY-MM-DD");
    const areaCode = pca?.area.split("-")[0];
    if (birthType === "marginal") {
      const { age, type, days } = marginal;

      if (age <= 0 && type === "desc" && days > 0) {
        message.error("年龄不能为负");
        return;
      }

      newBirthday = getBirthdate(age, days, type).format("YYYY-MM-DD");
    }

    const certNo = genCertNo(areaCode, newBirthday, gender);
    copy({ text: certNo });
  };

  const handleChangeBankType = (value: string) => {
    setState({ bankType: value });
  };

  const handleBankcardFinish = (values: any) => {
    const bankNos = BankCardGen.create(values.bankType);

    const index = getRandom(0, bankNos.length - 1);
    copy({ text: bankNos[index] });
  };

  const renderRandom = () => {
    return (
      <div className="tab-content tab-content__random">
        <Button
          type="primary"
          icon={<HighlightOutlined />}
          onClick={handleRandom}
        >
          随机填写表单
        </Button>

        <div className="random-tips">
          {randomTips.map((tip, index) => {
            return (
              <div key={index}>
                {index + 1}. {tip}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderIdcard = () => {
    return (
      <div className="tab-content tab-content__idcard">
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 25 }}
          onFinish={handleIdcardFinish}
          initialValues={initIdcardValue}
        >
          <Form.Item label="户籍地址" name="pca">
            <SelectPCA onChange={handleChangePCA} />
          </Form.Item>
          <Form.Item label="生日类型" name="birthType">
            <Radio.Group value={birthType} onChange={handleChangeBirthType}>
              {birthTypes.map((b) => {
                const { value, label } = b;
                return (
                  <Radio key={value} value={value}>
                    {label}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Form.Item>
          {birthType === "marginal" ? (
            <Form.Item
              label="年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄"
              name="marginal"
            >
              <Space.Compact>
                <InputNumber
                  min={0}
                  max={199}
                  style={{ width: 100 }}
                  addonAfter="岁"
                  value={marginal.age}
                  onChange={handleChangeAge}
                />
                <Select
                  value={marginal.type}
                  style={{ width: 60 }}
                  onChange={handleChangeMarginalType}
                  options={marginalTypes}
                />
                <InputNumber
                  min={0}
                  max={364}
                  style={{ width: 100 }}
                  value={marginal.days}
                  addonAfter="天"
                  onChange={handleChangeDays}
                />
              </Space.Compact>
            </Form.Item>
          ) : (
            <Form.Item label="出生日期" name="birthday">
              <DatePicker onChange={handleChangeBirthday} />
            </Form.Item>
          )}
          <Form.Item
            label="性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别"
            name="gender"
          >
            <Radio.Group onChange={handleChangeGender} value={gender}>
              {genderTypes.map((b) => {
                const { value, label } = b;
                return (
                  <Radio key={value} value={value}>
                    {label}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 3, span: 25 }}>
            <Button type="primary" htmlType="submit">
              生成并复制身份证号
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const renderBankcard = () => {
    return (
      <div className="tab-content tab-content__bankcard">
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 25 }}
          onFinish={handleBankcardFinish}
          initialValues={initBankcardValue}
        >
          <Form.Item label="开户银行" name="bankType">
            <Select
              style={{ width: 120 }}
              value={bankType}
              onChange={handleChangeBankType}
              options={bankTypes}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 3, span: 25 }}>
            <Button type="primary" htmlType="submit">
              生成并复制银行卡号
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const getTabs = () => {
    const tabs = navs.map((nav) => {
      const { key, name } = nav;
      return {
        label: name,
        key,
        children: (() => {
          switch (key) {
            case "random":
              return renderRandom();
            case "idcard":
              return renderIdcard();
            case "bankcard":
              return renderBankcard();
            default:
              return null;
          }
        })(),
      };
    });
    return tabs;
  };

  return (
    <div className="App">
      <Tabs
        activeKey={tab}
        tabPosition="top"
        type="card"
        items={getTabs()}
        onChange={handleChangeTab}
      />
    </div>
  );
};

export default Popup;
