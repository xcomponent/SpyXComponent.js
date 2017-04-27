import xcomponentapi from "reactivexcomponent.js";

class SessionXCSpy {
    private promiseCreateSession: Promise<any> = null;
    private privateTopics: string[] = [];
    private defaultPrivateTopic: string = "";

    constructor() {
    }

    init(xcApiFileName: string, serverUrl: string): any {
        const promiseCreateSession = new Promise((resolve, reject) => {
            xcomponentapi.createSession(xcApiFileName, serverUrl, (error, session: any) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(session);
                this.privateTopics = ["private topic"];
                this.defaultPrivateTopic = "private topic";
            });
        });
        return promiseCreateSession;
    }

    get DefaultPrivateTopic(): string {
        return this.defaultPrivateTopic;
    }

    get PrivateTopics(): string[] {
        return this.privateTopics;
    }

    set PromiseCreateSession(promiseCreateSession) {
        this.promiseCreateSession = promiseCreateSession;
    }

    get PromiseCreateSession(): Promise<any> {
        return this.promiseCreateSession;
    }

}

export default new SessionXCSpy();
