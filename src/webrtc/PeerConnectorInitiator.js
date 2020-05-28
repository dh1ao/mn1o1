import { PeerConnector } from './PeerConnector';

export class PeerConnectorInitiator extends PeerConnector {
	constructor() {
		super();
		this.isInitiator = true;
		this.dataconnection = null;
		this.onAddressLink = null;
		this.onDataConnection = null;
	}

	send(data) {
		if(this.dataconnection != null)
			this.dataconnection.send(data);
	}

	getOurAdressLink(ourId) {
		if (ourId) {
			// TODO: später wieder auf https ohne port 3000 umstellen
			// var lnk = 'https://'+window.location.hostname + '/index.html?peer=' + ourId;
			var lnk = 'http://' + window.location.hostname + ':3000?peer=' + ourId;
			return lnk;
		}
		return '';
	}

	async init() {
		await super.init();
		var lnk = this.getOurAdressLink(this.lId);
		console.log(lnk);

		if (this.onAddressLink) this.onAddressLink(lnk);

		this.peer.on('connection', (conn) => {
			this.rId = conn.peer;
			this.dataconnection = this.peer.connect(this.rId);
			console.log('initiator tries to connect to ' + this.rId + ' ' + this.peer);
			this.dataconnection.on('error', (err) => {
				if (this.onError) this.onError(err);
			});
			this.dataconnection.on('open', () => {
				if (this.onDataConnection) this.onDataConnection(this.dataconnection);
				this.dataconnection.on('data', (data) => {
					if (this.onData) {
						this.onData(data);
					}
				});
				console.log('dcon on open Initiator');
			});
		});

		this.peer.on('error', (err) => {
			if (this.onError) this.onError(err);
		});
	}
}
