import { createApp } from "@common/utils/tools";
import './index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import SidePanel from './SidePanel';

refreshOnUpdate('pages/sidepanel');

createApp(<SidePanel />);
