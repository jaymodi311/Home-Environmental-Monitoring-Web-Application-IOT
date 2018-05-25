var Cylon = require('cylon');
var TH02 = require('th02js');
 var uvSensorVal=0;
    var lightSensorVal=0;
    var moistureSensorVal=0;
    var motionSensorVal=0;
    var sensor;
    var celsius;
    var humidity;
	
Cylon
  .robot({ name: 'Values'})
  .connection('edison', { adaptor: 'intel-iot' })
  .device('uvSensor', { driver: 'analogSensor', pin: 3, connection: 'edison' })
  .device('lightSensor', { driver: 'analogSensor', pin: 2, connection: 'edison' })
  .device('moistureSensor', { driver: 'analogSensor', pin: 1, connection: 'edison' })
  .device('motionSensor', { driver: 'direct-pin', pin: 7, connection: 'edison' })
  .device('buzzer', { driver: 'direct-pin', pin: 4, connection: 'edison' })
  .on('ready', function(my) {
   
    var ready = false;

    my.motionSensor.digitalRead(function(err, value) {
    if (err) exit();
    motionSensorVal=value;
    })

    my.uvSensor.on('analogRead', function(data) {
        uvSensorVal= data;
    });

    my.lightSensor.on('analogRead',function(data) {
        lightSensorVal = data;
    });


    my.moistureSensor.on('analogRead', function(data) {
        moistureSensorVal = data;
    });


        setInterval(function() {
        sensor=new TH02(6);
        celsius = sensor.getCelsiusTemp();
        humidity = sensor.getHumidity();
       
    },1000);
  
})
  .start();
setInterval(function(){
  exports.celcius=celsius;
    exports.humidity=humidity;
    exports.moisture=moistureSensorVal;
    exports.light=lightSensorVal;
    exports.motion=motionSensorVal;
    exports.uv=uvSensorVal;          

},1000);
