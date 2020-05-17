export function remoteIdKnown() {
    const urlParams = new URLSearchParams(window.location.search);
    var remotePeerID = urlParams.get('peer');
    if(remotePeerID) {
        return remotePeerID;
    }
    else {
        return false;
    }
}