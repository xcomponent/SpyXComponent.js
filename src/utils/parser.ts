import { graphicalTags, modelTags } from "utils/configurationParser";
import { LinkLabelTemplate, TransitionTemplate, TriggerableTransitionTemplate, StateMachineTemplate, StateTemplate } from "utils/gojsTemplates";
import { Point, Curve, StateMachine, State } from "utils/parserObjects";

export class Parser {

    private locations: { [key: string]: Point };
    private controlPointTransition: { [key: string]: Curve };
    private controlPointTriggerable: { [key: string]: Curve };
    private stateMachines: { [key: string]: StateMachine };
    private stateMachineNames: Array<String>;
    private states: { [key: string]: State };
    private entryPoints: Array<String>;
    private finalStates: Array<String>;
    private linksLabel: Array<LinkLabelTemplate>;

    public linkDataArray: Array<TransitionTemplate | TriggerableTransitionTemplate>;
    public nodeDataArray: Array<StateMachineTemplate | StateTemplate | LinkLabelTemplate>;

    constructor() {
    }

    parseGraphical(xmlGraphical: string): void {
        this.locations = {};
        let xmlGraphicalDom = (new DOMParser()).parseFromString(xmlGraphical, "text/xml");
        let stateGraphicalDatas = xmlGraphicalDom.getElementsByTagName(graphicalTags.StateGraphicalData);
        for (let i = 0; i < stateGraphicalDatas.length; i++) {
            let id = stateGraphicalDatas[i].getAttribute(graphicalTags.Id);
            this.locations[id] = {
                x: parseFloat(stateGraphicalDatas[i].getAttribute(graphicalTags.CenterX)),
                y: parseFloat(stateGraphicalDatas[i].getAttribute(graphicalTags.CenterY))
            };
        }
        let transitionGraphicalDatas;

        transitionGraphicalDatas = xmlGraphicalDom.getElementsByTagName(graphicalTags.Links)[0]
            .getElementsByTagName(graphicalTags.TransitionGraphicalData);
        this.controlPointTransition = this.getControlPointTransition(transitionGraphicalDatas);

        transitionGraphicalDatas = xmlGraphicalDom.getElementsByTagName(graphicalTags.TransversalLinks)[0]
            .getElementsByTagName(graphicalTags.TransitionGraphicalData);
        this.controlPointTriggerable = this.getControlPointTransition(transitionGraphicalDatas);
    }

    parseModel(scxml: string): void {
        let scxmlDom = (new DOMParser()).parseFromString(scxml, "text/xml");
        this.setStateMachines(scxmlDom);
        this.setStates(scxmlDom);
        this.setLinks(scxmlDom);
        this.finalStates = this.getFinalStates();
        this.nodeDataArray = this.getNodeDataArray();
        this.nodeDataArray = this.nodeDataArray.concat(this.linksLabel);
        this.addControlPoint();
    }

    private addControlPoint(): void {
        for (let i = 0; i < this.linkDataArray.length; i++) {
            if (this.linkDataArray[i].triggerable) {
                let keyLink = this.linkDataArray[i].key;
                let p1 = this.controlPointTriggerable[keyLink].p1;
                let p2 = this.controlPointTriggerable[keyLink].p2;
                let c1 = this.controlPointTriggerable[keyLink].c1;
                let c2 = this.controlPointTriggerable[keyLink].c2;
                this.linkDataArray[i].controls = [c1.x, c1.y, c2.x, c2.y, p2.x, p2.y];
            } else {
                let keyLink = this.linkDataArray[i].key;
                let p1 = this.controlPointTransition[keyLink].p1;
                let p2 = this.controlPointTransition[keyLink].p2;
                let c1 = this.controlPointTransition[keyLink].c1;
                let c2 = this.controlPointTransition[keyLink].c2;
                this.linkDataArray[i].controls = [c1.x, c1.y, c2.x, c2.y];
            }
        }
    }

    private getNodeDataArray(): Array<StateMachineTemplate | StateTemplate | LinkLabelTemplate> {
        let nodeDataArray = [];
        let ids, state, stateMachine;
        ids = Object.keys(this.stateMachines);
        for (let i = 0; i < ids.length; i++) {
            stateMachine = this.stateMachines[ids[i]];
            nodeDataArray.push({
                "key": stateMachine.name,
                "text": stateMachine.name + " (0)",
                "isGroup": true,
                "numberOfInstances": 0
            });
        }
        ids = Object.keys(this.states);
        for (let j = 0; j < ids.length; j++) {
            state = this.states[ids[j]];
            nodeDataArray.push({
                "key": state.key,
                "text": state.name + " (0)",
                "group": state.group,
                "stateName": state.name,
                "numberOfStates": 0,
                "fill": "lightgray",
                "stroke": "black",
                "loc": this.getLocation(ids[j])
            });
        }
        return nodeDataArray;
    }

