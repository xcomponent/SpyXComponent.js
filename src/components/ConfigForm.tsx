
import * as React from "react";
import * as Label from "grommet/components/Label";
import * as Header from "grommet/components/Header";
import * as Title from "grommet/components/Title";
import * as Button from "grommet/components/Button";
import * as Form from "grommet/components/Form";
import * as FormField from "grommet/components/FormField";
import * as Box from "grommet/components/Box";
import * as CheckBox from "grommet/components/CheckBox";
import * as TextInput from "grommet/components/TextInput";
import * as Select from "grommet/components/Select";
import * as Image from "grommet/components/Image";
import { connect } from "react-redux";
import { getApiList, selectApi, formSubmit, setServerUrl } from "../actions";
import Footer from "./Footer";
import { XCSpyState } from "reducers/spyReducer";
import { Dispatch } from "redux";
import { injectIntl, InjectedIntl } from "react-intl";
import { routes } from "../utils/routes";
import { withRouter } from "react-router-dom";
import { Action } from "redux";

interface ConfigFormGlobalProps extends ConfigFormProps, ConfigFormCallbackProps {
}

interface ConfigFormProps {
    intl?: InjectedIntl;
    apis: string[];
    selectedApi: string;
    serverUrlState: string;
}

interface ConfigFormCallbackProps {
    onClickGetApiList: (serverUrl: string) => void;
    onChangeSelectedApi: (selectedApi: string) => void;
    onClickSubmit: () => void;
    onSetServerUrl: (serverUrl: string) => void;
}

const mapStateToProps = (state: XCSpyState, ownProps): ConfigFormProps => {
    return {
        apis: state.configForm.apis,
        selectedApi: state.configForm.selectedApi,
        serverUrlState: state.configForm.serverUrl
    };
};

const mapDispatchToProps = (dispatch, ownProps): ConfigFormCallbackProps => {
    return {
        onClickGetApiList: (serverUrl: string): void => {
            dispatch(getApiList(serverUrl));
        },
        onChangeSelectedApi: (selectedApi: string): void => {
            dispatch(selectApi(selectedApi));
        },
        onClickSubmit: (): void => {
            dispatch(formSubmit());
        },
        onSetServerUrl: (serverUrl: string) => {
            ownProps.history.push(`/form?serverUrl=${serverUrl}`);
            dispatch(setServerUrl(serverUrl));
        }
    };
};

let ConfigForm = ({
    intl,
    onClickSubmit,
    onChangeSelectedApi,
    onClickGetApiList,
    onSetServerUrl,
    apis,
    serverUrlState,
    selectedApi
}: ConfigFormGlobalProps) => {
    return (
        <Box full={true}>
            <Box pad="medium" align="center" justify="center" flex={true}>
                <Form>
                    <Header>
                        <Box align="center" justify="between" flex={true}>
                            <Title>
                                {intl.formatMessage({ id: "app.configuration.form" })}
                            </Title>
                        </Box>
                    </Header>
                    <FormField>
                        <fieldset>
                        <Box full="horizontal">
                            <TextInput
                                placeHolder={intl.formatMessage({ id: "app.serverURL" })}
                                id="serverUrl"
                                value={serverUrlState}
                                onDOMChange={(e) => {
                                    onSetServerUrl(e.target.value);
                                }}
                                onSelect={(e) => {
                                    onSetServerUrl(e.suggestion);
                                }}
                                suggestions={["wss://localhost:443"]} />
                            </Box>

                            <Box align="end">
                                <Button
                                    primary={true}
                                    type="button"
                                    label={intl.formatMessage({ id: "app.get.apis" })}
                                    onClick={() => {
                                        onClickGetApiList(serverUrlState);
                                    }} />

                            </Box>
                        </fieldset>

                    </FormField>
                    <FormField>
                        <fieldset>
                            <Select
                                placeHolder={intl.formatMessage({ id: "app.api" })}
                                options={apis}
                                value={selectedApi}
                                onChange={(e) => {
                                    onChangeSelectedApi(e.value);
                                }} />
                            <Box align="end">
                                <Button
                                    primary={true}
                                    type="button"
                                    label={intl.formatMessage({ id: "app.submit" })}
                                    onClick={onClickSubmit} />
                            </Box>
                        </fieldset>
                    </FormField>


                </Form >

            </Box>
            <Footer />
        </Box>
    );
};

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ConfigForm)));