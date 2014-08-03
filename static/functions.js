function setStatus(id, status, packet) {
  var node_status_id = "#node-status-" + id;
  var node_title_id = "#node-title-" + id;
  var node_file_id = "#node-file-" + id;

  if (status == 'waiting') {
    $(node_status_id).attr('class', 'node-status waiting');
  } else if (status == 'downloading') {
    $(node_status_id).attr('class', 'node-status downloading');
  } else if (status == 'deleting') {
    $(node_status_id).attr('class', 'node-status deleting');
  } else if (status == 'deleted') {
    $(node_status_id).attr('class', 'node-status deleted');
  } else {
    $(node_status_id).attr('class', 'node-status broadcasting');
  }

  $(node_file_id).find("a").text(packet);
}

function addNode(id, status, packet, portName) {
  var node_id = "node-" + id;
  var node_status_id = "node-status-" + id;
  var node_title_id = "node-title-" + id;
  var node_file_id = "node-file-" + id;
  var div = '<div class = "node" id = ' + node_id + '>\n<div class = "node-status ' + status + '" id = "';
  div += node_status_id;
  div += '">\n<div class = "node-file" id = "';
  div += node_file_id;
  div += '">\n' + '<a href="/download/' + packet + '">' + packet + '</a>\n</div>\n</div>\n<div class = "node-title" id = "';
  div += node_title_id;
  div += '">\n' + portName + '\n</div>\n</div>';
  $('.node-container').append(div);

  $('.node-container').width($('.node-container').width() + 250);
}

function connect(id1, id2) {
	var nID1 = '#node-' + id1;
	$(nID1).prepend('<div class = "line right" id = "rightline"></div>');


	var nID2 = '#node-' + id2;
	$(nID2).prepend('<div class = "line left" id = "leftline"></div>');

	for (var x = 0; x < 3; x++) {
		$('#rightline').append('<div class = "dot right"></div>');
		$('#leftline').append('<div class = "dot left"></div>');
	}
}

var step = 0;
var gradientSpeed = 0.05;
function updateGradient() {
	var r = 255 * Math.abs(1 - step);
	var g = 255 * Math.abs(1 - step);
	var b = 255 * Math.abs(1 - step);
	var color1 = "#"+((r << 16) | (g << 8) | b).toString(16);
	r = 200 * Math.abs(1 - step);
	g = 200 * Math.abs(1 - step);
	b = 255 * Math.abs(1 - step);
	var color2 = "#"+((r << 16) | (g << 8) | b).toString(16);
	$('.dot').css({
		background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
		background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"
	});
	step += gradientSpeed;
	if (step >= 2) {
		step = 0;
	}
}

setInterval(updateGradient,50);
