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

function  onAdrLink(lnk) {
    console.log(lnk);
    
}

export function setupPeer() {
    rId = remoteIdKnown();
    if(!rId) {
        datacon = new PeerConnectorInitiator();
        datacon.onAddressLink = onAdrLink;
        datacon.init();
    }
    else {
        datacon = new PeerConnectorRemote();
        datacon.init(rId);
    }
    camCon = new CamChat(datacon);
    camCon.init();
}