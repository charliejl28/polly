from fabric.api import *
from fabric.contrib.files import exists
from fabric.context_managers import settings
import os

import json

nf = open('nodes.json')
nodes = json.loads(nf.read())

env.hosts = [n for n in nodes]
env.user = "root"

def ssh_connect():
	for n in env.hosts:
		sudo("ssh root@" + n)

def deploy():
	with cd("/srv/polly"):
		sudo("pip install -r requirements.txt")
		sudo("git checkout .")
		sudo("git pull origin master")

	try:
		sudo("service uwsgi restart")
	except:
		pass

def update_auth_keys():
	sudo("cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys")
