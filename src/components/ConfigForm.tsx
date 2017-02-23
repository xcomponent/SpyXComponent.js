
import "grommet/grommet-hpinc.min.css";
import * as React from "react";
import * as Label from "grommet/components/Label";
import * as Header from "grommet/components/Header";
import * as Title from "grommet/components/Title";
import * as Footer from "grommet/components/Footer";
import * as Button from "grommet/components/Button";
import * as Form from "grommet/components/Form";
import * as FormField from "grommet/components/FormField";
import * as Box from "grommet/components/Box";
import * as CheckBox from "grommet/components/CheckBox";
import * as TextInput from "grommet/components/TextInput";
import * as Select from "grommet/components/Select";
import * as Image from "grommet/components/Image";

import { connect } from "react-redux";
import { getApiList, selectApi, formSubmit } from "actions/configForm";

const mapStateToProps = (state) => {
    return {
        apis: state.configForm.apis,
        selectedApi: state.configForm.selectedApi,
        serverUrlState: state.configForm.serverUrl
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClickGetApiList: (serverUrl) => {
            dispatch(getApiList(serverUrl));
        },
        onChangeSelectedApi: (selectedApi) => {
            dispatch(selectApi(selectedApi));
        },
        onClickSubmit: () => {
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
}) => {
    let serverUrl = serverUrlState;
    return (
        <Box full={true}>
            <Header
                direction="row"
                justify="between"
                pad={{ horizontal: "medium" }}>
            </Header>
            <Box flex={true}>
                <Box pad="medium" align="center" justify="center" flex={true}>
                    <Form>
                        <Header>
                            <Title>
                                Configuration form
                            </Title>
                        </Header>
                        <FormField>
                            <fieldset>
                                <label htmlFor="serverUrl">Server Url:</label>
                                <TextInput id="serverUrl"
                                    onSelect={(e) => {
                                        e.target.value = e.suggestion;
                                        serverUrl = e.suggestion;
                                    } }
                                    onDOMChange={(e) => {
                                        serverUrl = e.target.value;
                                    } }
                                    suggestions={["wss://localhost:443"]} />
                            </fieldset>
                        </FormField>
                        <FormField>
                            <fieldset>
                                <label htmlFor="api">Api Name:</label>
                                <Select placeHolder="None"
                                    options={apis}
                                    value={apis[0]}
                                    onChange={(e) => {
                                        onChangeSelectedApi(e.target.value);
                                    } }/>
                            </fieldset>
                        </FormField>
                        <Button
                            primary={true}
                            type="button"
                            label="getApiList"
                            onClick={() => {
                                onClickGetApiList(serverUrl);
                            } } />
                        <Button
                            primary={true}
                            type="button"
                            label="Submit"
                            onClick={onClickSubmit} />
                    </Form >
                </Box>
            </Box>
        </Box>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigForm);