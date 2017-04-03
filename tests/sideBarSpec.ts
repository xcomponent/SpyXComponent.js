import * as deepFreeze from "deep-freeze";
import { SHOW_SIDE_BAR, HIDE_SIDE_BAR } from "actions/sideBar";
import { sideBarReducer } from "reducers/sideBar";

describe("Test sideBar reducer", () => {
    it("When an SHOW_SIDE_BAR action is received, it should set the state to true", () => {
        let stateBefore = {
            isVisible: false
        }
        deepFreeze(stateBefore);
        let action = {
            type: SHOW_SIDE_BAR,
        };
        let stateAfter = {
            isVisible: true
        };
        expect(
            sideBarReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When an HIDE_SIDE_BAR action is received, it should set the state to false", () => {
        let stateBefore = {
            isVisible: true
        }
        deepFreeze(stateBefore);
        let action = {
            type: HIDE_SIDE_BAR,
        };
        let stateAfter = {
            isVisible: false
        };
        expect(
            sideBarReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

});