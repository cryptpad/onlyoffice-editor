(function(window, undefined){

	// correct fetch for desktop application

var printErr = undefined;
var print    = undefined;

var fetch = self.fetch;
var getBinaryPromise = null;
if (self.AscDesktopEditor && document.currentScript && 0 == document.currentScript.src.indexOf("file:///"))
{
	fetch = undefined; // fetch not support file:/// scheme
	getBinaryPromise = function()
	{
		var wasmPath = "ascdesktop://zlib/" + wasmBinaryFile.substr(8);
		return new Promise(function (resolve, reject)
		{
			var xhr = new XMLHttpRequest();
			xhr.open('GET', wasmPath, true);
			xhr.responseType = 'arraybuffer';

			if (xhr.overrideMimeType)
				xhr.overrideMimeType('text/plain; charset=x-user-defined');
			else
				xhr.setRequestHeader('Accept-Charset', 'x-user-defined');

			xhr.onload = function ()
			{
				if (this.status == 200)
					resolve(new Uint8Array(this.response));
			};
			xhr.send(null);
		});
	}
}
else
{
	getBinaryPromise = function() { return getBinaryPromise2(); }
}

	(function(){

	if (undefined !== String.prototype.fromUtf8 &&
		undefined !== String.prototype.toUtf8)
		return;

	/**
	 * Read string from utf8
	 * @param {Uint8Array} buffer
	 * @param {number} [start=0]
	 * @param {number} [len]
	 * @returns {string}
	 */
	String.prototype.fromUtf8 = function(buffer, start, len) {
		if (undefined === start)
			start = 0;
		if (undefined === len)
			len = buffer.length;

		var result = "";
		var index  = start;
		var end = start + len;
		while (index < end)
		{
			var u0 = buffer[index++];
			if (!(u0 & 128))
			{
				result += String.fromCharCode(u0);
				continue;
			}
			var u1 = buffer[index++] & 63;
			if ((u0 & 224) == 192)
			{
				result += String.fromCharCode((u0 & 31) << 6 | u1);
				continue;
			}
			var u2 = buffer[index++] & 63;
			if ((u0 & 240) == 224)
				u0 = (u0 & 15) << 12 | u1 << 6 | u2;
			else
				u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | buffer[index++] & 63;
			if (u0 < 65536)
				result += String.fromCharCode(u0);
			else
			{
				var ch = u0 - 65536;
				result += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
			}
		}
		return result;
	};

	/**
	 * Convert string to utf8 array
	 * @returns {Uint8Array}
	 */
	String.prototype.toUtf8 = function() {
		var inputLen = this.length;
		var testLen  = 6 * inputLen + 1;
		var tmpStrings = new ArrayBuffer(testLen);

		var code  = 0;
		var index = 0;

		var outputIndex = 0;
		var outputDataTmp = new Uint8Array(tmpStrings);
		var outputData = outputDataTmp;

		while (index < inputLen)
		{
			code = this.charCodeAt(index++);
			if (code >= 0xD800 && code <= 0xDFFF && index < inputLen)
				code = 0x10000 + (((code & 0x3FF) << 10) | (0x03FF & this.charCodeAt(index++)));

			if (code < 0x80)
				outputData[outputIndex++] = code;
			else if (code < 0x0800)
			{
				outputData[outputIndex++] = 0xC0 | (code >> 6);
				outputData[outputIndex++] = 0x80 | (code & 0x3F);
			}
			else if (code < 0x10000)
			{
				outputData[outputIndex++] = 0xE0 | (code >> 12);
				outputData[outputIndex++] = 0x80 | ((code >> 6) & 0x3F);
				outputData[outputIndex++] = 0x80 | (code & 0x3F);
			}
			else if (code < 0x1FFFFF)
			{
				outputData[outputIndex++] = 0xF0 | (code >> 18);
				outputData[outputIndex++] = 0x80 | ((code >> 12) & 0x3F);
				outputData[outputIndex++] = 0x80 | ((code >> 6) & 0x3F);
				outputData[outputIndex++] = 0x80 | (code & 0x3F);
			}
			else if (code < 0x3FFFFFF)
			{
				outputData[outputIndex++] = 0xF8 | (code >> 24);
				outputData[outputIndex++] = 0x80 | ((code >> 18) & 0x3F);
				outputData[outputIndex++] = 0x80 | ((code >> 12) & 0x3F);
				outputData[outputIndex++] = 0x80 | ((code >> 6) & 0x3F);
				outputData[outputIndex++] = 0x80 | (code & 0x3F);
			}
			else if (code < 0x7FFFFFFF)
			{
				outputData[outputIndex++] = 0xFC | (code >> 30);
				outputData[outputIndex++] = 0x80 | ((code >> 24) & 0x3F);
				outputData[outputIndex++] = 0x80 | ((code >> 18) & 0x3F);
				outputData[outputIndex++] = 0x80 | ((code >> 12) & 0x3F);
				outputData[outputIndex++] = 0x80 | ((code >> 6) & 0x3F);
				outputData[outputIndex++] = 0x80 | (code & 0x3F);
			}
		}

		outputData[outputIndex++] = 0;

		return new Uint8Array(tmpStrings, 0, outputIndex);
	};

})();


	var Module=typeof Module!=="undefined"?Module:{};var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}var arguments_=[];var thisProgram="./this.program";var quit_=function(status,toThrow){throw toThrow};var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!=="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=function(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=function(title){document.title=title}}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!=="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heap,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heap[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heap.subarray&&UTF8Decoder){return UTF8Decoder.decode(heap.subarray(idx,endPtr))}else{var str="";while(idx<endPtr){var u0=heap[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heap[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heap[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heap[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function alignUp(x,multiple){if(x%multiple>0){x+=multiple-x%multiple}return x}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[function(){self.onEngineInit();}];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what+="";err(what);ABORT=true;EXITSTATUS=1;what="abort("+what+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(what);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}var wasmBinaryFile="zlib.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise2(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["m"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["o"];addOnInit(Module["asm"]["n"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){var result=WebAssembly.instantiate(binary,info);return result}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else{return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync();return{}}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){wasmTable.get(func)()}else{wasmTable.get(func)(callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}var ExceptionInfoAttrs={DESTRUCTOR_OFFSET:0,REFCOUNT_OFFSET:4,TYPE_OFFSET:8,CAUGHT_OFFSET:12,RETHROWN_OFFSET:13,SIZE:16};function ___cxa_allocate_exception(size){return _malloc(size+ExceptionInfoAttrs.SIZE)+ExceptionInfoAttrs.SIZE}function ExceptionInfo(excPtr){this.excPtr=excPtr;this.ptr=excPtr-ExceptionInfoAttrs.SIZE;this.set_type=function(type){HEAP32[this.ptr+ExceptionInfoAttrs.TYPE_OFFSET>>2]=type};this.get_type=function(){return HEAP32[this.ptr+ExceptionInfoAttrs.TYPE_OFFSET>>2]};this.set_destructor=function(destructor){HEAP32[this.ptr+ExceptionInfoAttrs.DESTRUCTOR_OFFSET>>2]=destructor};this.get_destructor=function(){return HEAP32[this.ptr+ExceptionInfoAttrs.DESTRUCTOR_OFFSET>>2]};this.set_refcount=function(refcount){HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2]=refcount};this.set_caught=function(caught){caught=caught?1:0;HEAP8[this.ptr+ExceptionInfoAttrs.CAUGHT_OFFSET>>0]=caught};this.get_caught=function(){return HEAP8[this.ptr+ExceptionInfoAttrs.CAUGHT_OFFSET>>0]!=0};this.set_rethrown=function(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+ExceptionInfoAttrs.RETHROWN_OFFSET>>0]=rethrown};this.get_rethrown=function(){return HEAP8[this.ptr+ExceptionInfoAttrs.RETHROWN_OFFSET>>0]!=0};this.init=function(type,destructor){this.set_type(type);this.set_destructor(destructor);this.set_refcount(0);this.set_caught(false);this.set_rethrown(false)};this.add_ref=function(){var value=HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2];HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2]=value+1};this.release_ref=function(){var prev=HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2];HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2]=prev-1;return prev===1}}var exceptionLast=0;var uncaughtExceptionCount=0;function ___cxa_throw(ptr,type,destructor){var info=new ExceptionInfo(ptr);info.init(type,destructor);exceptionLast=ptr;uncaughtExceptionCount++;throw ptr}var SYSCALLS={mappings:{},buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}},varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret},get64:function(low,high){return low}};function ___sys_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;return 0}function ___sys_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;return 0}function ___sys_open(path,flags,varargs){SYSCALLS.varargs=varargs}function _abort(){abort()}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=2147483648;if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}function _fd_close(fd){return 0}function _fd_read(fd,iov,iovcnt,pnum){var stream=SYSCALLS.getStreamFromFD(fd);var num=SYSCALLS.doReadv(stream,iov,iovcnt);HEAP32[pnum>>2]=num;return 0}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){}function _fd_write(fd,iov,iovcnt,pnum){var num=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){SYSCALLS.printChar(fd,HEAPU8[ptr+j])}num+=len}HEAP32[pnum>>2]=num;return 0}var asmLibraryArg={"l":___cxa_allocate_exception,"k":___cxa_throw,"b":___sys_fcntl64,"g":___sys_ioctl,"h":___sys_open,"e":_abort,"j":_emscripten_memcpy_big,"d":_emscripten_resize_heap,"c":_fd_close,"f":_fd_read,"i":_fd_seek,"a":_fd_write};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["n"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return(_malloc=Module["_malloc"]=Module["asm"]["p"]).apply(null,arguments)};var _free=Module["_free"]=function(){return(_free=Module["_free"]=Module["asm"]["q"]).apply(null,arguments)};var _Zlib_Malloc=Module["_Zlib_Malloc"]=function(){return(_Zlib_Malloc=Module["_Zlib_Malloc"]=Module["asm"]["r"]).apply(null,arguments)};var _Zlib_Free=Module["_Zlib_Free"]=function(){return(_Zlib_Free=Module["_Zlib_Free"]=Module["asm"]["s"]).apply(null,arguments)};var _Zlib_Create=Module["_Zlib_Create"]=function(){return(_Zlib_Create=Module["_Zlib_Create"]=Module["asm"]["t"]).apply(null,arguments)};var _Zlib_Open=Module["_Zlib_Open"]=function(){return(_Zlib_Open=Module["_Zlib_Open"]=Module["asm"]["u"]).apply(null,arguments)};var _Zlib_Close=Module["_Zlib_Close"]=function(){return(_Zlib_Close=Module["_Zlib_Close"]=Module["asm"]["v"]).apply(null,arguments)};var _Zlib_AddFile=Module["_Zlib_AddFile"]=function(){return(_Zlib_AddFile=Module["_Zlib_AddFile"]=Module["asm"]["w"]).apply(null,arguments)};var _Zlib_RemoveFile=Module["_Zlib_RemoveFile"]=function(){return(_Zlib_RemoveFile=Module["_Zlib_RemoveFile"]=Module["asm"]["x"]).apply(null,arguments)};var _Zlib_GetPaths=Module["_Zlib_GetPaths"]=function(){return(_Zlib_GetPaths=Module["_Zlib_GetPaths"]=Module["asm"]["y"]).apply(null,arguments)};var _Zlib_GetFile=Module["_Zlib_GetFile"]=function(){return(_Zlib_GetFile=Module["_Zlib_GetFile"]=Module["asm"]["z"]).apply(null,arguments)};var _Zlib_Save=Module["_Zlib_Save"]=function(){return(_Zlib_Save=Module["_Zlib_Save"]=Module["asm"]["A"]).apply(null,arguments)};var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}Module["run"]=run;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();


	/**
	 * Class representing a zip archive creator/reader.
	 * @constructor
	 */
	function ZLib()
	{
		this.engine = 0;
		this.files = {};
	}

	/**
	 * Check loaded wasm/asmjs module
	 */
	ZLib.prototype.isModuleInit = false;

	/**
	 * Open archive from bytes
	 * @param {Uint8Array | ArrayBuffer} buf
	 * @returns {boolean} success or not
	 */
	ZLib.prototype.open = function(buf)
	{
		if (!this.isModuleInit)
			return false;

		if (this.engine)
			this.close();

		if (!buf)
			return false;

		var arrayBuffer = (undefined !== buf.byteLength) ? new Uint8Array(buf) : buf;

		var FileRawDataSize = arrayBuffer.length;
		var FileRawData = Module["_Zlib_Malloc"](FileRawDataSize);
		if (0 == FileRawData)
			return false;
		Module["HEAP8"].set(arrayBuffer, FileRawData);

		this.engine = Module["_Zlib_Open"](FileRawData, FileRawDataSize);
		if (0 == this.engine)
		{
			Module["_Zlib_Free"](FileRawData);
			return false;
		}

		var pointer = Module["_Zlib_GetPaths"](this.engine);
		if (0 == pointer)
		{
			Module["_Zlib_Close"](this.engine);
			Module["_Zlib_Free"](FileRawData);
			return false;
		}
		var lenArray = new Int32Array(Module["HEAP8"].buffer, pointer, 4);
		var len = lenArray[0];
		len -= 4;

		var buffer = new Uint8Array(Module["HEAP8"].buffer, pointer + 4, len);
		var index = 0;
		while (index < len)
		{
			var lenRec = buffer[index] | buffer[index + 1] << 8 | buffer[index + 2] << 16 | buffer[index + 3] << 24;
			index += 4;
			var _path = "".fromUtf8(buffer, index, lenRec);
			this.files[_path] = null;
			index += lenRec;
		}
		return true;
	};

	/**
	 * Create new archive
	 * @returns {boolean} success or not
	 */
	ZLib.prototype.create = function()
	{
		if (!this.isModuleInit)
			return false;

		if (this.engine)
			this.close();

		this.engine = Module["_Zlib_Create"]();
		return !!this.engine;
	};

	/**
	 * Save archive from current files
	 * @returns {Uint8Array | null} zip-archive bytes, or null if error
	 */
	ZLib.prototype.save = function()
	{
		if (!this.isModuleInit || !this.engine)
			return null;

		var pointerZip = Module["_Zlib_Save"](this.engine);
		if (0 == pointerZip)
			return null;

		var _lenFile = new Int32Array(Module["HEAP8"].buffer, pointerZip, 4);
		var len = _lenFile[0];
		var zip = new Uint8Array(Module["HEAP8"].buffer, pointerZip + 4, len);
		return zip;
	};

	/**
	 * Get uncomressed file from archive
	 * @param {string} path
	 * @returns {Uint8Array | null} bytes of uncompressed data, or null if error
	 */
	ZLib.prototype.getFile = function(path)
	{
		if (!this.isModuleInit || !this.engine)
			return null;

		if (undefined === this.files[path])
			return null;

		if (null !== this.files[path])
			return this.files[path];

		var tmp = path.toUtf8();
		var pointer = Module["_Zlib_Malloc"](tmp.length);
		if (0 == pointer)
			return null;
		Module["HEAP8"].set(tmp, pointer);

		var heapOldLen = Module["HEAP8"].buffer.byteLength;
		var pointerFile = Module["_Zlib_GetFile"](this.engine, pointer);
		if (0 == pointerFile) 
		{
			Module["_Zlib_Free"](pointer);
			return null;
		}

		//clear cache after buffer reallocation
		if (heapOldLen < Module["HEAP8"].buffer.byteLength) {
			for (var i in this.files) {
				if (this.files.hasOwnProperty(i)) {
					this.files[i] = null;
				}
			}
		}

		var _lenFile = new Int32Array(Module["HEAP8"].buffer, pointerFile, 4);
		var len = _lenFile[0];
		var fileData = new Uint8Array(Module["HEAP8"].buffer, pointerFile + 4, len);

		Module["_Zlib_Free"](pointer);
		this.files[path] = fileData;
		return fileData;
	};

	/**
	 * Add uncomressed file to archive
	 * @param {string} path
	 * @param {Uint8Array} new file in archive
	 * @returns {boolean} success or not
	 */
	ZLib.prototype.addFile = function(path, data)
	{
		if (!this.isModuleInit || !this.engine)
			return false;

		if (undefined !== this.files[path])
			this.removeFile(path);

		var tmp = path.toUtf8();
		var pointer = Module["_Zlib_Malloc"](tmp.length);
		if (0 == pointer)
			return false;
		Module["HEAP8"].set(tmp, pointer);
		
		if (!data)
			return false;

		var arrayBuffer = (undefined !== data.byteLength) ? new Uint8Array(data) : data;

		var FileRawDataSize = arrayBuffer.length;
		var FileRawData = Module["_Zlib_Malloc"](FileRawDataSize);
		if (0 == FileRawData)
			return false;
		Module["HEAP8"].set(arrayBuffer, FileRawData);
		
		Module["_Zlib_AddFile"](this.engine, pointer, FileRawData, FileRawDataSize);

		this.files[path] = data;
		return true;
	};

	/**
	 * Remove file from archive
	 * @param {string} path
	 * @returns {boolean} success or not
	 */
	ZLib.prototype.removeFile = function(path)
	{
		if (!this.isModuleInit || !this.engine)
			return false;

		if (undefined === this.files[path])
			return false;
			
		var tmp = path.toUtf8();
		var pointer = Module["_Zlib_Malloc"](tmp.length);
		if (0 == pointer)
			return false;
		Module["HEAP8"].set(tmp, pointer);
		
		Module["_Zlib_RemoveFile"](this.engine, pointer);

		delete this.files[path];
		return true;
	};

	/**
	 * Close & remove all used memory in archive
	 * @returns {undefined}
	 */
	ZLib.prototype.close = function()
	{
		if (!this.isModuleInit || !this.engine)
			return;

		this.files = {};
		if (this.engine)
			Module["_Zlib_Free"](this.engine);
	};

window.nativeZlibEngine = new ZLib();
window.onEngineInit = function()
{
	window.nativeZlibEngine.isModuleInit = true;
};

})(window, undefined);

