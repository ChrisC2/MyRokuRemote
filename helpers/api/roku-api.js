const dgram = require('react-native-udp');
const RNFetchBlob = require("rn-fetch-blob").default;
const convert = require("xml-js");

const getQuery = () => {
  global.Buffer = global.Buffer || require('buffer').Buffer;
  const ssdpAddress = '239.255.255.250';
  const ssdpPort = 1900;
  const searchTarget = 'roku:ecp';
  const queryString = `M-SEARCH * HTTP/1.1\r\nHOST: ${ssdpAddress}:${ssdpPort}\r\nMAN: "ssdp:discover"\r\nST: ${searchTarget}\r\nMX: 5\r\n\r\n`;
  const query = new Buffer(queryString);

  return [query, 0, query.length, ssdpPort, ssdpAddress];
};

const getListener = (client) => () => {
  const params = [
      ...getQuery(),
      () => setTimeout(() => client.close(), 3500)
  ];
  client.send(...params);
};

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => binary += String.fromCharCode(b));

  return window.btoa(binary);
};

export const getAppImage = (deviceUrl, appId) => {
  return RNFetchBlob.fetch("GET", `${deviceUrl}query/icon/${appId}`)
    .then(res => {
      console.log("RES INFO", res.info())
      let status = res.info().status;
      if(status === 200) {
        let base64Img = res.base64()
        return base64Img
      }
    })
   
    // .then(blob => {
    //   let base64Img = '';
    //   const fileReader = new FileReader();
    //   fileReader.readAsDataURL(blob);
    //   fileReader.onload = () => {
    //     base64Img = fileReader.result;
    //     return base64Img;
    //   }
    //   return base64Img;
    // })
}
export const getDeviceApps = (deviceUrl) => {
  return fetch(`${deviceUrl}query/apps`, {method: "GET"})
    .then(res => res.text())
    .then(xml => convert.xml2js(xml, {compact: true}))
    .then(data => {
      return data.apps.app.map(({_attributes: {id}, _text: appName}) => {
        return {id, appName}
      })
    })
}

const getDeviceInfo = (deviceUrl) => {
  return fetch(`${deviceUrl}query/device-info`, {method: "GET"})
    .then(res => res.text())
    .then(xml => convert.xml2js(xml, {compact: true}))
}

const getMessageHandler = (urls) => (msg) => {
  console.log(msg)
  const matches = msg.toString().match(/Location: (.*)/i);
  if(matches) {
      const rokuUrl = matches[1];
      getDeviceInfo(rokuUrl).then(info => {
        const {"device-info": {
          "device-id": {"_text": id},
          "friendly-device-name": {"_text": deviceName}
        }} = info;
        urls.push({id, deviceName, ip: rokuUrl});
      })
  }
};

export const discoverDevices = async () => new Promise((resolve, reject) => {
  console.log("dgram", dgram)
  const client = dgram.createSocket('udp4');
  const rokuUrls = [];
  client.bind(12345);
  client.once('listening', getListener(client));
  client.on('message', getMessageHandler(rokuUrls));
  client.on('error', (err) => { reject(err); });
  client.on('close', () => { resolve(rokuUrls); })
});

export const sendClick = async (device, key) => {
  const url = `${device}keypress/${key}`;
  console.log("URL", url)
  return await fetch(`${device}keypress/${key}`, {
    method: "POST"
  });
};