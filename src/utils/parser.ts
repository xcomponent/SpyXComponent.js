import { graphicalTags, modelTags } from "utils/configurationParser";
import { LinkLabelTemplate, TransitionTemplate, TriggerableTransitionTemplate, StateMachineTemplate, StateTemplate } from "utils/gojsTemplates";
import { Point, Curve, StateMachine, State, ComponentGraphicalModel } from "utils/parserObjects";
import { finalStateColor, stateColor, transitionPatternStateColor, entryPointStateColor } from "utils/graphicColors";
export class Parser {

    private locations: { [key: string]: Point };
    private controlPointTransition: { [key: string]: Curve };
    private controlPointTriggerable: { [key: string]: Curve };
    private stateMachines: { [key: string]: StateMachine };
    private states: { [key: string]: State };
    private transitionPatternStates: { [key: string]: State };
    private linksLabel: Array<LinkLabelTemplate>;
    private componentGraphicalModel: ComponentGraphicalModel;

    public finalStates: Array<String>;
    public entryPointState: string;
    public entryPointStateMachine: string;
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
        const xmlGraphicalDom = (new DOMParser()).parseFromString(this.componentGraphicalModel.graphical, "text/xml");
        let stateGraphicalData = xmlGraphicalDom.getElementsByTagName(graphicalTags.States)[0].getElementsByTagName(graphicalTags.StateGraphicalData);
        for (let i = 0; i < stateGraphicalData.length; i++) {
            const id = stateGraphicalData[i].getAttribute(graphicalTags.Id);
            this.locations[id] = {
                x: parseFloat(stateGraphicalData[i].getAttribute(graphicalTags.CenterX)),
                y: parseFloat(stateGraphicalData[i].getAttribute(graphicalTags.CenterY))
            };
        }

        stateGraphicalData = xmlGraphicalDom.getElementsByTagName(graphicalTags.TransitionPatternStates)[0].getElementsByTagName(graphicalTags.StateGraphicalData);
        for (let i = 0; i < stateGraphicalData.length; i++) {
            const id = stateGraphicalData[i].getAttribute(graphicalTags.Id);
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
        const scxmlDom = (new DOMParser()).parseFromString(this.componentGraphicalModel.model, "text/xml");
        this.setStateMachines(scxmlDom);
        this.setStates(scxmlDom);
        this.setLinks(scxmlDom);
        this.finalStates = this.getFinalStates();
        this.entryPointState = this.getEntyPointState();
        this.nodeDataArray = this.getNodeDataArray();
        this.nodeDataArray = this.nodeDataArray.concat(this.linksLabel);
        this.addControlPoint();
    }

    private addControlPoint(): void {
        for (let i = 0; i < this.linkDataArray.length; i++) {
            if (this.linkDataArray[i].triggerable) {
                const keyLink = this.linkDataArray[i].key;
                const firstPoint = this.controlPointTriggerable[keyLink].firstPoint;
                const lastPoint = this.controlPointTriggerable[keyLink].lastPoint;
                const firstControlPoint = this.controlPointTriggerable[keyLink].firstControlPoint;
                const secondControlPoint = this.controlPointTriggerable[keyLink].secondControlPoint;
                this.linkDataArray[i].controls = [firstControlPoint.x, firstControlPoint.y, secondControlPoint.x, secondControlPoint.y, lastPoint.x, lastPoint.y];
            } else {
                const keyLink = this.linkDataArray[i].key;
                const firstPoint = this.controlPointTransition[keyLink].firstPoint;
                const lastPoint = this.controlPointTransition[keyLink].lastPoint;
                const firstControlPoint = this.controlPointTransition[keyLink].firstControlPoint;
                const secondControlPoint = this.controlPointTransition[keyLink].secondControlPoint;
                this.linkDataArray[i].controls = [firstControlPoint.x, firstControlPoint.y, secondControlPoint.x, secondControlPoint.y];
            }
        }
    }

    private getNodeDataArray(): Array<StateMachineTemplate | StateTemplate | LinkLabelTemplate> {
        const nodeDataArray: Array<StateMachineTemplate | StateTemplate | LinkLabelTemplate> = [];
        let ids, state, stateMachine, id;
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
        ids = Object.keys(this.states).concat(Object.keys(this.transitionPatternStates));
        for (let j = 0; j < ids.length; j++) {
            state = this.states[ids[j]];
            let loc, color, text;
            if (!this.states[ids[j]]) {
                id = ids[j].substring(modelTags.TP_State.length, ids[j].length);
                loc = this.locations[id].x + " " + this.locations[id].y;
                color = transitionPatternStateColor;
                state = this.transitionPatternStates[ids[j]];
                text = state.name;
            } else {
                id = ids[j].substring(modelTags.State.length, ids[j].length);
                loc = this.locations[id].x + " " + this.locations[id].y;
                text = state.name + " (0)";
                if (state.isFinal) {
                    color = finalStateColor;
                } else if (!state.isEntryPoint) {
                    color = stateColor;
                } else {
                    color = entryPointStateColor;
                }
            }
            nodeDataArray.push({
                "key": state.key,
                "text": text,
                "group": state.group,
                "stateName": state.name,
                "numberOfStates": 0,
                "fill": color,
                "stroke": color,
                "loc": loc
            });
        }
        return nodeDataArray;
    }

