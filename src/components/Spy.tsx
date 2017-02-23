
import "grommet/grommet-hpinc.min.css";
import * as React from "react";

import { connect } from "react-redux";
import { getApiList, selectApi, formSubmit } from "actions/configForm";

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        test: () => {
            console.error(ownProps);
        }
    };
};

let Spy = ({
    test
}) => {
    test();
    return (
        <div>
            HELLO SPY
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Spy);