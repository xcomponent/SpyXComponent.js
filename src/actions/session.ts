import { Action } from "redux";
import sessionXCSpy from "utils/sessionXCSpy";

export const INIT_SESSION = "INIT_SESSION";

export interface InitSessionAction extends Action {
    serverUrl: string;
    api: string;
    init: (xcApi: string, serverUrl: string) => Promise<any>;
};

export const initSession = (api: string, serverUrl: string, init: (xcApi: string, serverUrl: string) => Promise<any>): InitSessionAction => {
    return {
        type: INIT_SESSION,
        serverUrl,
        api,
        init
    };
};