import { createApp } from "@common/utils/tools";
import Newtab from './Newtab';
import './index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/newtab');

createApp(<Newtab />);
