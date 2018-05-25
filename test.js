var celcius=0;
var humidity=6;
var moisture=11;
var light=16;
var motion=21;
var uv=26;
setInterval(function(){
    celcius++;
    humidity++;
    light++;
    motion++;
    moisture++;
    uv++;
    exports.celcius=celcius;
    exports.humidity=humidity;
    exports.moisture=moisture;
    exports.light=light;
    exports.motion=motion;
    exports.uv=uv;

},1000);