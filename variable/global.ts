let global = {
    pathReport: "",
    featureName: ""
}

export const setGlobalState = (newState) => {
    global = { ...global, ...newState };
};

export const getGlobalState = () => global;