import React from 'react'

export class ScreenShare extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            captureStream : null    
        }
        window.ScreenShare = this;
    }

    async startCapture(displayMediaOptions) {
        let CaptureStream = null;
        let video = document.getElementById('scrnVid');
      
        try {
          CaptureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
          this.setState({captureStream :CaptureStream });
          video.srcObject = CaptureStream;
          
        } catch(err) {
          console.error("Error: " + err);
        }
        return CaptureStream;
      }
    
    render() {
        return (
            <div id="ScreenShare">
            <video id="scrnVid" autoPlay></video>
            </div>
        )
    }
}
