export const LOCAL_RELOAD_SOCKET_PORT = 8098;

export const LOCAL_RELOAD_SOCKET_URL = `ws://localhost:${LOCAL_RELOAD_SOCKET_PORT}`;

export const UPDATE_PENDING_MESSAGE = "wait_update";

export const UPDATE_REQUEST_MESSAGE = "do_update";

export const UPDATE_COMPLETE_MESSAGE = "done_update";

export const ID_IN_BACKGROUND_SCRIPT = 'virtual:reload-on-update-in-background-script';

export const ID_IN_VIEW = 'virtual:reload-on-update-in-view';

export const DUMMY_CODE = `export default function(){};`;

export const INPUT_FILES = ['popup', 'content', 'background', 'offscreen', 'contentStyle', 'devtools', 'panel', 'newtab', 'options', 'sidepanel'];