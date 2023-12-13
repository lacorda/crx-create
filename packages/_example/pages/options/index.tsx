import { createApp } from "@common/utils/tools";
import Options from './Options';
import './index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/options');

createApp(<Options />);
