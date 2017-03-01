import * as deepFreeze from "deep-freeze";
import { getApiList, selectApi, formSubmit } from "actions/configForm";
import { GET_API_LIST, SELECT_API, FORM_SUBMIT } from "actions/configForm";
import { configFormReducer } from "reducers/configForm";

describe("Test configForm reducer", () => {
    it("When an GET_API_LIST action is received, it should update the apis array", () => {
        let stateBefore = {
            apis: [],
            selectedApi: undefined,
            serverUrl: undefined,
            formSubmited: false
        };
        deepFreeze(stateBefore);
        let serverUrl = "wss://localhost:443";
        let apis = ["Hello.xcApi", "GoodBye.xcApi"];
        let action = {
            type: GET_API_LIST,
            serverUrl,
            apis,
            selectedApi: undefined
        };
        let stateAfter = {
            apis,
            selectedApi: apis[0],
            serverUrl,
            formSubmited: false
        };
        expect(
            configFormReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When an SELECT_API action is received, it should update the selectedApi field", () => {
        let selectedApi = "Hello.xcApi";
        let serverUrl = "wss://localhost:443";
        let apis = ["Hello.xcApi", "GoodBye.xcApi"];

        let stateBefore = {
            apis,
            serverUrl,
            selectedApi: "random",
            formSubmited: false
        };

        deepFreeze(stateBefore);
        let action = {
            type: SELECT_API,
            selectedApi,
            serverUrl: undefined,
            apis: undefined
        };
        let stateAfter = {
            apis,
            serverUrl,
            selectedApi,
            formSubmited: false
        };
        expect(
            configFormReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When an FORM_SUBMIT action is received, it should update the formSubmited field", () => {
        let selectedApi = "Hello.xcApi";
        let serverUrl = "wss://localhost:443";
        let apis = ["Hello.xcApi", "GoodBye.xcApi"];

        let stateBefore = {
            apis,
            serverUrl,
            selectedApi,
            formSubmited: false
        };

        deepFreeze(stateBefore);
        let action = {
            type: FORM_SUBMIT,
            selectedApi,
            serverUrl: undefined,
            apis: undefined
        };
        let stateAfter = {
            apis,
            serverUrl,
            selectedApi,
            formSubmited: true
        };
        expect(
            configFormReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });
});