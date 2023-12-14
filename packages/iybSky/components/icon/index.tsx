import { createFromIconfontCN } from '@ant-design/icons';
import { getExtensionURL } from '@common/utils/chrome'

export default createFromIconfontCN({
  // chrome extension 的绝对路径
  scriptUrl: getExtensionURL('font_4367664_o2v0zzn4ixk.js'),
});
