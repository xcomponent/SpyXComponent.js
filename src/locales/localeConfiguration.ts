import { addLocaleData } from "react-intl";
import * as en from "react-intl/locale-data/en";
import localeData from "./data";

export const getLocalizedResources = () => {
    addLocaleData([...en]);
    const language = navigator.language;
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
    const messages = (<any>localeData).en;
    return messages;
};