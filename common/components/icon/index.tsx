import { createFromIconfontCN } from '@ant-design/icons';
import { getExtensionURL } from '@common/utils/chrome'

export default createFromIconfontCN({
  // chrome extension 的绝对路径
  scriptUrl: getExtensionURL('font_3748380_hs096vwpmcp.js'),
});
