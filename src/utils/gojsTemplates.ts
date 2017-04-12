export interface LinkLabelTemplate {
    key: string;
    category: string;
    text: string;
};

export interface StateTemplate {
    key: string;
    text: string;
    group: string;
    stateName: string;
    numberOfStates: number;
    fill: string;
    stroke: string;
    loc: string;
};

export interface StateMachineTemplate {
    key: string;
    text: string;
    isGroup: boolean;
    numberOfInstances: number;
};

export interface LinkInterface {
    key: string;
    from: string;
    to: string;
    triggerable: boolean;
    controls: Array<number>;
};

export interface TransitionTemplate extends LinkInterface {
    strokeLink: string;
    strokeArrow: string;
    fillArrow: string;
};

export interface TriggerableTransitionTemplate extends LinkInterface {
    stateMachineTarget: string;
    text: string;
    messageType: string;
    labelKeys: Array<String>;
};

export type LinkDataArrayTemplate = TransitionTemplate | TriggerableTransitionTemplate;
export type NodeDataArrayTemplate = StateMachineTemplate | StateTemplate | LinkLabelTemplate;