    private getControlPointTransition(transitionGraphicalDatas: NodeListOf<Element>): { [key: string]: Curve } {
        let controlPoints = {};
        for (let i = 0; i < transitionGraphicalDatas.length; i++) {
            let id = transitionGraphicalDatas[i].getAttribute(graphicalTags.Id);
            let points = transitionGraphicalDatas[i].getElementsByTagName(graphicalTags.Point);
            controlPoints[id] = {
                p1: {
                    x: parseFloat(points[0].getElementsByTagName(graphicalTags.X)[0].innerHTML),
                    y: parseFloat(points[0].getElementsByTagName(graphicalTags.Y)[0].innerHTML)
                },
                c1: {
                    x: parseFloat(points[1].getElementsByTagName(graphicalTags.X)[0].innerHTML),
                    y: parseFloat(points[1].getElementsByTagName(graphicalTags.Y)[0].innerHTML)
                },
                c2: {
                    x: parseFloat(points[2].getElementsByTagName(graphicalTags.X)[0].innerHTML),
                    y: parseFloat(points[2].getElementsByTagName(graphicalTags.Y)[0].innerHTML)
                },
                p2: {
                    x: parseFloat(points[3].getElementsByTagName(graphicalTags.X)[0].innerHTML),
                    y: parseFloat(points[3].getElementsByTagName(graphicalTags.Y)[0].innerHTML)
                }
            };
        }
        return controlPoints;
    }

    private getLocation(id: string): string {
        id = id.substring(modelTags.State.length, id.length);
        return this.locations[id].x + " " + this.locations[id].y;
    }

    private getFinalStates(): Array<String> {
        let finalStates = [];
        for (let id in this.states) {
            if (this.states[id].isFinal) {
                finalStates.push(this.states[id].key);
            }
        }
        return finalStates;
    }

    private setLinks(scxmlDom: Document): void {
        let linksDom = scxmlDom.getElementsByTagName(modelTags.TransitionData);
        this.linkDataArray = [];
        this.linksLabel = [];
        let key,
            from,
            to,
            text;

        for (let i = 0; i < linksDom.length; i++) {
            from = this.states[linksDom[i].getAttribute(modelTags.FromKey)];
            from.isFinal = false;
            to = this.states[linksDom[i].getAttribute(modelTags.ToKey)];
            text = linksDom[i].getAttribute(modelTags.Name);
            // key = from.key + tags.separator + to.key + tags.separator + text;
            key = linksDom[i].getAttribute(modelTags.Id);
            this.linkDataArray.push({
                "key": key,
                "from": from.key,
                "stateMachineTarget": from.group,
                "to": to.key,
                "text": text,
                "messageType": linksDom[i].getAttribute(modelTags.TriggeringEvent),
                "labelKeys": [key],
                "triggerable": false,
                "controls": null
            });
            this.linksLabel.push({
                "key": key,
                "category": "LinkLabel",
                "text": text
            });
        }

        // triggerable
        let triggerableLinksDom = scxmlDom.getElementsByTagName(modelTags.TransversalTransitionData);
        for (let j = 0; j < triggerableLinksDom.length; j++) {
            this.linkDataArray.push({
                "key": triggerableLinksDom[j].getAttribute(modelTags.Id),
                "from": this.states[triggerableLinksDom[j].getAttribute(modelTags.FromKey)].key,
                "to": triggerableLinksDom[j].getAttribute(modelTags.ToId),
                "strokeLink": "red",
                "strokeArrow": "red",
                "fillArrow": "red",
                "triggerable": true,
                "controls": null
            });
        }
    }

    private setStates(scxmlDom: Document): void {
        let statesDom = scxmlDom.getElementsByTagName(modelTags.StateData);
        let states = {};
        let id,
            group,
            name,
            isEntryPoint;
        let entryPoints = [];
        for (let i = 0; i < statesDom.length; i++) {
            id = statesDom[i].getAttribute(modelTags.SubGraphKey);
            group = this.stateMachines[id].name;
            name = statesDom[i].getAttribute(modelTags.Name);
            isEntryPoint = statesDom[i].getAttribute(modelTags.IsEntryPoint) === "true";
            states[modelTags.State + statesDom[i].getAttribute(modelTags.Id)] = {
                name: name,
                group: group,
                key: group + modelTags.separator + name,
                isFinal: true
            };
            if (isEntryPoint) {
                entryPoints.push(group);
            }
        }
        this.states = states;
        this.entryPoints = entryPoints;
    }

    private setStateMachines(scxmlDom: Document): void {
        let stateMachineDom = scxmlDom.getElementsByTagName(modelTags.StateMachineData);
        let stateMachines = {};
        let stateMachineNames = [];
        let id, name;
        for (let i = 0; i < stateMachineDom.length; i++) {
            id = stateMachineDom[i].getAttribute(modelTags.Id);
            name = stateMachineDom[i].getAttribute(modelTags.Name);
            stateMachines[modelTags.StateMachine + id] = {
                name: name,
                publicMember: stateMachineDom[i].getAttribute(modelTags.PublicMember)
            };
            stateMachineNames.push(name);
        }
        this.stateMachines = stateMachines;
        this.stateMachineNames = stateMachineNames;
    }

}