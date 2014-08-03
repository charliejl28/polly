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

function addNode(id, status, packet) {
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
  div += '">\n Node ' + id + '\n</div>\n</div>';
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

var colors = new Array(
  [0,0,0],
  [45,175,230]);

var step = 0;
var colorIndices = [0,1,0,1];
var gradientSpeed = 0.05;
function updateGradient() {
	var c0_0 = colors[colorIndices[0]];
	var c0_1 = colors[colorIndices[1]];
	var c1_0 = colors[colorIndices[2]];
	var c1_1 = colors[colorIndices[3]];

	var istep = 1 - step;
	var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
	var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
	var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
	var color1 = "#"+((r1 << 16) | (g1 << 8) | b1).toString(16);

	var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
	var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
	var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
	var color2 = "#"+((r2 << 16) | (g2 << 8) | b2).toString(16);

	$('.dot').css({
		background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
		background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"
	});
	/*$('.leftline').css({
		background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
		background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"
	});*/
  
	step += gradientSpeed;
	if ( step >= 1 )
	{
		step %= 1;
		colorIndices[0] = colorIndices[1];
		colorIndices[2] = colorIndices[3];

		colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
		colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;

	}
}

setInterval(updateGradient,100);