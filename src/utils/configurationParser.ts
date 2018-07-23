export const fatalErrorState = "FatalError";

export const modelTags: { [key: string]: string } = {
    ComponentData: "ComponentData",
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
    Type: "Type",
    // state
    IsEntryPoint: "IsEntryPoint",
    State: "State",
    Separator: "&",
    // transition pattern
    TransitionPatternStates: "TransitionPatternStates",
    TransitionPatternStateData: "TransitionPatternStateData",
    SelectedStatesKeys: "SelectedStatesKeys",
    string: "string",
    TP_State: "TP_State",
    StateGraphicalData: "StateGraphicalData",
};

export const graphicalTags: { [key: string]: string } = {
    StateGraphicalData: "StateGraphicalData",
    Id: "Id",
    CenterX: "CenterX",
    CenterY: "CenterY",
    TransitionGraphicalData: "TransitionGraphicalData",
    TransversalLinks: "TransversalLinks",
    Links: "Links",
    Point: "Point",
    X: "X",
    Y: "Y",
    States: "States",
    TransitionPatternStates: "TransitionPatternStates"
};
