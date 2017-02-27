"use strict";

export class Parser {

    tags: any;
    tagsGraphical: any;
    locations: any;
    controlPointTransition: any;
    controlPointTriggerable: any;
    component: any;
    stateMachines: any;
    stateMachineNames: any;
    states: any;
    entryPoints: any;
    linkDataArray: any;
    linksLabel: any;
    finalStates: any;
    nodeDataArray: any;

    constructor() {
        this.tags = {
            ComponentViewModelData: "ComponentViewModelData",
            PublicMember: "PublicMember",
            // state machine
            StateMachineData: "StateMachineData",
            Name: "Name",
            Id: "Id",
            ToId: "ToId",
            StateData: "StateData",
            SubGraphKey: "SubGraphKey",
            StateMachine: "StateMachine",
            // transition
            TransitionName: "TransitionName",
            TriggeringEvent: "TriggeringEvent",
            TransitionData: "TransitionData",
            FromKey: "FromKey",
            ToKey: "ToKey",
            TransversalTransitionData: "TransversalTransitionData",
            // state
            IsEntryPoint: "IsEntryPoint",
            State: "State",
            separator: "&"
        };
        this.tagsGraphical = {
            StateGraphicalData: "StateGraphicalData",
            Id: "Id",
            CenterX: "CenterX",
            CenterY: "CenterY",
            TransitionGraphicalData: "TransitionGraphicalData",
            TransversalLinks: "TransversalLinks",
            Links: "Links",
            Point: "Point",
            X: "X",
            Y: "Y"
        };
    }

    parseGraphical(xmlGraphical) {
        this.locations = {};
        let xmlGraphicalDom = (new DOMParser()).parseFromString(xmlGraphical, "text/xml");
        let stateGraphicalDatas = xmlGraphicalDom.getElementsByTagName(this.tagsGraphical.StateGraphicalData);
        for (let i = 0; i < stateGraphicalDatas.length; i++) {
            let id = stateGraphicalDatas[i].getAttribute(this.tagsGraphical.Id);
            this.locations[id] = {
                x: stateGraphicalDatas[i].getAttribute(this.tagsGraphical.CenterX),
                y: stateGraphicalDatas[i].getAttribute(this.tagsGraphical.CenterY)
            };
        }
        let transitionGraphicalDatas;
        transitionGraphicalDatas = xmlGraphicalDom.getElementsByTagName(this.tagsGraphical.Links)[0]
            .getElementsByTagName(this.tagsGraphical.TransitionGraphicalData);
        this.controlPointTransition = this.getControlPointTransition(transitionGraphicalDatas);

        transitionGraphicalDatas = xmlGraphicalDom.getElementsByTagName(this.tagsGraphical.TransversalLinks)[0]
            .getElementsByTagName(this.tagsGraphical.TransitionGraphicalData);
        this.controlPointTriggerable = this.getControlPointTransition(transitionGraphicalDatas);
    }

    parseModel(scxml) {
        let scxmlDom = (new DOMParser()).parseFromString(scxml, "text/xml");
        this.component = this.getComponent(scxmlDom);
        let sm = this.getStateMachines(scxmlDom);
        this.stateMachines = sm.stateMachines;
        this.stateMachineNames = sm.stateMachineNames;
        let s = this.getStates(scxmlDom);
        this.states = s.states;
        this.entryPoints = s.entryPoints;
        let links = this.getLinks(scxmlDom);
        this.linkDataArray = links.linkDataArray;
        this.linksLabel = links.linksLabel;
        this.finalStates = this.getFinalStates();
        this.nodeDataArray = this.getNodeDataArray();
        this.nodeDataArray = this.nodeDataArray.concat(this.linksLabel);
        this.addControlPoint();
    }

