
export class CamChat {
    constructor(conn) {
        this.dataconnection = conn;
        this.Call = null;
        this.streamTo = null;
        this.callOnStream = null;
        
        this.callbacks = {
            success: (stream) => {
                this.mediastream = stream;
                if(this.streamTo)
                    this.streamTo(stream);
                },
            error: (err) => {
                alert('keine Kamera oder Kamera nicht zugelassen');
            }
          };
          this.constraints = {
            audio: true,
            video: {
              width: 128,
              height: 128
            }
          };
    }

    initStream() {
        navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
        navigator.mediaDevices.getUserMedia(this.constraints).then(this.callbacks.success).catch(this.callbacks.error);
    }

    init() {
        this.initStream();
        this.dataconnection.peer.on('call', (call) =>{
            call.answer(this.mediastream);
            call.on('stream', (stream) => {
                if(this.callOnStream)
                    this.callOnStream(stream);
            });
        });
    }

    getStream() {
        return this.mediastream;
    }

    call() {
        this.Call = this.dataconnection.peer.call(this.dataconnection.rId, this.mediastream);
    }
}