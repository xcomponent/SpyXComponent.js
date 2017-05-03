import xcomponentapi from "reactivexcomponent.js";
import { Session } from "reactivexcomponent.js";

export class SessionXCSpy {
    private promiseCreateSession: Promise<Object> = null;

    constructor() {
    }

    init(xcApiFileName: string, serverUrl: string): Promise<Object> {
        const promiseCreateSession = new Promise((resolve, reject) => {
            xcomponentapi.createSession(xcApiFileName, serverUrl, (error, session: Session) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(session);
            });
        });
        return promiseCreateSession;
    }

    set PromiseCreateSession(promiseCreateSession) {
        this.promiseCreateSession = promiseCreateSession;
    }

    get PromiseCreateSession(): Promise<any> {
        return this.promiseCreateSession;
    }

}

export default new SessionXCSpy();
