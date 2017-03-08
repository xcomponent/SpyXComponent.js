import xcomponentapi from "reactivexcomponent.js/lib/xcomponentapi.js";

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
    }

    getPromiseCreateSession() {
        return this.promiseCreateSession;
    }
}

export default new SessionXCSpy();
