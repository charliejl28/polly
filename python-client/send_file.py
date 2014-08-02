#!/usr/bin/python

import os
import hashlib
import glob
import json
from sh import rsync, cp

from settings import *


# FILE UTILITIES

def get_file_id(f):
	try:
		data = f.read()
	except AttributeError:
		data = open(f).read()
	except IOError:
		data = f

	return hashlib.sha512(data).hexdigest()

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

def save_status_update():
	data = {
		'packets': PACKETS,
		'ports': PORTS,
	}

	encoded = json.dumps(data)

	with open(POLLY_STATUS, "w+") as sfile:
		sfile.write(encoded)

def add_packet(f):
	global PACKETS
	loc = get_file_loc(f)
	ext = get_file_ext(f)
	i = get_file_id(f)
	PACKETS.append({
		'id': i,
		'type': ext,
		'file': loc,
	})

def get_node_name(ip):
	with open(POLLY_NODES) as nfile:
		nodes = json.loads(nfile.read())
		return nodes.get(ip, 'Untitled Node')

def add_port(ip, status, packets):
	global PORTS
	PORTS.append({
		'ip': ip,
		'status': status,
		'packets': packets,
		'name': get_node_name(ip)
	})


# BROADCASTING

def send_file(node):
	server = POLLY_USER + "@" + node + ":/"
	for line in rsync(POLLY_FILES, server, archive=True, compress=True, relative=True, update=True, itemize_changes=True, _iter=True):
		parts = line.split()

		if line[0] == "<": #sent
			add_port(node, 1, parts[1])
		elif line[0] == ">": #received
			add_port(node, 2, parts[1])
		elif line[0] == ".": #nothing
			pass

	save_status_update()
	rsync(POLLY_FILES, server, archive=True, compress=True, relative=True, update=True, itemize_changes=True)

def broadcast_files():
	for n in POLLY_NODES:
		send_file(n)

if __name__ == "__main__":
	broadcast_files()

