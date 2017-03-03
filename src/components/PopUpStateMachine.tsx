import * as React from "react";
import { connect } from "react-redux";
import * as Layer from "grommet/components/Layer";
import { hidePopUp } from "actions/popUpStateMachine";
import * as Header from "grommet/components/Header";
import * as Title from "grommet/components/Title";
import * as Form from "grommet/components/Form";
import * as FormField from "grommet/components/FormField";
import * as Button from "grommet/components/Button";
import * as Footer from "grommet/components/Footer";
import sessionXCSpy from "utils/sessionXCSpy";

const mapStateToProps = (state) => {
    return {
        active: state.popUpStateMachine.active,
        stateMachine: state.popUpStateMachine.stateMachine,
        currentComponent: state.components.currentComponent
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        hidePopUpStateMachine: () => {
            dispatch(hidePopUp());
        }
    };
};

const PopUpStateMachine = ({
    hidePopUpStateMachine,
    active,
    stateMachine,
    currentComponent
}) => {
    if (!active)
        return null;
    return (
        <Layer
            closer={true}
            align="right"
            onClose={hidePopUpStateMachine}>
            <Form compact={false}>
                <Header>
                    <Title>{stateMachine}</Title>
                </Header>

                <FormField>
                    <fieldset>
                        <label htmlFor="instances">Instance identifier:
                        </label>
                    </fieldset>
                </FormField>

                <FormField>
                    <fieldset>
                        <label htmlFor="publicMember">Public member : <br />
                            {
                            }
                        </label>
                    </fieldset>
                </FormField>

                <FormField>
                    <fieldset>
                        <label htmlFor="currentState">Current state : {" "}
                            {
                            }
                        </label>
                    </fieldset>
                </FormField>

                <Footer></Footer>
                <Button primary={true} type="button" label="Snapshot" onClick={() => {
                    sessionXCSpy.getPromiseCreateSession()
                        .then((session) => {
                            session.createSubscriber().getSnapshot(currentComponent, stateMachine, (items) => {
                                console.error(items);
                            });
                        });
                }} />
                <Button primary={true} type="button" label="Clear" onClick={() => { }} />
            </Form >
        </Layer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PopUpStateMachine);
