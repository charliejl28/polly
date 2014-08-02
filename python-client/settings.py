import os
import json

def get_json_data(f):
	with open(f) as jfile:
		return json.loads(jfile.read())

def get_env_json(var_name, default=None):
	if default is None:
		default = var_name + ".json"

	return get_json_data(os.environ.get(var_name, default))

POLLY_NODES = get_env_json("POLLY_NODES", "nodes.json")

DEFAULT_FILES = "/tmp/polly"
DEFUALT_STATE = "_polly_status.json"

POLLY_USER = "root"
POLLY_FILES = get_env_json("POLLY_FILES", DEFAULT_FILES)
POLLY_STATUS = os.path.join(POLLY_FILES, get_env_json("POLLY_STATUS", DEFUALT_STATE))
