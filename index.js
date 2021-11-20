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
