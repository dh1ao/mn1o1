import React from 'react'
import { getDataCon } from './setupPeer';

class TextChat extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    handleInput = (event) => {
        console.log('Wurst');
        console.log(event.target.value);
        getDataCon().send(event.target.value);
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