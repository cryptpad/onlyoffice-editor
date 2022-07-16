#!/usr/bin/env python

import sys
sys.path.append('../../../../build_tools/scripts')
import base
import os

params = sys.argv[1:]

if (1 > len(params)):
  print("use: make.py path_to_api.js")
  exit(0)

api_file = params[0]

#compilation_level = "WHITESPACE_ONLY"
compilation_level = "SIMPLE_OPTIMIZATIONS"
base.cmd("java", ["-jar", "../../../build/node_modules/google-closure-compiler-java/compiler.jar", 
                  "--compilation_level", compilation_level,
                  "--js_output_file", "connector.min.js",
                  "--js", "connector.js"])

min_content = base.readFile("./connector.min.js")
base.delete_file("./connector.min.js")

api_content = base.readFile(api_file)

pos_return_editor_obj = api_content.find("return {")

new_content = ""
new_content += min_content
new_content += "\n        "
new_content += "function _createConnector() { return new Asc.EditorConnector({frame : iframe}); }"
new_content += "\n\n"

new_content += "        return {"
new_content += "\n"
new_content += "            createConnector     : _createConnector,"

new_api_content = api_content[0:pos_return_editor_obj] + new_content + api_content[pos_return_editor_obj + 8:]

base.delete_file(api_file)
base.writeFile(api_file, new_api_content)
