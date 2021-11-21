const EnoceanBle = require("node-enocean-ble");
const mqtt = require("mqtt");
const secrets = require("./secrets");

const enocean = new EnoceanBle();
enocean.commission(secrets.comissioningDataString);

const bedroomLampStateTopic = "home/apartment/bedroom/bed_lamp/state";
let mqttClient = null;
let bedroomLampState = "Off";

enocean.start().then(() => {
  console.log("Successfully startet ble data monitoring!\nWaiting for telegrams...");
  connectMqttClient()
}).catch((error) => {
  console.error(error);
});

enocean.ondata = (telegram) => {
  if(telegram.address === secrets.rockerWallSwitchAddress && telegram.data.pressed) {
    mqttClient.publish(
      "home/apartment/bedroom/bed_lamp/cmd",
      bedroomLampState === "Off" ? "On" : "Off"
    );
    console.log(telegram);
  }
};

const connectMqttClient = () => {
  mqttClient = mqtt.connect(
    `mqtt://${secrets.mqttHost}`,
    {
      clientId: "ble-mqtt-bridge",
      username: secrets.mqttUsername,
      password: secrets.mqttPassword
    }
  );

  mqttClient.on("connect", () => {
    console.log("Successfully connected to MQTT broker!");
    mqttClient.subscribe(bedroomLampStateTopic, (error) => {
      if(!error) {
        console.log("Subscribed to topic " + bedroomLampStateTopic);
      }
    });
  });

  mqttClient.on('message', (topic, message) => {
    console.log(message.toString())
    if(topic === bedroomLampStateTopic) {
      bedroomLampState = message.toString();
    }
  });
};
