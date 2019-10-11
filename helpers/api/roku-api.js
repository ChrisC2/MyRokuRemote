const dgram = require('react-native-udp');
const RNFetchBlob = require("rn-fetch-blob").default;
const convert = require("xml-js");
import AsyncStorage from '@react-native-community/async-storage';


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

export const getAppImage = async (deviceUrl, appId) => {
  try {
    const url = `${deviceUrl}query/icon/${appId}`;
    const res = await RNFetchBlob.fetch("GET", url);
    const status = res.info().status;

    if (status === 200) {
      return res.base64();
    }
  }
  catch (err) {
    console.warn("ERROR::getAppImage() failed::", err);
  }
}

export const getDeviceApps = async (deviceUrl) => {
  try {
    const url = `${deviceUrl}query/apps`;
    const res = await fetch(url, {
      method: "GET"
    });

    const xml = await res.text();
    const {apps: {app: apps}} = await convert.xml2js(xml, {compact: true});
    console.log("APPS", apps)
    const deviceApps = apps.length && await Promise.all(apps.map(async ({_attributes: {id}, _text: appName}) => {
      const base64Image = await getAppImage(deviceUrl, id);

      return {
        id,
        appName,
        image: base64Image
      }
    }));
    console.log("GETTING DEVICE APPS", deviceApps)

    return deviceApps;
  } catch (err) {
    console.warn("ERROR::getDeviceApps() failed::", err);
  }
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

export const onLoad = async () => {

  try {
    let rokuApps = [];
    // await AsyncStorage.clear()
    // let rokuDevices = await AsyncStorage.getItem('@rokus');
    let rokuDevices = null;
    console.log("Roku devies", rokuDevices)
    if (!rokuDevices || !rokuDevices.length) {
      rokuDevices = await discoverDevices();
      console.log("RKOU IN IF", rokuDevices)
      // await AsyncStorage.setItem('@rokus', JSON.stringify(rokuDevices));
    } else {
      rokuDevices = JSON.parse(rokuDevices);
    }
    console.log("ROOKU DEVICES!?!", rokuDevices)
    rokuApps = rokuDevices && await Promise.all(
      rokuDevices.map(async ({ip}) => await getDeviceApps(ip))
    );
    console.log("ROKUAPPS", rokuApps)
    return {rokuDevices, rokuApps};
    } catch (err) {
      console.warn("::onLoad() failed::", err);
      return {
        rokuDevices: [],
        rokuApps: []
      };
    }
}

export const sendClick = async (device, key) => {
  const url = `${device}keypress/${key}`;
  console.log("URL", url)
  return await fetch(`${device}keypress/${key}`, {
    method: "POST"
  });
};

export const launchApp = async (device, appId) => {
  const url = `${device}launch/${appId}`;
  console.log("URL", url)
  return await fetch(url, {
    method: "POST"
  });
};