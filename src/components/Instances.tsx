import * as React from "react";
import { connect } from "react-redux";
import { XCSpyState } from "../reducers/spyReducer";
import { Instance } from "../reducers/components";
import { Dispatch } from "redux";
import { stateColor, finalStateInstanceColor, fatalErrorStateInstanceColor } from "../utils/graphicColors";

interface InstancesGlobalProps extends InstancesProps, InstancesCallbackProps {
};

interface InstancesProps {
    instances: { [id: number]: Instance };
    onChangeOwnProps: (id: string) => void;
    id: string;
};

interface InstancesCallbackProps {
};

const mapStateToProps = (state: XCSpyState, ownProps): InstancesProps => {
    const id = (state.transitionProperties.active) ? state.transitionProperties.id : state.stateMachineProperties.id;
    return {
        instances: ownProps.instances,
        onChangeOwnProps: ownProps.onChange,
        id: id
    };
};

const getStyle = (id: string, instances: { [id: number]: Instance }) => {
    let backgroundColor;
    if (id && instances[id].isFinal) {
        backgroundColor = finalStateInstanceColor;
    } else if (id && instances[id].stateMachineRef.StateName === "FatalError") {
        backgroundColor = fatalErrorStateInstanceColor;
    } else {
        backgroundColor = stateColor;
    }
    return {
        "backgroundColor": backgroundColor
    };
};

const Instances = ({
    onChangeOwnProps,
    instances,
    id
 }: InstancesGlobalProps) => {
    return (
        <select style={getStyle(id, instances)} value={id} onChange={(e) => {
            onChangeOwnProps(e.currentTarget.value);
        }}>
            {Object.keys(instances).map((id) => {
                return (
                    <option key={id} value={id} style={getStyle(id, instances)}>#{id}</option>
                );
            })}
        </select>
    );

};

export default connect(mapStateToProps)(Instances);
