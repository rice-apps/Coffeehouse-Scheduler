import { history } from "../configureStore";

export const CHANGE_PATH = "CHANGE_PATH";

export const changePath = (path) => {
    // Use history.push
    history.push(path);
    return {
        type: CHANGE_PATH,
        path
    };
}