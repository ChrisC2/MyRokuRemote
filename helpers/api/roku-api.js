const dgram = require('react-native-udp');

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

const getMessageHandler = (urls) => (msg) => {
  console.log(msg)
  const matches = msg.toString().match(/Location: (.*)/i);
  if(matches) {
      const rokuUrl = matches[1];
      urls.push(rokuUrl);
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