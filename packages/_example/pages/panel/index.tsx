import { createApp } from "@common/utils/tools";
import Panel from './Panel';
import './index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/panel');

createApp(<Panel />);
