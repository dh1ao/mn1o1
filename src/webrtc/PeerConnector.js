import Peer from 'peerjs'; // npm install --save peerjs

export class PeerConnector {
    constructor() {
        
        this.isInitiator = false;
        this.lId = null;
        this.onError = null;
        this.onDisconnected = null;
        this.onClose = null;
        this.onData = null;

        /* if(this.constructor == PeerConnector) {
            console.log('Hä?');
            throw new Error("abstract classes cannot be instatiated").stack;
        }  */    
    }

    init() {
        return new Promise(resolve=>{
            // this.peer = new Peer({ key: 'lwjd5qra8257b9',
            this.peer = new Peer({ key: 'peerjs',
                                    debug : 1,
                                    /* config : { 'iceServers': [
                                         { urls: 'stun:stun.l.google.com:19302' },
                                         { urls: 'turn:homeo@turn.bistri.com:80', username : 'homeo', credential: 'homeo' },
                                        {
                                            urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
                                            credential: 'webrtc',
                                            username: 'webrtc'
                                        }
                                    ]} */
                                });
                                
            this.peer.on('error', (err) => {if(this.onError)
                this.onError(err);});
            this.peer.on('open', (id) => {
                this.lId=id;
                resolve(this.lId);
            });
            this.peer.on('disconnected', () => {
                if(this.onDisconnected) {
                    this.onDisconnected();
                }
                console.log('on disconnected');
                this.peer.reconnect();
            });
            this.peer.on('close', () => {
                if(this.onClose) {
                    this.onClose();
                }
                console.log('on Close');
            });
        }
        );
    }
}