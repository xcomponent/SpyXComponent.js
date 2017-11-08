import * as deepFreeze from "deep-freeze";
import { SHOW_SIDE_BAR, HIDE_SIDE_BAR } from "../actions/sideBar";
import { sideBarReducer } from "./sideBar";

describe("Test sideBar reducer", () => {
    it("When an SHOW_SIDE_BAR action is received, it should set the state to true", () => {
        const stateBefore = {
            isVisible: false
        }
        deepFreeze(stateBefore);
        const action = {
            type: SHOW_SIDE_BAR,
        };
        deepFreeze(action);
        const stateAfter = {
            isVisible: true
        };
        expect(
            sideBarReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When an HIDE_SIDE_BAR action is received, it should set the state to false", () => {
        const stateBefore = {
            isVisible: true
        }
        deepFreeze(stateBefore);
        const action = {
            type: HIDE_SIDE_BAR,
        };
        deepFreeze(action);
        const stateAfter = {
            isVisible: false
        };
        expect(
            sideBarReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

});