    addControlPoint() {
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

    getNodeDataArray() {
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

    getControlPointTransition(transitionGraphicalDatas) {
        let locationForNodeDataArray = {
        };
        for (let i = 0; i < transitionGraphicalDatas.length; i++) {
            let id = transitionGraphicalDatas[i].getAttribute(this.tagsGraphical.Id);
            let points = transitionGraphicalDatas[i].getElementsByTagName(this.tagsGraphical.Point);
            locationForNodeDataArray[id] = {
                p1: {
                    x: parseFloat(points[0].getElementsByTagName(this.tagsGraphical.X)[0].innerHTML),
                    y: parseFloat(points[0].getElementsByTagName(this.tagsGraphical.Y)[0].innerHTML)
                },
                c1: {
                    x: parseFloat(points[1].getElementsByTagName(this.tagsGraphical.X)[0].innerHTML),
                    y: parseFloat(points[1].getElementsByTagName(this.tagsGraphical.Y)[0].innerHTML)
                },
                c2: {
                    x: parseFloat(points[2].getElementsByTagName(this.tagsGraphical.X)[0].innerHTML),
                    y: parseFloat(points[2].getElementsByTagName(this.tagsGraphical.Y)[0].innerHTML)
                },
                p2: {
                    x: parseFloat(points[3].getElementsByTagName(this.tagsGraphical.X)[0].innerHTML),
                    y: parseFloat(points[3].getElementsByTagName(this.tagsGraphical.Y)[0].innerHTML)
                }
            };
        }

        return locationForNodeDataArray;
    }

    getLocation(id) {
        id = id.substring(this.tags.State.length, id.length);
        return this.locations[id].x + " " + this.locations[id].y;
    }

    getFinalStates() {
        let finalStates = [];
        for (let id in this.states) {
            if (this.states[id].isFinal) {
                finalStates.push(this.states[id].key);
            }
        }
        return finalStates;
    }

    getLinks(scxmlDom) {
        let tags = this.tags;
        let linksDom = scxmlDom.getElementsByTagName(tags.TransitionData);
        let linkDataArray = [];
        let linksLabel = [];
        let key,
            from,
            to,
            text;

        for (let i = 0; i < linksDom.length; i++) {
            from = this.states[linksDom[i].getAttribute(tags.FromKey)];
            from.isFinal = false;
            to = this.states[linksDom[i].getAttribute(tags.ToKey)];
            text = linksDom[i].getAttribute(tags.Name);
            // key = from.key + tags.separator + to.key + tags.separator + text;
            key = linksDom[i].getAttribute(tags.Id);
            linkDataArray.push({
                "key": key,
                "from": from.key,
                "stateMachineTarget": from.group,
                "to": to.key,
                "text": text,
                "messageType": linksDom[i].getAttribute(tags.TriggeringEvent),
                "labelKeys": [key]
            });
            linksLabel.push({
                "key": key,
                "category": "LinkLabel",
                "text": text
            });
        }

        // triggerable
        let triggerableLinksDom = scxmlDom.getElementsByTagName(tags.TransversalTransitionData);
        for (let j = 0; j < triggerableLinksDom.length; j++) {
            linkDataArray.push({
                "key": triggerableLinksDom[j].getAttribute(tags.Id),
                "from": this.states[triggerableLinksDom[j].getAttribute(tags.FromKey)].key,
                "to": triggerableLinksDom[j].getAttribute(tags.ToId),
                "strokeLink": "red",
                "strokeArrow": "red",
                "fillArrow": "red",
                "selectionAdorned": false,
                triggerable: true
            });
        }
        return {
            linkDataArray: linkDataArray,
            linksLabel: linksLabel
        };
    }

    getStates(scxmlDom) {
        let tags = this.tags;
        let statesDom = scxmlDom.getElementsByTagName(tags.StateData);
        let states = {};
        let id,
            group,
            name,
            isEntryPoint;
        let entryPoints = [];
        for (let i = 0; i < statesDom.length; i++) {
            id = statesDom[i].getAttribute(tags.SubGraphKey);
            group = this.stateMachines[id].name;
            name = statesDom[i].getAttribute(tags.Name);
            isEntryPoint = statesDom[i].getAttribute(tags.IsEntryPoint) === "true";
            states[tags.State + statesDom[i].getAttribute(tags.Id)] = {
                name: name,
                group: group,
                key: group + tags.separator + name,
                isFinal: true
            };
            if (isEntryPoint) {
                entryPoints.push(group);
            }
        }
        return {
            states: states,
            entryPoints: entryPoints
        };
    }

    getStateMachines(scxmlDom) {
        let tags = this.tags;
        let stateMachineDom = scxmlDom.getElementsByTagName(tags.StateMachineData);
        let stateMachines = {};
        let stateMachineNames = [];
        let id, name;
        for (let i = 0; i < stateMachineDom.length; i++) {
            id = stateMachineDom[i].getAttribute(tags.Id);
            name = stateMachineDom[i].getAttribute(tags.Name);
            stateMachines[tags.StateMachine + id] = {
                name: name,
                publicMember: stateMachineDom[i].getAttribute(tags.PublicMember)
            };
            stateMachineNames.push(name);
        }
        return {
            stateMachines: stateMachines,
            stateMachineNames: stateMachineNames
        };
    }

    getComponent(scxmlDom) {
        let tags = this.tags;
        return scxmlDom
            .getElementsByTagName(tags.ComponentViewModelData)[0]
            .getAttribute(tags.Name);
    }
}