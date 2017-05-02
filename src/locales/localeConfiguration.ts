import { addLocaleData } from "react-intl";
import * as en from "react-intl/locale-data/en";
import * as fr from "react-intl/locale-data/fr";
import localeData from "./data";

export const getLocalizedResources = (locale: string) => {
    addLocaleData([...fr]);
    addLocaleData([...en]);
    const language = locale || navigator.language;
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
    const messages = (<any>localeData)[languageWithoutRegionCode] || (<any>localeData)["en"];
    return messages;
};