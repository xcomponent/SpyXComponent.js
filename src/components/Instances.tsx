import * as React from "react";
import { connect } from "react-redux";
import { XCSpyState } from "reducers/SpyReducer";
import { Instance } from "reducers/components";
import { Dispatch } from "redux";

interface InstancesGlobalProps extends InstancesProps, InstancesCallbackProps {
};

interface InstancesProps {
    getInstances: () => { [id: number]: Instance };
    onChangeOwnProps: (id: string) => void;
    getId: () => string;
};

interface InstancesCallbackProps {
};

const mapStateToProps = (state: XCSpyState, ownProps): InstancesProps => {
    return {
        getInstances: (): { [id: number]: Instance } => {
            const componentProperties = state.components.componentProperties;
            const currentComponent = state.components.currentComponent;
            const stateMachine = ownProps.stateMachine;
            return componentProperties[currentComponent].stateMachineProperties[stateMachine];
        },
        onChangeOwnProps: ownProps.onChange,
        getId: (): string => {
            if (state.transitionProperties.active) {
                return state.transitionProperties.id;
            } else {
                return state.stateMachineProperties.id;
            }
        }
    };
};

const getStyle = (id: string, instances: { [id: number]: Instance }) => {
    const redColor = "#ED0000";
    const whiteColor = "#FFFFFF";
    const backgroundColor = (id && instances[id].isFinal) ? redColor : whiteColor;
    return {
        "backgroundColor": backgroundColor
    };
};

const Instances = ({
    onChangeOwnProps,
    getInstances,
    getId
 }: InstancesGlobalProps) => {
    const id = getId();
    return (
        <select style={getStyle(id, getInstances())} value={id} onChange={(e) => {
            onChangeOwnProps(e.currentTarget.value);
        }}>
            {Object.keys(getInstances()).map((id) => {
                return (
                    <option key={id} value={id} style={getStyle(id, getInstances())}>#{id}</option>
                );
            })}
        </select>
    );

};

export default connect(mapStateToProps)(Instances);
