import {remoteIdKnown} from './webrtc/remoteIdKnown';
import {PeerConnectorInitiator} from './webrtc/PeerConnectorInitiator';
import {PeerConnectorRemote} from './webrtc/PeerConnectorRemote';
import { CamChat } from './webrtc/CamChat';

let rId = null;
let datacon = null;
let camCon = null;

export function getDataCon() {
    return datacon;

}
export function getCamCon() {
    return datacon;
}

export function setupPeer(cbs) {
    rId = remoteIdKnown();
    if(!rId) {
        datacon = new PeerConnectorInitiator();
        datacon.onAddressLink = cbs.onAddressLink;
        datacon.init();
    }
    else {
        datacon = new PeerConnectorRemote();
        datacon.init(rId);
    }
    datacon.onDataConnection = cbs.onDataConnection;
    datacon.onData = cbs.onData;
    camCon = new CamChat(datacon);
    camCon.init();
    camCon.streamTo = cbs.localStreamTo;
}