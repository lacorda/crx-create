import { createApp } from "@common/utils/tools";
import "./index.css";
import Popup from "./Popup";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/popup");

createApp(<Popup />);
