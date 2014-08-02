#!/usr/bin/python

import os
import hashlib
import glob
from sh import rsync, cp

from settings import *

data_file = open()

def get_file_id(f):
	try:
		data = f.read()
	except AttributeError:
		data = open(f).read()
	except IOError:
		data = f

	return hashlib.sha512(data).hexdigest()

def send_file(node):
	fname = os.path.basename(f)
	server = POLLY_USER + "@" + node + ":/"
	rsync(POLLY_FILES, server, a=True, relative=True, update=True)

def broadcast_files():
	for n in POLLY_NODES:
		send_file(n)



