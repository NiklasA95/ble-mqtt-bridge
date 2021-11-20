const EnoceanBle = require("node-enocean-ble");
const enocean = new EnoceanBle();

const secrets = require("./secrets");

enocean.commission(secrets.comissioningDataString);

// Set a callback for incoming telegrams
enocean.ondata = (telegram) => {
  if(telegram.address === secrets.rockerWallSwitchAddress && telegram.data.pressed) {
    console.log("Toggle lamp")
  }
  console.log(telegram);
};

// Start to monitor telegrams
enocean.start().then(() => {
  // Successfully started to monitor telegrams
  console.log("Waiting for telegrams...");
}).catch((error) => {
  // Failed to start to monitor telegrams
  console.error(error);
});

/*
*{
*  address: 'e2150002e87a',
*  manufacturer: '03da',
*  sequence: 158,
*  type: 'button',
*  data: { button: '', pressed: true },
*  signature: '269d8bd1',
*  authenticated: true,
*  replayed: false
*}
**/
