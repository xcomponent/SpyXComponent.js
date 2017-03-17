import xcomponentapi from "reactivexcomponent.js";
import { xcLogLevel } from "reactivexcomponent.js";

class SessionXCSpy {
    private promiseCreateSession: Promise<any> = null;

    constructor() {
    }

    init(xcApiFileName, serverUrl) {
        this.promiseCreateSession = new Promise((resolve, reject) => {
            xcomponentapi.createSession(xcApiFileName, serverUrl, (error, session) => {
                resolve(session);
            });
        });
        xcomponentapi.setLogLevel(xcLogLevel.INFO);
    }

    getPromiseCreateSession() {
        return this.promiseCreateSession;
    }

}

export default new SessionXCSpy();
