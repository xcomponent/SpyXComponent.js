import { Action } from "redux";

export const INIT_SESSION = "INIT_SESSION";

export interface InitSessionAction extends Action {
    serverUrl: string;
    api: string;
};

export const initSession = (api: string, serverUrl: string): InitSessionAction => {
    return {
        type: INIT_SESSION,
        serverUrl,
        api
    };
};