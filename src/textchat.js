import React from 'react'
import { getDataCon } from './setupPeer';
import DataCom from './datacom';

class TextChat extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    handleInput = (event) => {
        let data = new DataCom();
        data.data = {
            type: 'Text',
            widget : 'TextChat',
            text: event.target.value
        };
        getDataCon().send(data);
    }

    render() {
        return (
            <div className='textchat'>
                <textarea id='chatTxt' onChange={this.handleInput.bind(this)}/>
                <button id='sendMsg' >Senden</button>
            </div>
        )
    }
}

export default TextChat;