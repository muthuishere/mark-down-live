import path from "path";

export let PORT = 9500;
let isBuilding = false;
let cancelCurrentBuildStatus = false;

export function getPort() {
    return PORT;
}

export function setPort(port) {
    PORT = port;

}


export function shouldCancelCurrentBuild() {
    return cancelCurrentBuildStatus;


}

export function cancelCurrentBuild() {
    cancelCurrentBuildStatus = true;

}

export function startBuilding() {
    isBuilding = true;
    cancelCurrentBuildStatus = false;
}

export function stopBuilding() {
    isBuilding = false;
}

export function isBuildingStatus() {
    return isBuilding;
}


export function getIndexUrl() {
    return `http://localhost:${PORT}/`;
}

export function getFullPresentationUrl(filename) {
    const basename = path.basename(filename);
    let htmlFile = basename.replace(".md", ".html");
    return `http://localhost:${PORT}/` + htmlFile;
}