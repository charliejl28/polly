function setStatus(id, status, packet) {
  
}

function addNode(id, status, packet) {
  var node_status_id = "node-status-" + id;
  var node_title_id = "node-title-" + id;
  var node_file_id = "node-title-" + id;
  var div = '<div class = "node">\n<div class = "node-status waiting" id = "';
  div += node_status_id;
  div += '">\n<div class = "node-file" id = "';
  div += node_file_id;
  div += '">\n No File \n</div>\n</div>\n<div class = "node-title" id = "';
  div += node_title_id;
  div += '">\n Node ' + id + '\n</div>\n</div>';
  $('.node-container').append(div);
  
  $('.node-container').width($('.node-container').width() + 300);
}