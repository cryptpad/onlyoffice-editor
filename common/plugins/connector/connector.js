/**
 *
 * (c) Copyright Ascensio System SIA 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function(exports) {

	function generateGuid() {
		if (!window.crypto || !window.crypto.getRandomValues) {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}

			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		} else {
			var array = new Uint16Array(8);
			window.crypto.getRandomValues(array);
			var index = 0;

			function s4() {
				var value = 0x10000 + array[index++];
				return value.toString(16).substring(1);
			}

			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}
	}

	function EditorConnector(config) {
		this.frame = config.frame;
		this.guid = "asc.{" + generateGuid() + "}";
		this.isConnected = false;

		if (config.autoconnect)
			this.connect();

		this.callbacks = [];
		this.events = {};
		this.tasks = [];

		this.onMessageBound = this.onMessage.bind(this);
	}

	EditorConnector.prototype.onMessage = function (e) {

		if (typeof (e.data) == "string") {
			var pluginData = {};
			try {
				pluginData = JSON.parse(e.data);
			} catch (err) {
				pluginData = {};
			}

			if ("onExternalPluginMessageCallback" !== pluginData.type)
				return;

			pluginData = pluginData.data;

			if (this.guid !== pluginData.guid)
				return;

			switch (pluginData.type) {
				case "onMethodReturn": {
					if (this.callbacks.length > 0) {
						var callback = this.callbacks.shift();
						callback && callback(pluginData.methodReturnData);
					}

					if (this.tasks.length > 0) {
						this.sendMessage(this.tasks.shift());
					}
					break;
				}
				case "onCommandCallback": {
					if (this.callbacks.length > 0) {
						var callback = this.callbacks.shift();
						callback && callback();
					}

					if (this.tasks.length > 0) {
						this.sendMessage(this.tasks.shift());
					}
					break;
				}
				case "onEvent": {
					if (pluginData.eventName && this.events[pluginData.eventName])
						this.events[pluginData.eventName](pluginData.eventData);
					break;
				}
				default:
					break;
			}
		}

	};

	EditorConnector.prototype.sendMessage = function (message) {
		var e = {};
		e.frameEditorId = "iframeEditor";
		e.type = "onExternalPluginMessage";
		e.subType = "connector";
		e.data = message;
		e.data.guid = this.guid;

		var frame = this.frame;
		if (typeof frame === "string")
			frame = document.getElementById(this.frame);

		if (frame)
			frame.contentWindow.postMessage(JSON.stringify(e), "*");
	};

	EditorConnector.prototype.connect = function () {
		if (window.addEventListener)
			window.addEventListener("message", this.onMessageBound, false);
		else if (window.attachEvent)
			window.attachEvent("onmessage", this.onMessageBound);
		this.isConnected = true;

		this.sendMessage({type: "register"});
	};

	EditorConnector.prototype.disconnect = function () {
		if (window.removeEventListener)
			window.removeEventListener("message", this.onMessageBound, false);
		else if (window.detachEvent)
			window.detachEvent("onmessage", this.onMessageBound);
		this.isConnected = false;

		this.sendMessage({type: "unregister"});
	};

	/**
	 * callCommand
	 * @memberof EditorConnector
	 * @alias callCommand
	 * @description Defines the method used to send the data back to the editor.
	 * It allows the plugin to send structured data that can be inserted to the resulting document file (formatted paragraphs, tables, text parts and separate words, etc.).
	 * The callback is the result that the command returns. It is an optional parameter.
	 * ONLYOFFICE Document Builder commands can be only used to create content and insert it to the document editor (using the Api.GetDocument().InsertContent(...)).
	 * This limitation exists due to the co-editing feature in the online editors. If it is necessary to create a plugin for desktop editors to work with local files, no such limitation is applied.
	 * This method is executed in its own context isolated from other JavaScript data. If some parameters or other data need to be passed to this method, use Asc.scope object.
	 * @param {Function} command - Defines the command written in JavaScript which purpose is to form structured data which can be inserted to the resulting document file
	 * (formatted paragraphs, tables, text parts and separate words, etc.). Then the data is sent to the editors.
	 * The command must be compatible with ONLYOFFICE Document Builder syntax.
	 * @param {Function} callback - The result that the method returns.
	 * @param {boolean} isNoCalc - Defines whether the document will be recalculated or not.
	 * The true value is used to recalculate the document after executing the function in the func parameter.
	 * The false value will not recalculate the document (use it only when your edits surely will not require document recalculation).
	 */
	EditorConnector.prototype.callCommand = function (command, callback, isNoCalc) {
		if (!this.isConnected) {
			console.log("Connector is not connected with editor");
			return;
		}

		this.callbacks.push(callback);
		var txtFunc = "var Asc = {}; Asc.scope = " + JSON.stringify(window.Asc.scope || {}) + "; var scope = Asc.scope; (" + command.toString() + ")();";

		var message = {
			type : "command",
			recalculate : (isNoCalc === true) ? false : true,
			data : txtFunc
		};

		if (this.callbacks.length !== 1) {
			this.tasks.push(message);
			return;
		}

		this.sendMessage(message);
	};

	/**
	 * callMethod
	 * @memberof EditorConnector
	 * @alias callMethod
	 * @description Defines the method used to execute certain editor methods using the connector.
	 * The callback is the result that the method returns. It is an optional parameter.
	 * @param {string} name - The name of the specific method that must be executed.
	 * @param {Array} params - The arguments that the method in use has (if it has any).
	 * @param {Function} callback - The result that the method returns.
	 */
	EditorConnector.prototype.callMethod = function(name, params, callback) {
		if (!this.isConnected) {
			console.log("Connector is not connected with editor");
			return;
		}

		this.callbacks.push(callback);

		var message = {
			type : "method",
			methodName : name,
			data : params
		};

		if (this.callbacks.length !== 1) {
			this.tasks.push(message);
			return;
		}

		this.sendMessage(message);
	};

	/**
	 * attachEvent
	 * @memberof EditorConnector
	 * @alias attachEvent
	 * @description Add event listener.
	 * Add the function that will be called whenever the specified event is delivered to the target.
	 * @param {string} name - The name of the event.
	 * @param {Function} callback - Listener.
	 */
	EditorConnector.prototype.attachEvent = function(name, callback) {
		if (!this.isConnected) {
			console.log("Connector is not connected with editor");
			return;
		}

		this.events[name] = callback;
		this.sendMessage({
			type : "attachEvent",
			name : name
		});
	};

	/**
	 * detachEvent
	 * @memberof EditorConnector
	 * @alias detachEvent
	 * @description Remove event listener.
	 * Remove listener for event.
	 * @param {string} name - The name of the event.
	 */
	EditorConnector.prototype.detachEvent = function(name) {
		if (!this.events[name])
			return;

		delete this.events[name];

		if (!this.isConnected) {
			console.log("Connector is not connected with editor");
			return;
		}

		this.sendMessage({
			type : "detachEvent",
			name : name
		});
	};

	window.Asc = window.Asc ? window.Asc : {};
	window.Asc.EditorConnector = EditorConnector;

})(window);
