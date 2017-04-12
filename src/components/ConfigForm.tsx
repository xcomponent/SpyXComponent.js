
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
import { getApiList, selectApi, formSubmit } from "actions";
import Footer from "components/Footer";
import { XCSpyState } from "reducers/SpyReducer";
import { Dispatch } from "redux";

interface ConfigFormGlobalProps extends ConfigFormProps, ConfigFormCallbackProps {
};

interface ConfigFormProps {
    apis: string[];
    selectedApi: string;
    serverUrlState: string;
};

interface ConfigFormCallbackProps {
    onClickGetApiList: (serverUrl: string) => void;
    onChangeSelectedApi: (selectedApi: string) => void;
    onClickSubmit: () => void;
};

const mapStateToProps = (state: XCSpyState): ConfigFormProps => {
    return {
        apis: state.configForm.apis,
        selectedApi: state.configForm.selectedApi,
        serverUrlState: state.configForm.serverUrl
    };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>): ConfigFormCallbackProps => {
    return {
        onClickGetApiList: (serverUrl: string): void => {
            dispatch(getApiList(serverUrl));
        },
        onChangeSelectedApi: (selectedApi: string): void => {
            dispatch(selectApi(selectedApi));
        },
        onClickSubmit: (): void => {
            dispatch(formSubmit());
        }
    };
};

let ConfigForm = ({
    onClickSubmit,
    onChangeSelectedApi,
    onClickGetApiList,
    apis,
    serverUrlState,
    selectedApi
}: ConfigFormGlobalProps) => {
    let serverUrl = serverUrlState;
    return (
        <Box full={true}>
            <Box pad="medium" align="center" justify="center" flex={true}>
                <Form>
                    <Header>
                        <Box align="center" justify="between" flex={true}>
                            <Title>
                                Configuration form
                            </Title>
                        </Box>
                    </Header>
                    <FormField>
                        <fieldset>
                            <label htmlFor="serverUrl">Server Url:</label>
                            <TextInput id="serverUrl"
                                onSelect={(e) => {
                                    e.target.value = e.suggestion;
                                    serverUrl = e.suggestion;
                                }}
                                onDOMChange={(e) => {
                                    serverUrl = e.target.value;
                                }}
                                suggestions={["wss://localhost:443", "wss://commandcenter.xcomponent.com/bridge:443"]} />
                        </fieldset>
                    </FormField>
                    <FormField>
                        <fieldset>
                            <label htmlFor="API">API Name:</label>
                            <Select
                                options={apis}
                                value={selectedApi}
                                onChange={(e) => {
                                    onChangeSelectedApi(e.value);
                                }} />
                        </fieldset>
                    </FormField>
                    <Button
                        primary={true}
                        type="button"
                        label="getApiList"
                        onClick={() => {
                            onClickGetApiList(serverUrl);
                        }} />
                    <Button
                        primary={true}
                        type="button"
                        label="Submit"
                        onClick={onClickSubmit} />
                </Form >
            </Box>
            <Footer />
        </Box>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigForm);