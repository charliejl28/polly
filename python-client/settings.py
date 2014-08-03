import os
import json

def get_json_data(f):
	with open(f) as jfile:
		return json.loads(jfile.read())

def get_env_json(var_name, default=None):
	if default is None:
		default = var_name + ".json"

	p = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.environ.get(var_name, default))
	return get_json_data(p)

POLLY_NODES = get_env_json("POLLY_NODES", "nodes.json")

DEFAULT_FILES = "/tmp/polly"
DEFUALT_STATE = "_polly_status.json"

POLLY_USER = "root"
POLLY_FILES = os.environ.get("POLLY_FILES", DEFAULT_FILES)
POLLY_STATUS = os.path.join(POLLY_FILES, os.environ.get("POLLY_STATUS", DEFUALT_STATE))
