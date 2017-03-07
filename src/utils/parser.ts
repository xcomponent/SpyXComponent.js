import { graphicalTags, modelTags } from "utils/configurationParser";
import { LinkLabelTemplate, TransitionTemplate, TriggerableTransitionTemplate, StateMachineTemplate, StateTemplate } from "utils/gojsTemplates";
import { Point, Curve, StateMachine, State, ComponentGraphicalModel } from "utils/parserObjects";

export class Parser {

    private locations: { [key: string]: Point };
    private controlPointTransition: { [key: string]: Curve };
    private controlPointTriggerable: { [key: string]: Curve };
    private stateMachines: { [key: string]: StateMachine };
    private states: { [key: string]: State };
    private finalStates: Array<String>;
    private linksLabel: Array<LinkLabelTemplate>;
    private componentGraphicalModel: ComponentGraphicalModel;

    public entryPoints: Array<String>;
    public stateMachineNames: Array<string>;
    public linkDataArray: Array<TransitionTemplate | TriggerableTransitionTemplate>;
    public nodeDataArray: Array<StateMachineTemplate | StateTemplate | LinkLabelTemplate>;

    constructor(componentGraphicalModel: ComponentGraphicalModel) {
        this.componentGraphicalModel = componentGraphicalModel;
    }

    parse() {
        this.parseGraphical();
        this.parseModel();
    }

    private parseGraphical(): void {
        this.locations = {};
        let xmlGraphicalDom = (new DOMParser()).parseFromString(this.componentGraphicalModel.graphical, "text/xml");
        let stateGraphicalData = xmlGraphicalDom.getElementsByTagName(graphicalTags.StateGraphicalData);
        for (let i = 0; i < stateGraphicalData.length; i++) {
            let id = stateGraphicalData[i].getAttribute(graphicalTags.Id);
            this.locations[id] = {
                x: parseFloat(stateGraphicalData[i].getAttribute(graphicalTags.CenterX)),
                y: parseFloat(stateGraphicalData[i].getAttribute(graphicalTags.CenterY))
            };
        }
        let transitionGraphicalData;

        transitionGraphicalData = xmlGraphicalDom.getElementsByTagName(graphicalTags.Links)[0]
            .getElementsByTagName(graphicalTags.TransitionGraphicalData);
        this.controlPointTransition = this.getControlPointTransition(transitionGraphicalData);

        transitionGraphicalData = xmlGraphicalDom.getElementsByTagName(graphicalTags.TransversalLinks)[0]
            .getElementsByTagName(graphicalTags.TransitionGraphicalData);
        this.controlPointTriggerable = this.getControlPointTransition(transitionGraphicalData);
    }

    private parseModel(): void {
        let scxmlDom = (new DOMParser()).parseFromString(this.componentGraphicalModel.model, "text/xml");
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
                let firstPoint = this.controlPointTriggerable[keyLink].firstPoint;
                let lastPoint = this.controlPointTriggerable[keyLink].lastPoint;
                let firstControlPoint = this.controlPointTriggerable[keyLink].firstControlPoint;
                let secondControlPoint = this.controlPointTriggerable[keyLink].secondControlPoint;
                this.linkDataArray[i].controls = [firstControlPoint.x, firstControlPoint.y, secondControlPoint.x, secondControlPoint.y, lastPoint.x, lastPoint.y];
            } else {
                let keyLink = this.linkDataArray[i].key;
                let firstPoint = this.controlPointTransition[keyLink].firstPoint;
                let lastPoint = this.controlPointTransition[keyLink].lastPoint;
                let firstControlPoint = this.controlPointTransition[keyLink].firstControlPoint;
                let secondControlPoint = this.controlPointTransition[keyLink].secondControlPoint;
                this.linkDataArray[i].controls = [firstControlPoint.x, firstControlPoint.y, secondControlPoint.x, secondControlPoint.y];
            }
        }
    }

    private getNodeDataArray(): Array<StateMachineTemplate | StateTemplate | LinkLabelTemplate> {
        let nodeDataArray: Array<StateMachineTemplate | StateTemplate | LinkLabelTemplate> = [];
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

    private getControlPointTransition(transitionGraphicalData: NodeListOf<Element>): { [key: string]: Curve } {
        let controlPoints: { [key: string]: Curve } = {};
        for (let i = 0; i < transitionGraphicalData.length; i++) {
            let id = transitionGraphicalData[i].getAttribute(graphicalTags.Id);
            let points = transitionGraphicalData[i].getElementsByTagName(graphicalTags.Point);
            controlPoints[id] = {
                firstPoint: {
                    x: parseFloat(points[0].getElementsByTagName(graphicalTags.X)[0].innerHTML),
                    y: parseFloat(points[0].getElementsByTagName(graphicalTags.Y)[0].innerHTML)
                },
                firstControlPoint: {
                    x: parseFloat(points[1].getElementsByTagName(graphicalTags.X)[0].innerHTML),
                    y: parseFloat(points[1].getElementsByTagName(graphicalTags.Y)[0].innerHTML)
                },
                secondControlPoint: {
                    x: parseFloat(points[2].getElementsByTagName(graphicalTags.X)[0].innerHTML),
                    y: parseFloat(points[2].getElementsByTagName(graphicalTags.Y)[0].innerHTML)
                },
                lastPoint: {
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
                key: group + modelTags.Separator + name,
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