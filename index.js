const IPFS = require('ipfs-http-client');
const all = require('it-all');
const {concat, toString} = require('uint8arrays');
var {readFileSync} = require('fs');

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const storeOnIPFS = async (content, path) => {
  try {
    const filesAdded = await ipfs.add({path, content});
    return filesAdded.cid.toString();
  }
  catch(err) {
    console.error(err);
  }
};

const getFromIPFS = async (hash) => {
  try {
    const data = concat(await all(ipfs.cat(hash)));
    return toString(data);
  }
  catch(err) {
    console.error(err);
  }
};

const main = async () => {
  let hash, content, result;
  content = Buffer.from('Hello World 101');
  hash = await storeOnIPFS(content, 'hello.txt')
  console.log(`uploaded to: https://gateway.ipfs.io/ipfs/${hash}`);
  result = await getFromIPFS(hash);
  console.log(`content received: ${result}`);
  
  content = Buffer.from(JSON.stringify({fname: 'mike', lname: 'hammer'}));
  hash = await storeOnIPFS(content, 'data.json')
  console.log(`uploaded to: https://gateway.ipfs.io/ipfs/${hash}`);
  result = await getFromIPFS(hash);
  console.log(`content received: ${result}`);

  content = readFileSync(__dirname + '/avs.png');
  hash = await storeOnIPFS(content, 'avs.png')
  console.log(`uploaded to: https://gateway.ipfs.io/ipfs/${hash}`);
};

main();
