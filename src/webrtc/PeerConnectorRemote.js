import {PeerConnector} from './PeerConnector';

export class PeerConnectorRemote extends PeerConnector {
    /* constructor() {
        super();
    } */

    send(data) {
        console.log('sending '+data);
        this.dataconnection.send(data);
     }

    async init(rId) {
        await super.init();
        this.rId = rId;
        this.peer.connect(this.rId);
         
        this.peer.on('connection', (conn) => {
            this.dataconnection = conn;
            this.dataconnection.on('error', (err) => alert(err));
            console.log('on connection remote '+conn.peer);
            this.peer.on('error', (err)=>alert('Peer '+err));
            this.dataconnection.on('open', () => {
                if(this.onDataConnection)
                    this.onDataConnection(this.dataconnection);
                
                this.dataconnection.on('data', (data) => {
                    if(this.onData) {
                        this.onData(data);
                    }
                });
                
                console.log('dc open remote');
        });
    });
   }
}