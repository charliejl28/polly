function setStatus(id, status, packet) {
  var node_status_id = "#node-status-" + id;
  var node_title_id = "#node-title-" + id;
  var node_file_id = "#node-file-" + id;
  
  if (status == 'waiting') {
  	$(node_status_id).attr('class', 'node-status waiting'); 
  } else if (status == 'downloading') {
  	$(node_status_id).attr('class', 'node-status downloading');
  } else {
  	$(node_status_id).attr('class', 'node-status broadcasting');
  }
  
  $(node_file_id).empty();
  $(node_file_id).append(packet);
}

function addNode(id, status, packet) {
  var node_status_id = "node-status-" + id;
  var node_title_id = "node-title-" + id;
  var node_file_id = "node-file-" + id;
  var div = '<div class = "node">\n<div class = "node-status ' + status + '" id = "';
  div += node_status_id;
  div += '">\n<div class = "node-file" id = "';
  div += node_file_id;
  div += '">\n' + packet + '\n</div>\n</div>\n<div class = "node-title" id = "';
  div += node_title_id;
  div += '">\n Node ' + id + '\n</div>\n</div>';
  $('.node-container').append(div);
  
  $('.node-container').width($('.node-container').width() + 300);
}

// addNode(2, 'downloading', 'hello');
// addNode(1, 'waiting', 'No file');