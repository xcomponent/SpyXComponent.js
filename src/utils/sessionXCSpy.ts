import xcomponentapi from "reactivexcomponent.js";
import { Session, LogLevel, CompositionModel } from "reactivexcomponent.js";

export class SessionXCSpy {
    private promiseCreateSession: Promise<Session> = null;

    constructor() {
        xcomponentapi.setLogLevel(LogLevel.ERROR);
    }

    public init(api: string, serverUrl: string): void {
        this.promiseCreateSession = new Promise((resolve, reject) => {
            xcomponentapi.connect(serverUrl).then(connection => {
                connection.createSession(api).then(session => {
                    resolve(session);
                }).catch(error => {
                    console.error(error);
                    reject(error);
                });
            }).catch(error => {
                console.error(error);
                reject(error);
            });
        });
    }

    public getXcApiList(serverUrl: string): Promise<string []> {
        return new Promise((resolve, reject) => {
            xcomponentapi.connect(serverUrl).then(connection => {
                connection.getXcApiList().then(apiList => {
                    resolve(apiList);
                    connection.dispose();
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    public getCompositionModel(serverUrl: string, api: string): Promise<CompositionModel> {
        return new Promise((resolve, reject) => {
            xcomponentapi.connect(serverUrl).then(connection => {
                connection.getCompositionModel(api).then(compositionModel => {
                    resolve(compositionModel);
                    connection.dispose();
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    get PromiseCreateSession(): Promise<Session> {
        return this.promiseCreateSession;
    }
}

export default new SessionXCSpy();