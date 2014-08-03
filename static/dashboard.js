var ports = {};
var packets = {};

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                parseJSON(allText);
            }
        }
    }
    rawFile.send(null);
}

// parse JSON
function parseJSON(JSON_string){

	console.log("parsing JSON: " + JSON_string);

	// json object
	var JSON_object = JSON.parse(JSON_string);
	console.log("parsed json ");

	// all packets
	var packetsJSON = JSON_object.packets;
	for	(index = 0; index < packetsJSON.length; index++) {
		var packetJSON = packetsJSON[index];
		var id = packetJSON["id"];
		var fileName = packetJSON["file"];
		packets[id] = fileName;
	}

	console.log("parsed packets");

	// all ports
	var portsJSON = JSON_object.ports;
	for (index = 0; index < portsJSON.length; index++){
		var portJSON = portsJSON[index];
		var portID = portJSON["id"];
		var portStatus = portJSON["status"];
		var packetID = portJSON["packet"];

		// update node for existing port
		if (portID in ports){
			//console.log(index + " " + packets[packetID]);
			setStatus(portID, portStatus, packets[packetID]);
		}

		// create new node
		else {
			addNode(portID, portStatus, packets[packetID]);
			ports[portID] = portStatus;
		}

	}
}

console.log("running dashboard.js");

function startUpdatingPage(){
	readTextFile("network.json");
	setInterval(startUpdatingPage, 1000);
}

startUpdatingPage();

