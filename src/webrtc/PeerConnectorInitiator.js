import {PeerConnector} from './PeerConnector';

export class PeerConnectorInitiator extends PeerConnector {
    constructor() {
        super();
        this.isInitiator = true;
        this.dataconnection = null;
        this.onAddressLink = null;
        this.onDataConnection = null;
    }
    
    getOurAdressLink(ourId) {
        if (ourId) {
            // TODO: später wieder auf https ohne port 3000 umstellen
            // var lnk = 'https://'+window.location.hostname + '/index.html?peer=' + ourId;
            var lnk = 'https://'+window.location.hostname + '?peer=' + ourId;
            return lnk;
        }
        return "";
    }

    send(data) {
        console.log('sending '+data);
        this.dataconnection.send(data);
    }
    
    async init() {
        await super.init();
        var lnk = this.getOurAdressLink(this.lId);
        console.log(lnk);
       
        if(this.onAddressLink)
            this.onAddressLink(lnk);

        this.peer.on('connection', (conn) => {
            this.rId = conn.peer;
            this.dataconnection = this.peer.connect(this.rId);
            console.log('initiator tries to connect to '+this.rId+' '+this.peer);
            this.dataconnection.on('error', (err) => {if(this.onError)
                this.onError(err);});
            this.dataconnection.on('open', () => { 
                if(this.onDataConnection)
                    this.onDataConnection(this.dataconnection);
                this.dataconnection.on('data', (data) => {
                    if(this.onData) {
                        this.onData(data);
                    }
                });
                console.log('dcon on open Initiator');
            });
        });
       
        this.peer.on('error', (err)=>{if(this.onError) this.onError(err);});
    }
}