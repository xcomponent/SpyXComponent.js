import xcomponentapi from "reactivexcomponent.js";

class SessionXCSpy {
    private promiseCreateSession: Promise<any> = null;
    private privateTopics: string[] = [];
    private defaultPrivateTopic: string = "";

    constructor() {
    }

    init(xcApiFileName: string, serverUrl: string) {
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
    }

    getDefaultPrivateTopic(): string {
        return this.defaultPrivateTopic;
    }

    getPrivateTopics(): string[] {
        return this.privateTopics;
    }

    getPromiseCreateSession(): Promise<any> {
        return this.promiseCreateSession;
    }

}

export default new SessionXCSpy();
