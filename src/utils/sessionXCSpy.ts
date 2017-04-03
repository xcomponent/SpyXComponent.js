import xcomponentapi from "reactivexcomponent.js";
import { xcLogLevel } from "reactivexcomponent.js";

class SessionXCSpy {
    private promiseCreateSession: Promise<any> = null;
    public privateTopics: Array<String> = [];
    public defaultPrivateTopic: string = "";

    constructor() {
    }

    init(xcApiFileName, serverUrl) {
        this.promiseCreateSession = new Promise((resolve, reject) => {
            xcomponentapi.createSession(xcApiFileName, serverUrl, (error, session: any) => {
                resolve(session);
                this.privateTopics = ["private topic"];
                this.defaultPrivateTopic = "private topic";
                // to change with new version of api
                // this.privateTopics = session.privateTopics;
                // this.defaultPrivateTopic = session.privateTopic;
            });
        });
        xcomponentapi.setLogLevel(xcLogLevel.INFO);

    }

    getPromiseCreateSession() {
        return this.promiseCreateSession;
    }

}

export default new SessionXCSpy();
