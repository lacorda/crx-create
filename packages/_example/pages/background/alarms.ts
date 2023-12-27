import alarmsStorage from '@common/storages/alarmsStorage';
const MY_ALARM = "my-alarm";

class Alarm {
  name: string;
  options: chrome.alarms.AlarmCreateInfo;

  constructor(name: string, options: chrome.alarms.AlarmCreateInfo) {
    this.name = name;
    this.options = options;

    chrome.alarms.create(this.name, this.options);

    this.onAlarm();
  }

  onAlarm() {
    chrome.alarms.onAlarm.addListener(async (alarm) => {
      if (alarm.name === this.name) {
        console.log('🍄  监听闹钟', Date.now(), alarm);
      }
    });
  }

  async checkAlarmState() {
    // 判断上次关闭浏览器时，闹钟是否开启
    const { alarmEnabled } = await alarmsStorage.get();

    if (alarmEnabled) {
      const alarm = await chrome.alarms.get(MY_ALARM);

      if (!alarm) {
        await chrome.alarms.create({ periodInMinutes: 1 });
      }
    }
  }
}

export default Alarm;