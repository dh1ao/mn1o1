/*
TODO: webpack und react probieren
*/
import {remoteIdKnown} from './webrtc/remoteIdKnown';
import {PeerConnectorInitiator} from './webrtc/PeerConnectorInitiator';
import {PeerConnectorRemote} from './webrtc/PeerConnectorRemote';
import {CamChat} from './webrtc/CamChat';

var rId = remoteIdKnown();
var datacon = null;
var adrInp = document.getElementById('adrlnk');
let btnCopy = document.getElementById('copy');
let btnCall = null;
let btnSend = null;
let playground = document.getElementById('mainDrawArea');
var ctx = null;


function onAdrLnk(adr) {
    adrInp.value = adr;
    btnCopy.disabled = false;
}

if(!rId) {
    datacon = new PeerConnectorInitiator();
    datacon.onAddressLink = onAdrLnk;
    datacon.init();
}
else {
    datacon = new PeerConnectorRemote();
    datacon.init(rId);
}

var cam = new CamChat(datacon);
cam.init();

function strTo(stream) {
    const lVideo = document.getElementById('lVideo');
    lVideo.srcObject = stream;
}

function onRemoteStream(stream) {
    console.log('onRemoteStream');
    
    const rVideo = document.getElementById('rVideo');
    rVideo.srcObject = stream;
}

function onDataConnection(conn) {
    btnSend.disabled = false;
    cam.dataconnection.onError = onError;
    btnCall.disabled = false;
}

function onError(err) {
    alert(err);
}

function onDisconnect() {
    alert('Disconnected. Versuche reconnect');
}

function onClose() {
    alert('on close');
}

function onData(data) {
    ctx = playground.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(data.x, data.y, 2, 2);
}

function playgroundInit() {
    
}

if(!cam.dataconnection.isInitiator) {
    btnCopy.style.display = 'none';
    adrInp.style.display = 'none';
}
cam.streamTo = strTo;
cam.callOnStream = onRemoteStream;
cam.dataconnection.onDataConnection = onDataConnection;
cam.dataconnection.onError = onError;
cam.dataconnection.onDisconnect = onDisconnect;
cam.dataconnection.onClose = onClose;
cam.dataconnection.onData = onData;

btnSend.addEventListener('click', () => datacon.send('Wurst'));
btnCall.addEventListener('click', () => cam.call());
btnCopy.addEventListener('click', () => {
    adrInp.select();
    document.execCommand("copy");
});
playground.addEventListener('click', (e) => {
    cam.dataconnection.send({x: e.x, y:e.y});
    console.log(e);
    
});
playground.addEventListener('mousemove', (e) => {
    if(e.buttons) {
        cam.dataconnection.send({x: e.offsetX, y:e.offsetY});
        onData({x: e.offsetX, y:e.offsetY});
        console.log(e+' hello');
    }
});


export function setUpConnection() 
{
    let btnCall = document.getElementById('call');
    let btnSend = document.getElementById('send');

    if(!cam.dataconnection.isInitiator) {
        btnCopy.style.display = 'none';
        adrInp.style.display = 'none';
    }

    cam.streamTo = strTo;
    cam.callOnStream = onRemoteStream;
    cam.dataconnection.onDataConnection = onDataConnection;
    cam.dataconnection.onError = onError;
    cam.dataconnection.onDisconnect = onDisconnect;
    cam.dataconnection.onClose = onClose;
    cam.dataconnection.onData = onData;
    
    btnSend.addEventListener('click', () => datacon.send('Wurst'));
    btnCall.addEventListener('click', () => cam.call());
    btnCopy.addEventListener('click', () => {
        adrInp.select();
        document.execCommand("copy");
    });
    playground.addEventListener('click', (e) => {
        cam.dataconnection.send({x: e.x, y:e.y});
        console.log(e);    
   });
} 
