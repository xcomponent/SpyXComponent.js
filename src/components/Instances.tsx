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
        id: ownProps.id
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
    id
 }) => {
    return (
        <select style={getStyle(id, getInstances())} onChange={(e) => {
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