    private getControlPointTransition(transitionGraphicalData: NodeListOf<Element>): { [key: string]: Curve } {
        const controlPoints: { [key: string]: Curve } = {};
        for (let i = 0; i < transitionGraphicalData.length; i++) {
            const id = transitionGraphicalData[i].getAttribute(graphicalTags.Id);
            const points = transitionGraphicalData[i].getElementsByTagName(graphicalTags.Point);
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
        const finalStates = [];
        for (let id in this.states) {
            if (this.states[id].isFinal) {
                finalStates.push(this.states[id].key);
            }
        }
        return finalStates;
    }

    private getEntyPointState(): string {
        for (let id in this.states) {
            if (this.states[id].isEntryPoint) {
                return this.states[id].key;
            }
        }
    }

    private setLinks(scxmlDom: Document): void {
        const linksDom = scxmlDom.getElementsByTagName(modelTags.TransitionData);
        this.linkDataArray = [];
        this.linksLabel = [];
        let key,
            from,
            to,
            text;
        for (let i = 0; i < linksDom.length; i++) {
            from = this.states[linksDom[i].getAttribute(modelTags.FromKey)];
            if (!from) {
                from = this.transitionPatternStates[linksDom[i].getAttribute(modelTags.FromKey)];
                for (let k = 0; k < from.selectedStatesKeys.length; k++) {
                    this.states[from.selectedStatesKeys[k]].isFinal = false;
                }
            }
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

        const triggerableLinksDom = scxmlDom.getElementsByTagName(modelTags.TransversalTransitionData);
        for (let j = 0; j < triggerableLinksDom.length; j++) {
            from = this.states[triggerableLinksDom[j].getAttribute(modelTags.FromKey)];
            if (!from)
                from = this.transitionPatternStates[triggerableLinksDom[j].getAttribute(modelTags.FromKey)];
            this.linkDataArray.push({
                "key": triggerableLinksDom[j].getAttribute(modelTags.Id),
                "from": from.key,
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
        const statesDom = scxmlDom.getElementsByTagName(modelTags.StateData);
        const states = {};
        let id,
            group,
            name,
            isEntryPoint;
        let entryPointStateMachine;
        for (let i = 0; i < statesDom.length; i++) {
            id = statesDom[i].getAttribute(modelTags.SubGraphKey);
            group = this.stateMachines[id].name;
            name = statesDom[i].getAttribute(modelTags.Name);
            isEntryPoint = statesDom[i].getAttribute(modelTags.IsEntryPoint) === "true";
            states[modelTags.State + statesDom[i].getAttribute(modelTags.Id)] = {
                name: name,
                group: group,
                key: group + modelTags.Separator + name,
                isFinal: true,
                isEntryPoint: isEntryPoint
            };
            if (isEntryPoint) {
                entryPointStateMachine = group;
            }

        }
        // transition pattern state
        const transitionPatternStates = {};
        const transitionPatternStateDataDom = scxmlDom.getElementsByTagName(modelTags.TransitionPatternStateData);
        for (let i = 0; i < transitionPatternStateDataDom.length; i++) {
            id = transitionPatternStateDataDom[i].getAttribute(modelTags.SubGraphKey);
            group = this.stateMachines[id].name;
            name = transitionPatternStateDataDom[i].getAttribute(modelTags.Name);
            const selectedStatesKeys = [];
            const selectedStatesKeysDom = transitionPatternStateDataDom[i].getElementsByTagName(modelTags.SelectedStatesKeys)[0]
                .getElementsByTagName(modelTags.string);
            for (let k = 0; k < selectedStatesKeysDom.length; k++) {
                selectedStatesKeys.push(selectedStatesKeysDom[k].innerHTML);
            }
            transitionPatternStates[modelTags.TP_State + transitionPatternStateDataDom[i].getAttribute(modelTags.Id)] = {
                name: name,
                group: group,
                key: group + modelTags.Separator + name,
                isFinal: true,
                isPatternTransitionState: true,
                selectedStatesKeys: selectedStatesKeys
            };
        }
        this.states = states;
        this.transitionPatternStates = transitionPatternStates;
        this.entryPointStateMachine = entryPointStateMachine;
    }

    private setStateMachines(scxmlDom: Document): void {
        const stateMachineDom = scxmlDom.getElementsByTagName(modelTags.StateMachineData);
        const stateMachines = {};
        const stateMachineNames = [];
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