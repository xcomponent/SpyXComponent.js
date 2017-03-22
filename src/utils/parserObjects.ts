export interface Point {
    x: number;
    y: number;
};

export interface Curve {
    firstPoint: Point;
    firstControlPoint: Point;
    secondControlPoint: Point;
    lastPoint: Point;
};

export interface StateMachine {
    name: string;
    publicMember: string;
};

export interface State {
    name: string;
    group: string;
    key: string;
    isFinal: boolean;
    isPatternTransitionState: boolean;
    isEntryPoint?: boolean;
};

export interface ComponentGraphicalModel {
    model: string;
    graphical: string;
};