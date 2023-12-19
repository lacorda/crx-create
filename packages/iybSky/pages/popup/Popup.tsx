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
  Input,
} from "antd";
import type { RadioChangeEvent } from "antd";
import { HighlightOutlined, SaveOutlined } from "@ant-design/icons";
import { useSetState, useAsyncEffect, useLatest } from "ahooks";
import { sendMessageContent } from "@common/utils/chrome";
import { Icon } from '@common/components';
import { SelectPCA, PopupDrawer } from "./components";
import {
  navs,
  birthTypes,
  marginalTypes,
  genderTypes,
  bankTypes,
  randomTips,
} from "./config";

import { getBirthdate, copy, getRandom, flattenObject } from "./utils/tools";
import BankCardGenerator from "./utils/bankGen";
import RandomGenerator, { genCertNo } from "./utils/generator";
import { SelectPCAValue } from "./types";
import { selectAsyncStorage, insureStorage } from "../../utils/storage";
import "./Popup.scss";

const DEFAULT_AGE = 18;
const DEFAULT_BIRTHDAY = getBirthdate(DEFAULT_AGE);
const RandomGen = new RandomGenerator();
const BankCardGen = new BankCardGenerator();

let insureStorageTemp: any = {};
insureStorage.get().then(res => {
  insureStorageTemp = res || {};
});

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
    remark: '',
    selectAsyncMap: undefined,
    pageData: undefined,
    showDrawer: false,
    drawerType: ''
  });

  const pageDataRef = useLatest(state.pageData);
  const remarkRef = useLatest(state.remark);

  const [form] = Form.useForm();

  const {
    tab,
    pca,
    birthType,
    marginal,
    birthday,
    gender,
    bankType,
    remark,
    selectAsyncMap,
    showDrawer,
    drawerType,
  } = state;

  useEffect(() => {
    sendMessageContent({
      source: "popup-to-content",
      type: 'open',
    });

    chrome.runtime.onMessage.addListener((message) => {
      const { source, type, data } = message;
      if (source === "content-to-crx") {
        console.log('🍄  popup: >>>>>>>>>>>>>>>>>> 接收消息', Date.now(), type, data);

        if (type === 'pageData') {
          setState({ pageData: data });
          return;
        }

        if (type === 'formData') {
          insureStorage.set({
            ...insureStorageTemp,
            [remarkRef.current]: data
          });
          insureStorageTemp[remarkRef.current] = data;
        }
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
        source: 'popup-to-content',
        type: 'random',
        data: randomData
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

  const handlePull = () => {
    setState({
      showDrawer: true,
      drawerType: 'pull',
    });
  }

  const handlePush = () => {
    setState({
      showDrawer: true,
      drawerType: 'push',
    });
  }

  const handleCloseDrawer = () => {
    setState({ showDrawer: false });
    form.resetFields();
  }

  const handleOKDrawer = () => {
    form.validateFields().then(() => {
      const { remark } = form.getFieldsValue();
      const value = insureStorageTemp[remark];

      if (drawerType === 'pull') {
        if (value) {
          message.error('备注已存在，请重新输入');
          return;
        }

        // 获取页面数据
        sendMessageContent({
          source: 'popup-to-content',
          type: 'pull',
        })
        return;
      } else {
        // 回显页面数据
        sendMessageContent({
          source: 'popup-to-content',
          type: 'push',
          data: {
            data: value,
            paths: flattenObject(value),
          }
        })
      }
      // 不自动关闭，可能会有多次操作
      // handleCloseDrawer();
    })
  }

  const handleChangeRemark = (e) => {
    setState({ remark: e.target.value });
  }

  const handleChangeRemarkWithSelect = (value) => {
    setState({ remark: value });
  }

  const renderFormAction = () => {
    return (
      <div className="tab-content tab-content__form">
        <Space wrap>
          <Button
            type="primary"
            icon={<HighlightOutlined />}
            onClick={handleRandom}
          >
            随机填写表单
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handlePull}
          >
            存储页面数据
          </Button>
          <Button
            type="primary"
            icon={<Icon type="icon-pushpin-fill" />}
            onClick={handlePush}
          >
            历史数据回显
          </Button>
        </Space>

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
            case "form":
              return renderFormAction();
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

  const getRemarkList = () => {
    const remarkList = Object.keys(insureStorageTemp).map(key => {
      return {
        label: key,
        value: key,
      }
    });
    return remarkList;
  }

  const renderDrawer = () => {
    const title = drawerType === 'pull' ? '存储页面数据' : '历史数据回显';
    return (
      <PopupDrawer
        title={title}
        open={showDrawer}
        onClose={handleCloseDrawer}
        onCancel={handleCloseDrawer}
        onOk={handleOKDrawer}
      >
        <Form
          form={form}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 25 }}
          initialValues={{ remark }}
        >
          {
            drawerType === 'pull' ? (
              <Form.Item
                label="唯一标识"
                name="remark"
                rules={[{ required: true, message: '请输入唯一标识' }]}
              >
                <Input value={remark} onChange={handleChangeRemark} allowClear placeholder="请输入唯一标识" />
              </Form.Item>
            ) : (
              <Form.Item
                label="选择数据"
                name="remark"
                rules={[{ required: true, message: '请选择数据' }]}
              >
                <Select
                  style={{ width: 240 }}
                  onChange={handleChangeRemarkWithSelect}
                  options={getRemarkList()}
                />
              </Form.Item>
            )
          }
        </Form>
      </PopupDrawer>
    )
  }

  return (
    <div className="App">
      <Tabs
        activeKey={tab}
        tabPosition="top"
        type="card"
        items={getTabs()}
        onChange={handleChangeTab}
      />
      {renderDrawer()}
    </div>
  );
};

export default Popup;
