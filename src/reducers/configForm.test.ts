import * as deepFreeze from "deep-freeze";
import { getApiList, selectApi, formSubmit } from "../actions/configForm";
import { GET_API_LIST, SELECT_API, FORM_SUBMIT } from "../actions/configForm";
import { configFormReducer } from "./configForm";
import { SET_SERVER_URL } from "../actions";

describe("Test configForm reducer", () => {
    it("When an GET_API_LIST action is received, it should update the apis array", () => {
        const stateBefore = {
            apis: [],
            selectedApi: undefined,
            serverUrl: undefined,
            formSubmited: false
        };
        deepFreeze(stateBefore);
        const serverUrl = "wss://localhost:443";
        const apis = ["Hello.xcApi", "GoodBye.xcApi"];
        const action = {
            type: GET_API_LIST,
            serverUrl,
            apis,
            selectedApi: undefined
        };
        deepFreeze(action);
        const stateAfter = {
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
        const selectedApi = "Hello.xcApi";
        const serverUrl = "wss://localhost:443";
        const apis = ["Hello.xcApi", "GoodBye.xcApi"];

        const stateBefore = {
            apis,
            serverUrl,
            selectedApi: "random",
            formSubmited: false
        };

        deepFreeze(stateBefore);
        const action = {
            type: SELECT_API,
            selectedApi,
            serverUrl: undefined,
            apis: undefined
        };
        deepFreeze(action);
        const stateAfter = {
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
        const selectedApi = "Hello.xcApi";
        const serverUrl = "wss://localhost:443";
        const apis = ["Hello.xcApi", "GoodBye.xcApi"];

        const stateBefore = {
            apis,
            serverUrl,
            selectedApi,
            formSubmited: false
        };

        deepFreeze(stateBefore);
        const action = {
            type: FORM_SUBMIT,
            selectedApi,
            serverUrl: undefined,
            apis: undefined
        };
        deepFreeze(action);
        const stateAfter = {
            apis,
            serverUrl,
            selectedApi,
            formSubmited: true
        };
        expect(
            configFormReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When an SET_SERVER_URL action is received, it should update the current server url", () => {
        const serverUrl = "wss://localhost:443";

        const stateBefore = {
            apis: [],
            serverUrl: undefined,
            selectedApi: "",
            formSubmited: false
        };

        deepFreeze(stateBefore);
        const action = {
            type: SET_SERVER_URL,
            serverUrl
        };
        deepFreeze(action);
        const stateAfter = {
            apis: [],
            serverUrl,
            selectedApi: "",
            formSubmited: false
        };
        expect(
            configFormReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

});