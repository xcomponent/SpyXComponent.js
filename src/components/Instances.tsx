import * as React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state, ownProps) => {
    return {
        getInstances: () => {
            let componentProperties = state.components.componentProperties;
            let currentComponent = state.components.currentComponent;
            let stateMachine = ownProps.stateMachine;
            return componentProperties[currentComponent].stateMachineProperties[stateMachine];
        },
        onChange: ownProps.onChange,
        getId: () => {
            if (state.transitionProperties.active) {
                return state.transitionProperties.id;
            } else {
                return state.stateMachineProperties.id;
            }
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

const getStyle = (id, instances) => {
    let redColor = "#ED0000";
    let whiteColor = "#FFFFFF";
    let backgroundColor = (id && instances[id].isFinal) ? redColor : whiteColor;
    return {
        "backgroundColor": backgroundColor
    };
};

const Instances = ({
    onChange,
    getInstances,
    getId
 }) => {
    let id = getId();
    return (
        <select style={getStyle(id, getInstances())} value={id} onChange={(e) => {
            onChange(e.currentTarget.value);
        }}>
            {Object.keys(getInstances()).map((id) => {
                return (
                    <option key={id} value={id} style={getStyle(id, getInstances())}>#{id}</option>
                );
            })}
        </select>
    );

};

export default connect(mapStateToProps, mapDispatchToProps)(Instances);