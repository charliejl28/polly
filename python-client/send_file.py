#!/usr/bin/python

import os
import hashlib
import glob
import json
from sh import rsync, cp

from settings import *

current_node = "127.0.0.1"

# FILE UTILITIES

def get_file_id(f):
	try:
		data = f.read()
	except AttributeError:
		data = open(f).read()
	except IOError:
		data = f

	return hashlib.sha1(data).hexdigest()

def get_file_ext(f):
	try:
		name, ext = os.path.splitext(f.name)
		return ext
	except AttributeError:
		name, ext = os.path.splitext(f)
		return ext

def get_file_loc(f):
	try:
		return os.path.join(POLLY_FILES, f.name)
	except AttributeError:
		fname = os.path.basename(f)
		return os.path.join(POLLY_FILES, fname)


# STATUS UTILITIES

PACKETS = []
PORTS = []
ALL_NODES = POLLY_NODES.keys()

def get_server_for_node(node):
	return POLLY_USER + "@" + node + ":/"

def save_status_update():
	global PORTS, PACKETS
	data = {
		'packets': PACKETS,
		'ports': PORTS,
	}

	encoded = json.dumps(data)

	with open(POLLY_STATUS, "w+") as sfile:
		sfile.write(encoded)

	for node in POLLY_NODES:
		server = get_server_for_node(node)
		rsync(POLLY_STATUS, server, archive=True, compress=True, relative=True, update=True, itemize_changes=True)
	PORTS = []
	PACKETS = []

def add_packet(f):
	global PACKETS
	loc = get_file_loc(f)
	ext = get_file_ext(f)
	i = get_file_id(f)
	PACKETS.append({
		'id': i,
		'type': ext,
		'file': os.path.basename(loc),
	})

def get_node_name(ip):
	return POLLY_NODES.get(ip, 'Untitled Node')

def add_port(ip, status, packets):
	if get_file_id(POLLY_STATUS) in packets:
		return
	global PORTS
	try:
		i = ALL_NODES.index(ip)
	except ValueError:
		i = len(ALL_NODES)
		ALL_NODES.append(ip)

	PORTS.append({
		'ip': ip,
		'id': i,
		'address': ip,
		'status': status,
		'packet': packets,
		'packets': packets,
		'name': get_node_name(ip)
	})


# BROADCASTING

def send_file(node):
	server = get_server_for_node(node)
	for line in rsync(POLLY_FILES, server, archive=True, compress=True, relative=True, update=True, itemize_changes=True, dry_run=True, _iter=True):
		if line[1] == 'f':
			parts = line.split()
			fileid = get_file_id(parts[1])

			if line[0] == "<": #sent
				add_packet(parts[1])
				add_port(current_node, "broadcasting", fileid)
				add_port(node, "downloading", fileid)
			elif line[0] == ">": #received
				add_packet(parts[1])
				add_port(node, "downloading", fileid)
				add_port(current_node, "broadcasting", fileid)
			elif line[0] == ".": #nothing
				pass

	save_status_update()

	server = POLLY_USER + "@" + node + ":/"
	for line in rsync(POLLY_FILES, server, archive=True, compress=True, relative=True, update=True, itemize_changes=True, _iter=True):
		if line[1] == 'f':
			parts = line.split()

			if line[0] == "<": #sent
				add_packet(parts[1])
				add_port(current_node, "waiting", get_file_id(parts[1]))
				add_port(node, "waiting", get_file_id(parts[1]))
			elif line[0] == ">": #received
				add_packet(parts[1])
				add_port(current_node, "waiting", get_file_id(parts[1]))
				add_port(node, "waiting", get_file_id(parts[1]))
			elif line[0] == ".": #nothing
				pass

	save_status_update()

def broadcast_files():
	for n in POLLY_NODES:
		print "Sending to", n
		send_file(n)

if __name__ == "__main__":
	broadcast_files()

