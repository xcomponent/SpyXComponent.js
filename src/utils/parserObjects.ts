export interface Point {
    x: number;
    y: number;
};

export interface Curve {
    p1: Point;
    c1: Point;
    c2: Point;
    p2: Point;
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
};
