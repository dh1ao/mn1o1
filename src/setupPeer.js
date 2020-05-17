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
        console.log(datacon);
        
        datacon.init();
    }
    else {
        datacon = new PeerConnectorRemote();
        datacon.init(rId);
    }
    datacon.onDataConnection = cbs.onDataConnection;
    camCon = new CamChat(datacon);
    camCon.init();
}