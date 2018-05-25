var express=require("express");
var app = express();
var bodyParser = require('body-parser');
var Cylon=require('cylon');
var TH02 = require('th02js');
var mongojs=require('mongojs')
var db=mongojs('mongodb://192.168.0.5:27017/weather',['weathers'])
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var celcius;
var humidity;
var moisture;
var light;
var motion;
var uv;
var sensor;
var lightSensorValue;
var uvSensorValue;
var moistureSensorValue;
var motionSensorValue;
var bus=6;



app.use(express.static(__dirname+'/view'));


app.get('/', function(req,res){
    res.sendFile('index.html');
});

 
Cylon.robot({
  connections: {
    edison: { adaptor: 'intel-iot' }  },
 
    devices: {
      lightSensor: { driver: 'analogSensor', pin: 2, connection: 'edison' },
      uvSensor: { driver: 'analogSensor', pin: 3, connection: 'edison' },
      moistureSensor: { driver: 'analogSensor', pin: 1, connection: 'edison' },
      motionSensor: { driver: 'direct-pin', pin: 7, connection: 'edison' },
      buzzer:{driver:'direct-pin', pin:4, connection:'edison'}
     },
work: function(my) {
    
    every((1).second(),function(){
      lightSensorValue=my.lightSensor.analogRead();
      light=lightSensorValue;
    });
          
    every((1).second(), function(){
      uvSensorValue=my.uvSensor.analogRead();
      uv=uvSensorValue;
    });

    every((1).second(), function(){
      moistureSensorValue=my.moistureSensor.analogRead();
      moisture=moistureSensorValue;
    });

    every((1).second(), function(){
      my.motionSensor.digitalRead(function(err,motionSensorValue){
	    if (err) exit();
      motion=motionSensorValue;
	    my.buzzer.digitalWrite(motionSensorValue);
      }); 
    });
    
    every((1).second(),function(){
      sensor=new TH02(6);
      celcius= sensor.getCelsiusTemp();
      humidity = sensor.getHumidity();
    }); 	    
  }
}).start();
var dataVal;
var val;
setInterval(function(){
   val=[{
    temperatureValue:celcius,
    humidityValue:humidity,
    moistureValue:moisture,
    lightValue:light,
    motionValue:motion,
    uvValue:uv
  }];
},1000);

setInterval(function(){
  dataVal=[{
   temperatureValue:celcius,
   humidityValue:humidity,
   moistureValue:moisture,
   lightValue:light,
   motionValue:motion,
   uvValue:uv
 }];
},5000);

app.listen(3000);

console.log("Running at Port 3000");

app.get('/values',function(req,res){
  
  res.send({val:val});
  
});

setInterval(function(){
db.weathers.insert(dataVal,function(err,res){
    if(err){
      console.log(err);
    }else{
      console.log('Weather added Successfully')
    }
  });
},5000);


