import * as React from "react";
import * as FooterGrommet from "grommet/components/Footer";

const Footer = () => {
    return (
        <FooterGrommet
            appCentered={true}
            direction="column"
            align="center"
            pad="small"
            colorIndex="grey-1">
            <p>Build your micro-services with{" "}
                <a href="http://www.xcomponent.com/" target="_blank">XComponent</a>
            </p>
        </FooterGrommet>
    );
};

export default Footer;
