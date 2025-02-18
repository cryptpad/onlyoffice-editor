/*
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

(function(window, undefined) {

    var AscFonts = window['AscFonts'];
    var printErr = undefined;
    var FS = undefined;
    var print = undefined;

    var fetch = window.fetch;
    var getBinaryPromise = null;
    if (window["AscDesktopEditor"] && document.currentScript && 0 == document.currentScript.src.indexOf("file:///"))
    {
        fetch = undefined; // fetch not support file:/// scheme
        getBinaryPromise = function() {

            var wasmPath = "ascdesktop://fonts/" + wasmBinaryFile.substr(8);
            return new Promise(function (resolve, reject) {

                var xhr = new XMLHttpRequest();
                xhr.open('GET', wasmPath, true);
                xhr.responseType = 'arraybuffer';

                if (xhr.overrideMimeType)
                    xhr.overrideMimeType('text/plain; charset=x-user-defined');
                else
                    xhr.setRequestHeader('Accept-Charset', 'x-user-defined');

                xhr.onload = function () {
                    if (this.status == 200) {
                        resolve(new Uint8Array(this.response));
                    }
                };

                xhr.send(null);

            });
        }
    }
    else
    {
        getBinaryPromise = function() {
            return getBinaryPromise2();
        }
    }

    var Module=typeof Module!=="undefined"?Module:{};var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}var arguments_=[];var thisProgram="./this.program";var quit_=function(status,toThrow){throw toThrow};var ENVIRONMENT_IS_WEB=true;var ENVIRONMENT_IS_WORKER=false;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(document.currentScript){scriptDirectory=document.currentScript.src}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=function shell_read(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=function readBinary(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=function readAsync(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function xhr_onload(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=function(title){document.title=title}}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var tempRet0=0;var setTempRet0=function(value){tempRet0=value};var getTempRet0=function(){return tempRet0};var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime;if(Module["noExitRuntime"])noExitRuntime=Module["noExitRuntime"];if(typeof WebAssembly!=="object"){err("no native wasm support detected")}var wasmMemory;var wasmTable=new WebAssembly.Table({"initial":573,"maximum":573+0,"element":"anyfunc"});var ABORT=false;var EXITSTATUS=0;var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(u8Array,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(u8Array[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&u8Array.subarray&&UTF8Decoder){return UTF8Decoder.decode(u8Array.subarray(idx,endPtr))}else{var str="";while(idx<endPtr){var u0=u8Array[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=u8Array[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=u8Array[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|u8Array[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){HEAP8[buffer++>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>0]=0}var WASM_PAGE_SIZE=65536;function alignUp(x,multiple){if(x%multiple>0){x+=multiple-x%multiple}return x}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var DYNAMIC_BASE=5353008,DYNAMICTOP_PTR=109968;var INITIAL_TOTAL_MEMORY=Module["TOTAL_MEMORY"]||16777216;if(Module["wasmMemory"]){wasmMemory=Module["wasmMemory"]}else{wasmMemory=new WebAssembly.Memory({"initial":INITIAL_TOTAL_MEMORY/WASM_PAGE_SIZE})}if(wasmMemory){buffer=wasmMemory.buffer}INITIAL_TOTAL_MEMORY=buffer.byteLength;updateGlobalBufferAndViews(buffer);HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE;function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Module["dynCall_v"](func)}else{Module["dynCall_vi"](func,callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[function(){window["AscFonts"].onLoadModule();}];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what+="";out(what);err(what);ABORT=true;EXITSTATUS=1;what="abort("+what+"). Build with -s ASSERTIONS=1 for more info.";throw new WebAssembly.RuntimeError(what)}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return String.prototype.startsWith?filename.startsWith(dataURIPrefix):filename.indexOf(dataURIPrefix)===0}var wasmBinaryFile="fonts.wasm?"+window.CP_urlArgs;if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(){try{if(wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(wasmBinaryFile)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise2(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary()})}return new Promise(function(resolve,reject){resolve(getBinary())})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiatedSource(output){receiveInstance(output["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch==="function"){fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiatedSource,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");instantiateArrayBuffer(receiveInstantiatedSource)})})}else{return instantiateArrayBuffer(receiveInstantiatedSource)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync();return{}}__ATINIT__.push({func:function(){___wasm_call_ctors()}});function ___lock(){}var PATH={splitPath:function(filename){var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:function(parts,allowAboveRoot){var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts},normalize:function(path){var isAbsolute=path.charAt(0)==="/",trailingSlash=path.substr(-1)==="/";path=PATH.normalizeArray(path.split("/").filter(function(p){return!!p}),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path},dirname:function(path){var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir},basename:function(path){if(path==="/")return"/";var lastSlash=path.lastIndexOf("/");if(lastSlash===-1)return path;return path.substr(lastSlash+1)},extname:function(path){return PATH.splitPath(path)[3]},join:function(){var paths=Array.prototype.slice.call(arguments,0);return PATH.normalize(paths.join("/"))},join2:function(l,r){return PATH.normalize(l+"/"+r)}};var SYSCALLS={buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}},varargs:0,get:function(varargs){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(){var ret=UTF8ToString(SYSCALLS.get());return ret},get64:function(){var low=SYSCALLS.get(),high=SYSCALLS.get();return low},getZero:function(){SYSCALLS.get()}};function ___syscall221(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall5(which,varargs){SYSCALLS.varargs=varargs;try{var pathname=SYSCALLS.getStr(),flags=SYSCALLS.get(),mode=SYSCALLS.get();var stream=FS.open(pathname,flags,mode);return stream.fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall54(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___unlock(){}function _emscripten_get_heap_size(){return HEAP8.length}var setjmpId=0;function _saveSetjmp(env,label,table,size){env=env|0;label=label|0;table=table|0;size=size|0;var i=0;setjmpId=setjmpId+1|0;HEAP32[env>>2]=setjmpId;while((i|0)<(size|0)){if((HEAP32[table+(i<<3)>>2]|0)==0){HEAP32[table+(i<<3)>>2]=setjmpId;HEAP32[table+((i<<3)+4)>>2]=label;HEAP32[table+((i<<3)+8)>>2]=0;setTempRet0(size|0);return table|0}i=i+1|0}size=size*2|0;table=_realloc(table|0,8*(size+1|0)|0)|0;table=_saveSetjmp(env|0,label|0,table|0,size|0)|0;setTempRet0(size|0);return table|0}function _testSetjmp(id,table,size){id=id|0;table=table|0;size=size|0;var i=0,curr=0;while((i|0)<(size|0)){curr=HEAP32[table+(i<<3)>>2]|0;if((curr|0)==0)break;if((curr|0)==(id|0)){return HEAP32[table+((i<<3)+4)>>2]|0}i=i+1|0}return 0}function _longjmp(env,value){_setThrew(env,value||1);throw"longjmp"}function _emscripten_longjmp(env,value){_longjmp(env,value)}function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest)}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=_emscripten_get_heap_size();var PAGE_MULTIPLE=65536;var maxHeapSize=2147483648-PAGE_MULTIPLE;if(requestedSize>maxHeapSize){return false}var minHeapSize=16777216;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(minHeapSize,requestedSize,overGrownHeapSize),PAGE_MULTIPLE));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}var ENV={};function _emscripten_get_environ(){if(!_emscripten_get_environ.strings){var env={"USER":"web_user","LOGNAME":"web_user","PATH":"/","PWD":"/","HOME":"/home/web_user","LANG":(typeof navigator==="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8","_":thisProgram};for(var x in ENV){env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(x+"="+env[x])}_emscripten_get_environ.strings=strings}return _emscripten_get_environ.strings}function _environ_get(__environ,environ_buf){var strings=_emscripten_get_environ();var bufSize=0;strings.forEach(function(string,i){var ptr=environ_buf+bufSize;HEAP32[__environ+i*4>>2]=ptr;writeAsciiToMemory(string,ptr);bufSize+=string.length+1});return 0}function _environ_sizes_get(penviron_count,penviron_buf_size){var strings=_emscripten_get_environ();HEAP32[penviron_count>>2]=strings.length;var bufSize=0;strings.forEach(function(string){bufSize+=string.length+1});HEAP32[penviron_buf_size>>2]=bufSize;return 0}function _fd_close(fd){try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_read(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=SYSCALLS.doReadv(stream,iov,iovcnt);HEAP32[pnum>>2]=num;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_write(fd,iov,iovcnt,pnum){try{var num=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){SYSCALLS.printChar(fd,HEAPU8[ptr+j])}num+=len}HEAP32[pnum>>2]=num;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _getTempRet0(){return getTempRet0()|0}function _setTempRet0($i){setTempRet0($i|0)}var asmLibraryArg={"v":___lock,"f":___syscall221,"i":___syscall5,"u":___syscall54,"e":___unlock,"b":_emscripten_longjmp,"n":_emscripten_memcpy_big,"p":_emscripten_resize_heap,"q":_environ_get,"r":_environ_sizes_get,"g":_fd_close,"t":_fd_read,"m":_fd_seek,"s":_fd_write,"a":_getTempRet0,"k":invoke_iii,"o":invoke_iiii,"j":invoke_iiiii,"l":invoke_vii,"memory":wasmMemory,"h":_saveSetjmp,"c":_setTempRet0,"table":wasmTable,"d":_testSetjmp};var asm=createWasm();Module["asm"]=asm;var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["w"]).apply(null,arguments)};var _FT_Load_Glyph=Module["_FT_Load_Glyph"]=function(){return(_FT_Load_Glyph=Module["_FT_Load_Glyph"]=Module["asm"]["x"]).apply(null,arguments)};var _FT_Set_Transform=Module["_FT_Set_Transform"]=function(){return(_FT_Set_Transform=Module["_FT_Set_Transform"]=Module["asm"]["y"]).apply(null,arguments)};var _FT_Done_Face=Module["_FT_Done_Face"]=function(){return(_FT_Done_Face=Module["_FT_Done_Face"]=Module["asm"]["z"]).apply(null,arguments)};var _FT_Set_Char_Size=Module["_FT_Set_Char_Size"]=function(){return(_FT_Set_Char_Size=Module["_FT_Set_Char_Size"]=Module["asm"]["A"]).apply(null,arguments)};var _FT_Get_Glyph=Module["_FT_Get_Glyph"]=function(){return(_FT_Get_Glyph=Module["_FT_Get_Glyph"]=Module["asm"]["B"]).apply(null,arguments)};var _FT_Done_FreeType=Module["_FT_Done_FreeType"]=function(){return(_FT_Done_FreeType=Module["_FT_Done_FreeType"]=Module["asm"]["C"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return(_malloc=Module["_malloc"]=Module["asm"]["D"]).apply(null,arguments)};var _realloc=Module["_realloc"]=function(){return(_realloc=Module["_realloc"]=Module["asm"]["E"]).apply(null,arguments)};var _free=Module["_free"]=function(){return(_free=Module["_free"]=Module["asm"]["F"]).apply(null,arguments)};var _ASC_FT_Malloc=Module["_ASC_FT_Malloc"]=function(){return(_ASC_FT_Malloc=Module["_ASC_FT_Malloc"]=Module["asm"]["G"]).apply(null,arguments)};var _ASC_FT_Free=Module["_ASC_FT_Free"]=function(){return(_ASC_FT_Free=Module["_ASC_FT_Free"]=Module["asm"]["H"]).apply(null,arguments)};var _ASC_FT_Init=Module["_ASC_FT_Init"]=function(){return(_ASC_FT_Init=Module["_ASC_FT_Init"]=Module["asm"]["I"]).apply(null,arguments)};var _ASC_FT_Open_Face=Module["_ASC_FT_Open_Face"]=function(){return(_ASC_FT_Open_Face=Module["_ASC_FT_Open_Face"]=Module["asm"]["J"]).apply(null,arguments)};var _ASC_FT_SetCMapForCharCode=Module["_ASC_FT_SetCMapForCharCode"]=function(){return(_ASC_FT_SetCMapForCharCode=Module["_ASC_FT_SetCMapForCharCode"]=Module["asm"]["K"]).apply(null,arguments)};var _ASC_FT_GetFaceInfo=Module["_ASC_FT_GetFaceInfo"]=function(){return(_ASC_FT_GetFaceInfo=Module["_ASC_FT_GetFaceInfo"]=Module["asm"]["L"]).apply(null,arguments)};var _ASC_FT_GetFaceMaxAdvanceX=Module["_ASC_FT_GetFaceMaxAdvanceX"]=function(){return(_ASC_FT_GetFaceMaxAdvanceX=Module["_ASC_FT_GetFaceMaxAdvanceX"]=Module["asm"]["M"]).apply(null,arguments)};var _ASC_FT_GetKerningX=Module["_ASC_FT_GetKerningX"]=function(){return(_ASC_FT_GetKerningX=Module["_ASC_FT_GetKerningX"]=Module["asm"]["N"]).apply(null,arguments)};var _ASC_FT_Glyph_Get_CBox=Module["_ASC_FT_Glyph_Get_CBox"]=function(){return(_ASC_FT_Glyph_Get_CBox=Module["_ASC_FT_Glyph_Get_CBox"]=Module["asm"]["O"]).apply(null,arguments)};var _ASC_FT_Get_Glyph_Measure_Params=Module["_ASC_FT_Get_Glyph_Measure_Params"]=function(){return(_ASC_FT_Get_Glyph_Measure_Params=Module["_ASC_FT_Get_Glyph_Measure_Params"]=Module["asm"]["P"]).apply(null,arguments)};var _ASC_FT_Get_Glyph_Render_Params=Module["_ASC_FT_Get_Glyph_Render_Params"]=function(){return(_ASC_FT_Get_Glyph_Render_Params=Module["_ASC_FT_Get_Glyph_Render_Params"]=Module["asm"]["Q"]).apply(null,arguments)};var _ASC_FT_Get_Glyph_Render_Buffer=Module["_ASC_FT_Get_Glyph_Render_Buffer"]=function(){return(_ASC_FT_Get_Glyph_Render_Buffer=Module["_ASC_FT_Get_Glyph_Render_Buffer"]=Module["asm"]["R"]).apply(null,arguments)};var _ASC_FT_Set_Transform=Module["_ASC_FT_Set_Transform"]=function(){return(_ASC_FT_Set_Transform=Module["_ASC_FT_Set_Transform"]=Module["asm"]["S"]).apply(null,arguments)};var _ASC_FT_Set_TrueType_HintProp=Module["_ASC_FT_Set_TrueType_HintProp"]=function(){return(_ASC_FT_Set_TrueType_HintProp=Module["_ASC_FT_Set_TrueType_HintProp"]=Module["asm"]["T"]).apply(null,arguments)};var _setThrew=Module["_setThrew"]=function(){return(_setThrew=Module["_setThrew"]=Module["asm"]["U"]).apply(null,arguments)};var dynCall_vii=Module["dynCall_vii"]=function(){return(dynCall_vii=Module["dynCall_vii"]=Module["asm"]["V"]).apply(null,arguments)};var dynCall_iii=Module["dynCall_iii"]=function(){return(dynCall_iii=Module["dynCall_iii"]=Module["asm"]["W"]).apply(null,arguments)};var dynCall_iiii=Module["dynCall_iiii"]=function(){return(dynCall_iiii=Module["dynCall_iiii"]=Module["asm"]["X"]).apply(null,arguments)};var dynCall_iiiii=Module["dynCall_iiiii"]=function(){return(dynCall_iiiii=Module["dynCall_iiiii"]=Module["asm"]["Y"]).apply(null,arguments)};var stackSave=Module["stackSave"]=function(){return(stackSave=Module["stackSave"]=Module["asm"]["Z"]).apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){return(stackRestore=Module["stackRestore"]=Module["asm"]["_"]).apply(null,arguments)};var dynCall_vi=Module["dynCall_vi"]=function(){return(dynCall_vi=Module["dynCall_vi"]=Module["asm"]["$"]).apply(null,arguments)};function invoke_iiii(index,a1,a2,a3){var sp=stackSave();try{return dynCall_iiii(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vii(index,a1,a2){var sp=stackSave();try{dynCall_vii(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iii(index,a1,a2){var sp=stackSave();try{return dynCall_iii(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_iiiii(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}Module["asm"]=asm;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0)return;function doRun(){if(calledRun)return;calledRun=true;if(ABORT)return;initRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}Module["run"]=run;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}noExitRuntime=true;run();

    window['AscFonts'] = window['AscFonts'] || {};
    var AscFonts = window['AscFonts'];

    AscFonts.CreateLibrary = function()
    {
        return Module["_ASC_FT_Init"]();
    };

    AscFonts.TT_INTERPRETER_VERSION_35 = 35;
    AscFonts.TT_INTERPRETER_VERSION_38 = 38;
    AscFonts.TT_INTERPRETER_VERSION_40 = 40;

    AscFonts.FT_Set_TrueType_HintProp = function(library, tt_interpreter)
    {
        return Module["_ASC_FT_Set_TrueType_HintProp"](library, tt_interpreter);
    };

    AscFonts.CreateNativeStream = function(_typed_array)
    {
        var _fontStreamPointer = Module["_ASC_FT_Malloc"](_typed_array.size);
        Module["HEAP8"].set(_typed_array.data, _fontStreamPointer);
        return { asc_marker: true, data: _fontStreamPointer, len: _typed_array.size};
    };

    AscFonts.CreateNativeStreamByIndex = function(stream_index)
    {
        var _stream_pos = AscFonts.g_fonts_streams[stream_index];
        if (_stream_pos && true !== _stream_pos.asc_marker)
        {
            var _native_stream = AscFonts.CreateNativeStream(AscFonts.g_fonts_streams[stream_index]);
            AscFonts.g_fonts_streams[stream_index] = null;
            AscFonts.g_fonts_streams[stream_index] = _native_stream;
        }
    };

    function CFaceInfo()
    {
        this.units_per_EM = 0;
        this.ascender = 0;
        this.descender = 0;
        this.height = 0;
        this.face_flags = 0;
        this.num_faces = 0;
        this.num_glyphs = 0;
        this.num_charmaps = 0;
        this.style_flags = 0;
        this.face_index = 0;

        this.family_name = "";

        this.style_name = "";

        this.os2_version = 0;
        this.os2_usWeightClass = 0;
        this.os2_fsSelection = 0;
        this.os2_usWinAscent = 0;
        this.os2_usWinDescent = 0;
        this.os2_usDefaultChar = 0;
        this.os2_sTypoAscender = 0;
        this.os2_sTypoDescender = 0;
        this.os2_sTypoLineGap = 0;

        this.os2_ulUnicodeRange1 = 0;
        this.os2_ulUnicodeRange2 = 0;
        this.os2_ulUnicodeRange3 = 0;
        this.os2_ulUnicodeRange4 = 0;
        this.os2_ulCodePageRange1 = 0;
        this.os2_ulCodePageRange2 = 0;

        this.os2_nSymbolic = 0;

        this.header_yMin = 0;
        this.header_yMax = 0;

        this.monochromeSizes = [];
    };

    CFaceInfo.prototype.load = function(face)
    {
        var _bufferPtr = Module["_ASC_FT_GetFaceInfo"](face);
        if (!_bufferPtr)
            return;

        var _len_buffer = Math.min((Module["HEAP8"].length - _bufferPtr) >> 2, 250); //max 230 symbols on name & style
        var _buffer = new Int32Array(Module["HEAP8"].buffer, _bufferPtr, _len_buffer);
        var _index = 0;

        this.units_per_EM 	= Math.abs(_buffer[_index++]);
        this.ascender 		= _buffer[_index++];
        this.descender 		= _buffer[_index++];
        this.height 		= _buffer[_index++];
        this.face_flags 	= _buffer[_index++];
        this.num_faces 		= _buffer[_index++];
        this.num_glyphs 	= _buffer[_index++];
        this.num_charmaps 	= _buffer[_index++];
        this.style_flags 	= _buffer[_index++];
        this.face_index 	= _buffer[_index++];

        var c = _buffer[_index++];
        while (c)
        {
            this.family_name += String.fromCharCode(c);
            c = _buffer[_index++];
        }

        c = _buffer[_index++];
        while (c)
        {
            this.style_name += String.fromCharCode(c);
            c = _buffer[_index++];
        }

        this.os2_version 		= _buffer[_index++];
        this.os2_usWeightClass 	= _buffer[_index++];
        this.os2_fsSelection 	= _buffer[_index++];
        this.os2_usWinAscent 	= _buffer[_index++];
        this.os2_usWinDescent 	= _buffer[_index++];
        this.os2_usDefaultChar 	= _buffer[_index++];
        this.os2_sTypoAscender 	= _buffer[_index++];
        this.os2_sTypoDescender = _buffer[_index++];
        this.os2_sTypoLineGap 	= _buffer[_index++];

        this.os2_ulUnicodeRange1 	= AscFonts.FT_Common.IntToUInt(_buffer[_index++]);
        this.os2_ulUnicodeRange2 	= AscFonts.FT_Common.IntToUInt(_buffer[_index++]);
        this.os2_ulUnicodeRange3 	= AscFonts.FT_Common.IntToUInt(_buffer[_index++]);
        this.os2_ulUnicodeRange4 	= AscFonts.FT_Common.IntToUInt(_buffer[_index++]);
        this.os2_ulCodePageRange1 	= AscFonts.FT_Common.IntToUInt(_buffer[_index++]);
        this.os2_ulCodePageRange2 	= AscFonts.FT_Common.IntToUInt(_buffer[_index++]);

        this.os2_nSymbolic 			= _buffer[_index++];
        this.header_yMin 			= _buffer[_index++];
        this.header_yMax 			= _buffer[_index++];

        var fixedSizesCount = _buffer[_index++];
        for (var i = 0; i < fixedSizesCount; i++)
            this.monochromeSizes.push(_buffer[_index++]);

        Module["_ASC_FT_Free"](_bufferPtr);
    };

    function CGlyphMetrics()
    {
        this.bbox_xMin = 0;
        this.bbox_yMin = 0;
        this.bbox_xMax = 0;
        this.bbox_yMax = 0;

        this.width          = 0;
        this.height         = 0;

        this.horiAdvance    = 0;
        this.horiBearingX   = 0;
        this.horiBearingY   = 0;

        this.vertAdvance    = 0;
        this.vertBearingX   = 0;
        this.vertBearingY   = 0;

        this.linearHoriAdvance = 0;
        this.linearVertAdvance = 0;
    }

    function CGlyphBitmapImage()
    {
        this.left   = 0;
        this.top    = 0;
        this.width  = 0;
        this.rows   = 0;
        this.pitch  = 0;
        this.mode   = 0;
    }

    AscFonts.CFaceInfo = CFaceInfo;
    AscFonts.CGlyphMetrics = CGlyphMetrics;
    AscFonts.CGlyphBitmapImage = CGlyphBitmapImage;

    AscFonts.FT_Open_Face = function(library, stream, face_index)
    {
        return Module["_ASC_FT_Open_Face"](library, stream.data, stream.len, face_index);
    };

    AscFonts.FT_Glyph_Get_Measure = function(face, vector_worker, painter)
    {
        var _bufferPtr = Module["_ASC_FT_Get_Glyph_Measure_Params"](face, vector_worker ? 1 : 0);
        if (!_bufferPtr)
            return null;

        var _len = 15;
        if (vector_worker)
            _len = Module["HEAP32"][_bufferPtr >> 2];

        var _buffer = new Int32Array(Module["HEAP8"].buffer, _bufferPtr, _len);

        var _info = new CGlyphMetrics();
        _info.bbox_xMin     = _buffer[1];
        _info.bbox_yMin     = _buffer[2];
        _info.bbox_xMax     = _buffer[3];
        _info.bbox_yMax     = _buffer[4];

        _info.width         = _buffer[5];
        _info.height        = _buffer[6];

        _info.horiAdvance   = _buffer[7];
        _info.horiBearingX  = _buffer[8];
        _info.horiBearingY  = _buffer[9];

        _info.vertAdvance   = _buffer[10];
        _info.vertBearingX  = _buffer[11];
        _info.vertBearingY  = _buffer[12];

        _info.linearHoriAdvance     = _buffer[13];
        _info.linearVertAdvance     = _buffer[14];

        if (vector_worker)
        {
            painter.start(vector_worker);

            var _pos = 15;
            while (_pos < _len)
            {
                switch (_buffer[_pos++])
                {
                    case 0:
                    {
                        painter._move_to(_buffer[_pos++], _buffer[_pos++], vector_worker);
                        break;
                    }
                    case 1:
                    {
                        painter._line_to(_buffer[_pos++], _buffer[_pos++], vector_worker);
                        break;
                    }
                    case 2:
                    {
                        painter._conic_to(_buffer[_pos++], _buffer[_pos++], _buffer[_pos++], _buffer[_pos++], vector_worker);
                        break;
                    }
                    case 3:
                    {
                        painter._cubic_to(_buffer[_pos++], _buffer[_pos++], _buffer[_pos++], _buffer[_pos++], _buffer[_pos++], _buffer[_pos++], vector_worker);
                        break;
                    }
                    default:
                        break;
                }
            }

            painter.end(vector_worker);
        }

        Module["_ASC_FT_Free"](_bufferPtr);
        _buffer = null;

        return _info;
    };

    AscFonts.FT_Glyph_Get_Raster = function(face, render_mode)
    {
        var _bufferPtr = Module["_ASC_FT_Get_Glyph_Render_Params"](face, render_mode);
        if (!_bufferPtr)
            return null;

        var _buffer = new Int32Array(Module["HEAP8"].buffer, _bufferPtr, 6);

        var _info = new CGlyphBitmapImage();
        _info.left    = _buffer[0];
        _info.top     = _buffer[1];
        _info.width   = _buffer[2];
        _info.rows    = _buffer[3];
        _info.pitch   = _buffer[4];
        _info.mode    = _buffer[5];

        Module["_ASC_FT_Free"](_bufferPtr);
        return _info;
    };

    AscFonts.FT_Load_Glyph = Module["_FT_Load_Glyph"];
    AscFonts.FT_Set_Transform = Module["_ASC_FT_Set_Transform"];
    AscFonts.FT_Set_Char_Size = Module["_FT_Set_Char_Size"];

    AscFonts.FT_SetCMapForCharCode = Module["_ASC_FT_SetCMapForCharCode"];
    AscFonts.FT_GetKerningX = Module["_ASC_FT_GetKerningX"];
    AscFonts.FT_GetFaceMaxAdvanceX = Module["_ASC_FT_GetFaceMaxAdvanceX"];
    AscFonts.FT_Get_Glyph_Render_Buffer = function(face, rasterInfo, isCopyToRasterMemory)
    {
        var _bufferPtr = Module["_ASC_FT_Get_Glyph_Render_Buffer"](face);
        var tmp = new Uint8Array(Module["HEAP8"].buffer, _bufferPtr, rasterInfo.pitch * rasterInfo.rows);

        if (!isCopyToRasterMemory)
            return tmp;

        AscFonts.raster_memory.CheckSize(rasterInfo.width, rasterInfo.rows);

        var offsetSrc = 0;
        var offsetDst = 3;
        var dstData = AscFonts.raster_memory.m_oBuffer.data;

        if (rasterInfo.pitch >= rasterInfo.width)
		{
			for (var j = 0; j < rasterInfo.rows; ++j, offsetSrc += rasterInfo.pitch)
			{
				offsetDst = 3 + j * AscFonts.raster_memory.pitch;
				for (var i = 0; i < rasterInfo.width; i++, offsetDst += 4)
				{
					dstData[offsetDst] = tmp[offsetSrc + i];
				}
			}
		}
		else
        {
            var bitNumber = 0;
            var byteNumber = 0;
			for (var j = 0; j < rasterInfo.rows; ++j, offsetSrc += rasterInfo.pitch)
			{
				offsetDst = 3 + j * AscFonts.raster_memory.pitch;
				bitNumber = 0;
				byteNumber = 0;
				for (var i = 0; i < rasterInfo.width; i++, offsetDst += 4, bitNumber++)
				{
				    if (8 == bitNumber)
                    {
                        bitNumber = 0;
                        byteNumber++;
                    }
					dstData[offsetDst] = (tmp[offsetSrc + byteNumber] & (1 << (7 - bitNumber))) ? 255 : 0;
				}
			}
        }

        tmp = null;
    };

    AscFonts.onLoadModule();

})(window, undefined);

/*
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(function (window, undefined)
{
    //window.measureTime = 0;
    //window.rasterTime = 0;
	var AscFonts = window['AscFonts'];
    var AscCommon = window['AscCommon'];

	AscFonts.FT_Load_Mode = {
		FT_LOAD_DEFAULT                     : 0,
		FT_LOAD_NO_SCALE                    : 1 << 0,
		FT_LOAD_NO_HINTING                  : 1 << 1,
		FT_LOAD_RENDER                      : 1 << 2,
		FT_LOAD_NO_BITMAP                   : 1 << 3,
		FT_LOAD_VERTICAL_LAYOUT             : 1 << 4,
		FT_LOAD_FORCE_AUTOHINT              : 1 << 5,
		FT_LOAD_CROP_BITMAP                 : 1 << 6,
		FT_LOAD_PEDANTIC                    : 1 << 7,
		FT_LOAD_IGNORE_GLOBAL_ADVANCE_WIDTH : 1 << 9,
		FT_LOAD_NO_RECURSE                  : 1 << 10,
		FT_LOAD_IGNORE_TRANSFORM            : 1 << 11,
		FT_LOAD_MONOCHROME                  : 1 << 12,
		FT_LOAD_LINEAR_DESIGN               : 1 << 13,
		FT_LOAD_NO_AUTOHINT                 : 1 << 15,

		FT_LOAD_COLOR                       : 1 << 20,
		FT_LOAD_COMPUTE_METRICS             : 1 << 21,
		FT_LOAD_BITMAP_METRICS_ONLY  		: 1 << 22
	};

	AscFonts.FT_Render_Mode = {
		FT_RENDER_MODE_NORMAL 	: 0,
		FT_RENDER_MODE_LIGHT	: 1,
		FT_RENDER_MODE_MONO		: 2,
		FT_RENDER_MODE_LCD		: 3,
		FT_RENDER_MODE_LCD_V	: 4,
		FT_RENDER_MODE_MAX		: 5
	};

	function _ft_load_target(val) { return (val & 15) << 16; }

	AscFonts.FT_Load_Target_Mode = {
		FT_LOAD_TARGET_NORMAL 	: _ft_load_target(AscFonts.FT_Render_Mode.FT_RENDER_MODE_NORMAL),
		FT_LOAD_TARGET_LIGHT	: _ft_load_target(AscFonts.FT_Render_Mode.FT_RENDER_MODE_LIGHT),
		FT_LOAD_TARGET_MONO		: _ft_load_target(AscFonts.FT_Render_Mode.FT_RENDER_MODE_MONO),
		FT_LOAD_TARGET_LCD		: _ft_load_target(AscFonts.FT_Render_Mode.FT_RENDER_MODE_LCD),
		FT_LOAD_TARGET_LCD_V	: _ft_load_target(AscFonts.FT_Render_Mode.FT_RENDER_MODE_LCD_V)
	};

	AscFonts.LOAD_MODE_DEFAULT =
		AscFonts.FT_Load_Mode.FT_LOAD_DEFAULT 		|
        AscFonts.FT_Load_Mode.FT_LOAD_NO_HINTING 	|
        AscFonts.FT_Load_Mode.FT_LOAD_LINEAR_DESIGN |
        AscFonts.FT_Load_Mode.FT_LOAD_NO_AUTOHINT;

    AscFonts.LOAD_MODE_HINTING =
        AscFonts.FT_Load_Mode.FT_LOAD_DEFAULT 		|
        AscFonts.FT_Load_Mode.FT_LOAD_LINEAR_DESIGN |
        AscFonts.FT_Load_Mode.FT_LOAD_NO_AUTOHINT;

	AscFonts.isUseBitmapStrikes = function(symbol)
	{
		if (!AscFonts.mRanges)
		{
			AscFonts.mRanges = [];

			AscFonts.mRanges.push(0x1100); AscFonts.mRanges.push(0x11FF);

			AscFonts.mRanges.push(0x2E80); AscFonts.mRanges.push(0x9FFF);

			AscFonts.mRanges.push(0xAC00); AscFonts.mRanges.push(0xD7AF);

			AscFonts.mRanges.push(0xF900); AscFonts.mRanges.push(0xFAFF);
			AscFonts.mRanges.push(0xFF00); AscFonts.mRanges.push(0xFFEF);

			AscFonts.mRanges.push(0x20000); AscFonts.mRanges.push(0x2A6DF);
			AscFonts.mRanges.push(0x2F800);	AscFonts.mRanges.push(0x2FA1F);
		}

		if (symbol < AscFonts.mRanges[0])
			return false;

		var _m = AscFonts.mRanges;
		var _l = AscFonts.mRanges.length;

		for (var i = 0; i < _l; i += 2)
		{
			if (symbol >= _m[i] && symbol <= _m[i + 1])
				return true;
		}

		return false;
	};

    var raster_memory = AscFonts.raster_memory;
    AscFonts.initVariables = function()
	{
	};

	var FONT_ITALIC_ANGLE 	= 0.3090169943749;
	var FT_ENCODING_UNICODE = 1970170211;
	var FT_ENCODING_NONE 	= 0;
	var FT_ENCODING_MS_SYMBOL 	= 1937337698;
	var FT_ENCODING_APPLE_ROMAN = 1634889070;
	var REND_MODE 			= AscFonts.FT_Render_Mode.FT_RENDER_MODE_NORMAL;

	var EGlyphState =
	{
		glyphstateNormal : 0,	// символ отрисовался в нужном шрифте
		glyphstateDefault : 1, // символ отрисовался в дефолтовом шрифте
		glyphstateMiss : 2  	// символ не отрисовался
	};

	function get_raster_bounds(data, width, height, stride)
	{
		var ret = {dist_l: 0, dist_t: 0, dist_r: 0, dist_b: 0};

		// left
		var bIsBreak = false;
		for (var i = 0; i < width; i++)
		{
			var _ind = i * 4 + 3;
			for (var j = 0; j < height; j++, _ind += stride)
			{
				if (data[_ind] != 0)
				{
					bIsBreak = true;
					break;
				}
			}
			if (bIsBreak)
				break;

			ret.dist_l++;
		}

		// right
		bIsBreak = false;
		for (var i = width - 1; i >= 0; i--)
		{
			var _ind = i * 4 + 3;
			for (var j = 0; j < height; j++, _ind += stride)
			{
				if (data[_ind] != 0)
				{
					bIsBreak = true;
					break;
				}
			}
			if (bIsBreak)
				break;

			ret.dist_r++;
		}

		// top
		var bIsBreak = false;
		for (var j = 0; j < height; j++)
		{
			var _ind = j * stride + 3;
			for (var i = 0; i < width; i++, _ind += 4)
			{
				if (data[_ind] != 0)
				{
					bIsBreak = true;
					break;
				}
			}
			if (bIsBreak)
				break;

			ret.dist_t++;
		}

		// bottom
		var bIsBreak = false;
		for (var j = height - 1; j >= 0; j--)
		{
			var _ind = j * stride + 3;
			for (var i = 0; i < width; i++, _ind += 4)
			{
				if (data[_ind] != 0)
				{
					bIsBreak = true;
					break;
				}
			}
			if (bIsBreak)
				break;

			ret.dist_b++;
		}

		// clear
		if (null != raster_memory.m_oBuffer)
		{
			var nIndexDst = 3;
			var nPitch = 4 * (raster_memory.width - width);
			var dst = raster_memory.m_oBuffer.data;
			for (var j = 0; j < height; j++)
			{
				for (var i = 0; i < width; i++)
				{
					dst[nIndexDst] = 0;
					nIndexDst += 4;
				}
				nIndexDst += nPitch;
			}
		}

		return ret;
	}

	function CGlyphData()
	{
		this.m_oCanvas = null;
		this.m_oContext = null;
		this.R = 0;
		this.G = 0;
		this.B = 0;

		this.RasterData = null;

		this.TempImage = null;
	}

	CGlyphData.prototype =
	{
		// not used (old devices)
		checkColorAppleDevices : function(r, g, b, w, h)
		{
            if ((r == this.R) && (g == this.G) && (b == this.B))
                return;

            this.R = r;
            this.G = g;
            this.B = b;

            // full repaint
            this.TempImage = document.createElement("canvas");
            this.TempImage.width = w;
            this.TempImage.height = h;
            var ctxD = this.TempImage.getContext("2d");
            var pixDst = null;

            if (this.m_oCanvas != null)
            {
                pixDst = this.m_oContext.getImageData(0, 0, w, h);
                var dataPx = pixDst.data;

                var cur = 0;
                var cnt = w * h;
                for (var i = 0; i < cnt; i++)
                {
                    dataPx[cur++] = r;
                    dataPx[cur++] = g;
                    dataPx[cur++] = b;
                    cur++;
                }
            }
            else
            {
                var _raster = this.RasterData;
                var _x = _raster.Line.Height * _raster.Index;
                var _y = _raster.Line.Y;

                pixDst = _raster.Chunk.CanvasCtx.getImageData(_x, _y, w, h);
                var dataPx = pixDst.data;

                var cur = 0;
                var cnt = w * h;
                for (var i = 0; i < cnt; i++)
                {
                    dataPx[cur++] = r;
                    dataPx[cur++] = g;
                    dataPx[cur++] = b;
                    cur++;
                }
            }

            ctxD.putImageData(pixDst, 0, 0, 0, 0, w, h);
		},

		checkColorMozillaLinux : function(r, g, b, w, h)
		{
            if ((r == this.R) && (g == this.G) && (b == this.B))
                return;

            this.R = r;
            this.G = g;
            this.B = b;

            if (this.m_oCanvas != null)
            {
                this.m_oContext.fillStyle = (this.R == 0xFF && this.G == 0xFF && this.B == 0xFF) ? "rgb(255,255,254)" : "rgb(" + this.R + "," + this.G + "," + this.B + ")";
                this.m_oContext.fillRect(0, 0, w, h);
            }
            else
            {
                var _raster = this.RasterData;
                _raster.Chunk.CanvasCtx.fillStyle = (this.R == 0xFF && this.G == 0xFF && this.B == 0xFF) ? "rgb(255,255,254)" : "rgb(" + this.R + "," + this.G + "," + this.B + ")";
                var _x = _raster.Line.Height * _raster.Index;
                var _y = _raster.Line.Y;
                this.RasterData.Chunk.CanvasCtx.fillRect(_x, _y, w, h);
            }
		},

		checkColorNormal : function(r, g, b, w, h)
		{
            if ((r == this.R) && (g == this.G) && (b == this.B))
                return;

            this.R = r;
            this.G = g;
            this.B = b;

            if (this.m_oCanvas != null)
            {
                this.m_oContext.fillStyle = "rgb(" + this.R + "," + this.G + "," + this.B + ")";
                this.m_oContext.fillRect(0, 0, w, h);
            }
            else
            {
                var _raster = this.RasterData;
                _raster.Chunk.CanvasCtx.fillStyle = "rgb(" + this.R + "," + this.G + "," + this.B + ")";
                var _x = _raster.Line.Height * _raster.Index;
                var _y = _raster.Line.Y;
                this.RasterData.Chunk.CanvasCtx.fillRect(_x, _y, w, h);
            }
		},

		checkColor : undefined,

		init: function (width, height)
		{
			if (width == 0 || height == 0)
				return;

			this.m_oCanvas = document.createElement('canvas');

			this.m_oCanvas.width = (width == 0) ? 1 : width;
			this.m_oCanvas.height = (height == 0) ? 1 : height;

			this.m_oContext = this.m_oCanvas.getContext('2d');
			this.m_oContext.globalCompositeOperation = "source-in";
		}
	};

    CGlyphData.prototype.checkColor = (AscCommon.AscBrowser.isMozilla && AscCommon.AscBrowser.isLinuxOS) ? CGlyphData.prototype.checkColorMozillaLinux : CGlyphData.prototype.checkColorNormal;

	function CGlyphBitmap()
	{
		this.nX = 0;            // Сдвиг по X начальной точки для рисования символа
		this.nY = 0;            // Сдвиг по Y начальной точки для рисования символа
		this.nWidth = 0;        // Ширина символа
		this.nHeight = 0;       // Высота символа

		this.oGlyphData = new CGlyphData();
	}

	CGlyphBitmap.prototype =
	{
		fromAlphaMask: function (font_manager)
		{
			var bIsCanvas = false;
			var _chunk_size = (font_manager.RasterMemory == null) ? 0 : font_manager.RasterMemory.ChunkHeapSize;
			if (Math.max(this.nWidth, this.nHeight) > (_chunk_size / 10))
				bIsCanvas = true;

			var _x = 0;
			var _y = 0;
			var ctx = null;

			if (bIsCanvas)
			{
				this.oGlyphData.init(this.nWidth, this.nHeight);
				ctx = this.oGlyphData.m_oContext;
			}
			else
			{
				this.oGlyphData.RasterData = font_manager.RasterMemory.Alloc(this.nWidth, this.nHeight);
				ctx = this.oGlyphData.RasterData.Chunk.CanvasCtx;
				_x = this.oGlyphData.RasterData.Line.Height * this.oGlyphData.RasterData.Index;
				_y = this.oGlyphData.RasterData.Line.Y;
			}

			if (true)
			{
                if (this.nWidth > 0 && this.nHeight > 0)
                	ctx.putImageData(raster_memory.m_oBuffer, _x, _y, 0, 0, this.nWidth, this.nHeight);
			}
			else
			{
				var gamma = 1.1;

				var nIndexDst = 3;
				var nPitch = 4 * (raster_memory.width - this.nWidth);
				var dst = raster_memory.m_oBuffer.data;
				for (var j = 0; j < this.nHeight; j++)
				{
					for (var i = 0; i < this.nWidth; i++)
					{
						dst[nIndexDst] = Math.min((dst[nIndexDst] * gamma) >> 0, 255);
						nIndexDst += 4;
					}
					nIndexDst += nPitch;
				}

				if (this.nWidth > 0 && this.nHeight > 0)
					ctx.putImageData(raster_memory.m_oBuffer, _x, _y, 0, 0, this.nWidth, this.nHeight);
			}

			if (null != raster_memory.m_oBuffer)
			{
				var nIndexDst = 3;
				var nPitch = 4 * (raster_memory.width - this.nWidth);
				var dst = raster_memory.m_oBuffer.data;
				for (var j = 0; j < this.nHeight; j++)
				{
					for (var i = 0; i < this.nWidth; i++)
					{
						dst[nIndexDst] = 0;
						nIndexDst += 4;
					}
					nIndexDst += nPitch;
				}
			}
		},

		draw: function (context2D, x, y)
		{
			var nW = this.nWidth;
			var nH = this.nHeight;
			if (null != this.oGlyphData.TempImage)
			{
				context2D.drawImage(this.oGlyphData.TempImage, 0, 0, nW, nH, x, y, nW, nH);
				this.oGlyphData.TempImage = null;
			}
			else if (null != this.oGlyphData.m_oCanvas)
			{
				// своя память
				context2D.drawImage(this.oGlyphData.m_oCanvas, 0, 0, nW, nH, x, y, nW, nH);
			}
			else
			{
				var _raster = this.oGlyphData.RasterData;
				var _x = _raster.Line.Height * _raster.Index;
				var _y = _raster.Line.Y;
				context2D.drawImage(_raster.Chunk.CanvasImage, _x, _y, nW, nH, x, y, nW, nH);
			}
		},

		drawCrop: function (context2D, x, y, w, h, cx)
		{
			if (null != this.oGlyphData.TempImage)
			{
				context2D.drawImage(this.oGlyphData.TempImage, cx, 0, w, h, x, y, w, h);
				this.oGlyphData.TempImage = null;
			}
			else if (null != this.oGlyphData.m_oCanvas)
			{
				// своя память
				context2D.drawImage(this.oGlyphData.m_oCanvas, cx, 0, w, h, x, y, w, h);
			}
			else
			{
				var _raster = this.oGlyphData.RasterData;
				var _x = _raster.Line.Height * _raster.Index;
				var _y = _raster.Line.Y;
				context2D.drawImage(_raster.Chunk.CanvasImage, _x + cx, _y, w, h, x, y, w, h);
			}
		},

		drawCropInRect: function (context2D, x, y, clipRect)
		{
			var _x = x;
			var _y = y;
			var _r = x + this.nWidth;
			var _b = y + this.nHeight;

			var _dstX = 0;
			var _dstY = 0;
			var _dstW = this.nWidth;
			var _dstH = this.nHeight;

			if (_x < clipRect.l)
			{
				_dstX = clipRect.l - _x;
				_x += _dstX;
				_dstW -= _dstX;
			}
			if (_y < clipRect.t)
			{
				_dstY = clipRect.t - _y;
				_y += _dstY;
				_dstH -= _dstY;
			}
			if (_r > clipRect.r)
			{
				_dstW -= (_r - clipRect.r);
			}
			if (_b > clipRect.b)
			{
				_dstH -= (_b - clipRect.b);
			}

			if (_dstW <= 0 || _dstH <= 0)
				return;

			if (null != this.oGlyphData.TempImage)
			{
				context2D.drawImage(this.oGlyphData.TempImage, _dstX, _dstY, _dstW, _dstH, _x, _y, _dstW, _dstH);
				this.oGlyphData.TempImage = null;
			}
			else if (null != this.oGlyphData.m_oCanvas)
			{
				// своя память
				context2D.drawImage(this.oGlyphData.m_oCanvas, _dstX, _dstY, _dstW, _dstH, _x, _y, _dstW, _dstH);
			}
			else
			{
				var _raster = this.oGlyphData.RasterData;
				var __x = _raster.Line.Height * _raster.Index;
				var __y = _raster.Line.Y;
				context2D.drawImage(_raster.Chunk.CanvasImage, __x + _dstX, __y + _dstY, _dstW, _dstH, _x, _y, _dstW, _dstH);
			}
		},

		Free: function ()
		{
			if (null != this.oGlyphData.RasterData)
			{
				this.oGlyphData.RasterData.Chunk.Free(this.oGlyphData.RasterData);
			}
		}
	};

	function CBBox()
	{
		this.fMinX = 0;
		this.fMaxX = 0;
		this.fMinY = 0;
		this.fMaxY = 0;

		this.rasterDistances = null;
	}

	function CMetrics()
	{
		this.fWidth = 0;
		this.fHeight = 0;

		this.fHoriBearingX = 0;
		this.fHoriBearingY = 0;
		this.fHoriAdvance = 0;

		this.fVertBearingX = 0;
		this.fVertBearingY = 0;
		this.fVertAdvance = 0;
	}

	function CFontCacheSizes()
	{
		this.ushUnicode; // Значение символа в юникоде
		this.eState;     // Есть ли символ в шрифте/стандартном шрифте
		this.nCMapIndex; // Номер таблицы 'cmap', в которой был найден данный символ

		this.ushGID;

		this.fAdvanceX;

		this.oBBox = new CBBox();
		this.oMetrics = new CMetrics();

		this.bBitmap = false;
		this.oBitmap = null;
	}

	function CCMapIndex()
	{
		this.index = 0;
	}

	function CGlyphVectorPainter()
	{
		// сдвиг
		this.X = 0;
		this.Y = 0;

		// scale
		this.KoefX = 25.4 / 72;
		this.KoefY = 25.4 / 72;

		this.NeedClosed = false;

		this.shift = 0;
		this.delta = 0;

		this.CurX = 0;
		this.CurY = 0;
	}

	CGlyphVectorPainter.prototype =
	{
		start: function ()
		{

		},

        _move_to: function(x, y, worker)
        {
            if (this.NeedClosed)
            {
                worker._z();
                this.NeedClosed = false;
            }

            this.CurX = this.X + this.KoefX * (x / 64.0);
            this.CurY = this.Y - this.KoefY * (y / 64.0);

            worker._m(this.CurX, this.CurY);

            return 0;
        },

		move_to: function (to, worker)
		{
			return this._move_to(to.x, to.y, worker);
		},

		_line_to: function (x, y, worker)
		{
			this.CurX = this.X + this.KoefX * (x / 64.0);
			this.CurY = this.Y - this.KoefY * (y / 64.0);

			worker._l(this.CurX, this.CurY);

			this.NeedClosed = true;
			return 0;
		},

        line_to: function (to, worker)
        {
            return this._line_to(to.x, to.y, worker);
        },

		_conic_to: function (control_x, control_y, to_x, to_y, worker)
		{
			var dX0 = this.CurX;
			var dY0 = this.CurY;

			var dXc = this.X + this.KoefX * (control_x / 64.0);
			var dYc = this.Y - this.KoefY * (control_y / 64.0);
			var dX3 = this.X + this.KoefX * (to_x / 64.0);
			var dY3 = this.Y - this.KoefY * (to_y / 64.0);

			// Строим кривую Безье второго порядка, с помощью кривой Безье третего порядка. Если p0, pC, p3 -
			// начальная, контрольная и конечная точки, соответственно, для кривой Безье второго порядка. Тогда
			// для этой же кривой, рассматриваемой как кривая Безье третьего порядка, точки p0, p1, p2, p3 будут
			// начальной, две контрольные, конечная точки. Где p1 и p2 рассчитываются по следующим формулам:
			//     p1 = (1/3) * (p0 + 2pС)
			//     p2 = (1/3) * (2pС + p3)

			var dX1 = (1.0 / 3.0) * (dX0 + 2 * dXc);
			var dY1 = (1.0 / 3.0) * (dY0 + 2 * dYc);
			var dX2 = (1.0 / 3.0) * (2 * dXc + dX3);
			var dY2 = (1.0 / 3.0) * (2 * dYc + dY3);

			worker._c(dX1, dY1, dX2, dY2, dX3, dY3);

			this.CurX = dX3;
			this.CurY = dY3;

			this.NeedClosed = true;
			return 0;
		},

        conic_to: function (control, to, worker)
        {
            return this._conic_to(control.x, control.y, to.x, to.y, worker);
        },

		_cubic_to: function (control1_x, control1_y, control2_x, control2_y, to_x, to_y, worker)
		{
			this.CurX = this.X + this.KoefX * (to_x / 64.0);
			this.CurY = this.Y - this.KoefY * (to_y / 64.0);

			worker._c(
				this.X + this.KoefX * (control1_x / 64.0),
				this.Y - this.KoefY * (control1_y / 64.0),
				this.X + this.KoefX * (control2_x / 64.0),
				this.Y - this.KoefY * (control2_y / 64.0),
				this.CurX,
				this.CurY);

			this.NeedClosed = true;
			return 0;
		},

        cubic_to: function (control1, control2, to, worker)
        {
            return this._cubic_to(control1.x, control1.y, control2.x, control2.y, to.x, to.y, worker);
        },

		end: function (worker)
		{
			if (this.NeedClosed)
			{
				worker._z();
				this.NeedClosed = false;
			}
		}
	};

	function CFontFile()
	{
		this.m_arrdFontMatrix = ("undefined" == typeof Float64Array) ? new Array(6) : new Float64Array(6);
		this.m_arrdTextMatrix = ("undefined" == typeof Float64Array) ? new Array(6) : new Float64Array(6);

		this.m_bAntiAliasing = true;
		this.m_bUseKerning = false;

		this.m_fSize = 1.0;       // Размер шрифта
		this.m_unHorDpi = 0;      // Горизонтальное разрешение
		this.m_unVerDpi = 0;      // Вертикальное разрешение

		this.m_bNeedDoItalic = false;
		this.m_bNeedDoBold = false;

		this.m_fCharSpacing = 0.0;

		this.m_oBox = new AscFonts.CGlyphBounds(); // Glyph box

		this.m_nError = 0;
		this.m_pFace = null;
		this.m_pFaceInfo = null;

		this.m_dUnitsKoef = 1.0;
		this.m_nDefaultChar = -1;
		this.m_nSymbolic = -1;
		this.m_dTextScale = 0;

		this.m_bStringGID = false;

        this.m_nNum_charmaps = 0;

		this.m_lAscender = 0;
		this.m_lDescender = 0;
		this.m_lLineHeight = 0;
		this.m_lUnits_Per_Em = 0;

		this.m_arrCacheSizes = [];
		this.m_arrCacheSizesGid = [];

		this.m_oFontManager = null;
		this.HintsSupport = true;
		this.HintsSubpixelSupport = true;

        this.m_bIsTransform = true; // !IsIdentity matrix transform

        this.fixed_sizes = undefined;

		this.Picker = new CFontLoaderBySymbol();

		this.FT_Load_Glyph_Wrapper = function(pFace, unGID, _LOAD_MODE)
		{
			var err = AscFonts.FT_Load_Glyph(pFace, unGID, _LOAD_MODE);
			if (0 != err && this.HintsSupport)
			{
				var err2 = AscFonts.FT_Load_Glyph(pFace, unGID, AscFonts.LOAD_MODE_DEFAULT);
				if (err2 != 0)
					return err;
				this.HintsSupport = false;
				return err2;
			}
			return err;
		};

		this.ResetFontMatrix = function()
		{
			var m = this.m_arrdFontMatrix;
			if (this.m_bNeedDoItalic)
			{
				m[0] = 1;
				m[1] = 0;
				m[2] = FONT_ITALIC_ANGLE;
				m[3] = 1;
				m[4] = 0;
				m[5] = 0;
			}
			else
			{
				m[0] = 1;
				m[1] = 0;
				m[2] = 0;
				m[3] = 1;
				m[4] = 0;
				m[5] = 0;
			}

			this.UpdateMatrix();
		};

		this.ResetTextMatrix = function()
		{
			var m = this.m_arrdTextMatrix;
			m[0] = 1;
			m[1] = 0;
			m[2] = 0;
			m[3] = 1;
			m[4] = 0;
			m[5] = 0;

			this.CheckTextMatrix();
		};

		this.CheckTextMatrix = function()
		{
			this.m_bIsTransform = true;
			var m = this.m_arrdTextMatrix;
			if ((m[0] == 1) && (m[1] == 0) && (m[2] == 0) && (m[3] == 1))
			{
				this.m_bIsTransform = false;
				this.UpdateMatrix();
			}
		};

		this.UpdateMatrix = function()
		{
			var m = this.m_arrdFontMatrix;
			var t = this.m_arrdTextMatrix;

			var xx = ((m[0] * t[0] + m[1] * t[2]) * 65536) >> 0;
			var yx = ((m[0] * t[1] + m[1] * t[3]) * 65536) >> 0;
			var xy = ((m[2] * t[0] + m[3] * t[2]) * 65536) >> 0;
			var yy = ((m[2] * t[1] + m[3] * t[3]) * 65536) >> 0;

			AscFonts.FT_Set_Transform(this.m_pFace, xx, yx, xy, yy);
		};

		this.SetSizeAndDpi = function (dSize, unHorDpi, unVerDpi)
		{
			var dpiX = (unHorDpi + 0.5) >> 0;
			var dpiY = (unVerDpi + 0.5) >> 0;

			var dOldSize = this.m_fSize;
			var dNewSize = dSize;
			var dKoef = dNewSize / dOldSize;
			var isResize = (dKoef > 1.001 || dKoef < 0.999) ? true : false;

			if (isResize || dpiX != this.m_unHorDpi || dpiY != this.m_unVerDpi)
			{
				this.m_unHorDpi = dpiX;
				this.m_unVerDpi = dpiY;

				if (isResize)
				{
					this.m_fSize = dNewSize;
					this.UpdateMatrix();
				}

				this.m_dUnitsKoef = this.m_unHorDpi / 72.0 * this.m_fSize;

				// Выставляем размер шрифта (dSize) и DPI
				this.m_nError = AscFonts.FT_Set_Char_Size(this.m_pFace, 0, (dNewSize * 64) >> 0, dpiX, dpiY);
				this.ClearCache();
			}
		};

		this.ClearCache = function()
		{
			this.Destroy();
			this.ClearCacheNoAttack();

			if (this.Picker)
				this.Picker.ClearCache();
		};

		this.ClearCacheNoAttack = function()
		{
			this.m_arrCacheSizes = [];
			this.m_arrCacheSizesGid = [];

			if (this.Picker)
				this.Picker.ClearCacheNoAttack();
		};

		this.Destroy = function()
		{
			if (this.m_oFontManager != null && this.m_oFontManager.RasterMemory != null)
			{
				var _arr = this.m_arrCacheSizes;
				for (var i in _arr)
				{
					if (_arr[i].oBitmap != null)
						_arr[i].oBitmap.Free();
				}
				_arr = this.m_arrCacheSizesGid;
				for (var i in _arr)
				{
					if (_arr[i].oBitmap != null)
						_arr[i].oBitmap.Free();
				}
			}
		};

		this.SetTextMatrix = function(fA, fB, fC, fD, fE, fF)
		{
			var m = this.m_arrdTextMatrix;

			var b1 = (m[0] == fA && m[1] == -fB && m[2] == -fC && m[3] == fD);
			if (b1 && m[4] == fE && m[5] == fF)
				return false;

			m[0] = fA;
			m[1] = -fB;
			m[2] = -fC;
			m[3] = fD;
			m[4] = fE;
			m[5] = fF;

			if (!b1)
			{
				this.ClearCache();
			}
			this.CheckTextMatrix();
			return true;
		};

		this.SetFontMatrix = function(fA, fB, fC, fD, fE, fF)
		{
			var m = this.m_arrdFontMatrix;
			if (this.m_bNeedDoItalic)
			{
				m[0] = fA;
				m[1] = fB;
				m[2] = fC + fA * FONT_ITALIC_ANGLE;
				m[3] = fD + fB * FONT_ITALIC_ANGLE;
				m[4] = fE;
				m[5] = fF;
			}
			else
			{
				m[0] = fA;
				m[1] = fB;
				m[2] = fC;
				m[3] = fD;
				m[4] = fE;
				m[5] = fF;
			}

			this.ClearCache();
		};

		this.GetGIDByUnicode = function(glyph)
		{
            var unGID = AscFonts.FT_SetCMapForCharCode(this.m_pFace, glyph);
            if (unGID > 0)
            	return unGID;

            if (-1 != this.m_nSymbolic && glyph < 0xF000)
                unGID = AscFonts.FT_SetCMapForCharCode(this.m_pFace, glyph + 0xF000);

            return unGID;
		};

		this.CacheGlyph = function(glyph_index_or_unicode, isRaster, isRasterDistances, workerVector, workerVectorX, workerVectorY, isFromPicker)
		{
            var oSizes = new CFontCacheSizes();
            oSizes.ushUnicode = glyph_index_or_unicode;

            var nUnicodeForHintTest = this.m_bStringGID ? 0 : glyph_index_or_unicode;

            var unGID = this.m_bStringGID ? glyph_index_or_unicode : AscFonts.FT_SetCMapForCharCode(this.m_pFace, glyph_index_or_unicode);

            if (unGID <= 0 && !this.m_bStringGID)
			{
				if (-1 != this.m_nSymbolic && glyph_index_or_unicode < 0xF000)
					unGID = AscFonts.FT_SetCMapForCharCode(this.m_pFace, glyph_index_or_unicode + 0xF000);
			}

			if (unGID <= 0)
			{
                if (isFromPicker === true)
                	return null;

				if (!this.m_bStringGID && this.Picker)
				{
					// пробуем подобрать нужный шрифт
					var oSizesCheck = this.Picker.LoadSymbol(this, glyph_index_or_unicode, isRaster, isRasterDistances, workerVector, workerVectorX, workerVectorY);
					if (oSizesCheck)
						return oSizesCheck;
				}

				if (this.m_nDefaultChar >= 0)
				{
					unGID = this.m_nDefaultChar;
					oSizes.eState = EGlyphState.glyphstateDefault;
				}
				else
				{
					oSizes.eState = EGlyphState.glyphstateMiss;
                    oSizes.ushGID = -1;
                    oSizes.fAdvanceX = (AscFonts.FT_GetFaceMaxAdvanceX(this.m_pFace) >> 6) / 2.0;
                    return oSizes;
				}
			}
			else
			{
				oSizes.eState = EGlyphState.glyphstateNormal;
			}

            oSizes.ushGID = unGID;
            oSizes.nCMapIndex = 0; // TODO:???

            //var measure_time_start = performance.now();

			var load_mode = this.GetCharLoadMode(nUnicodeForHintTest);

			if (this.m_bStringGID || !isRaster || this.m_bNeedDoBold)
				load_mode |= AscFonts.FT_Load_Mode.FT_LOAD_NO_BITMAP;
			else if (!AscFonts.isUseBitmapStrikes(glyph_index_or_unicode))
				load_mode |= AscFonts.FT_Load_Mode.FT_LOAD_NO_BITMAP;
			else
			{
				if (Math.abs(this.m_arrdTextMatrix[1]) > 0.001 || Math.abs(this.m_arrdTextMatrix[2]) > 0.001)
					load_mode |= AscFonts.FT_Load_Mode.FT_LOAD_NO_BITMAP;
			}

            if (this.FT_Load_Glyph_Wrapper(this.m_pFace, unGID, load_mode))
                return oSizes;

            var _painter = null;
            if (undefined !== workerVector)
            {
                _painter = new CGlyphVectorPainter();
                _painter.KoefX = 25.4 / this.m_unHorDpi;
                _painter.KoefY = 25.4 / this.m_unVerDpi;

                if (workerVectorX !== undefined)
                    _painter.X = workerVectorX;
                if (workerVectorY !== undefined)
                    _painter.Y = workerVectorY;
            }

            var measureInfo = AscFonts.FT_Glyph_Get_Measure(this.m_pFace, workerVector, _painter);
            if ((null == measureInfo) || (undefined !== workerVector))
                return oSizes;

            //window.measureTime += (performance.now() - measure_time_start);

            var isDisableNeedBold = ((this.m_pFaceInfo.os2_version != 0xFFFF) && (this.m_pFaceInfo.os2_usWeightClass >= 800)) ? true : false;
            oSizes.fAdvanceX = (measureInfo.linearHoriAdvance * this.m_dUnitsKoef / this.m_lUnits_Per_Em);
            if (this.m_bNeedDoBold && this.m_oFontManager.IsAdvanceNeedBoldFonts && !isDisableNeedBold)
				oSizes.fAdvanceX += 1;

            oSizes.oBBox.fMinX = (measureInfo.bbox_xMin >> 6);
            oSizes.oBBox.fMaxX = (measureInfo.bbox_xMax >> 6);
            oSizes.oBBox.fMinY = (measureInfo.bbox_yMin >> 6);
            oSizes.oBBox.fMaxY = (measureInfo.bbox_yMax >> 6);

            var dstM = oSizes.oMetrics;

            dstM.fWidth 		= (measureInfo.width >> 6);
            dstM.fHeight 		= (measureInfo.height >> 6);
            dstM.fHoriBearingX 	= (measureInfo.horiBearingX >> 6);
            dstM.fHoriBearingY 	= (measureInfo.horiBearingY >> 6);
            dstM.fHoriAdvance 	= (measureInfo.horiAdvance >> 6);
            dstM.fVertBearingX 	= (measureInfo.vertBearingX >> 6);
            dstM.fVertBearingY 	= (measureInfo.vertBearingY >> 6);
            dstM.fVertAdvance 	= (measureInfo.vertAdvance >> 6);

            if (isFromPicker && (0 == dstM.fHoriAdvance && 0 == measureInfo.width))
			{
				if (this.m_bStringGID)
					return null;

				switch (glyph_index_or_unicode)
				{
					// список допустимых символов нулевой ширины
					case 0xFEFF:
					{
						return oSizes;
					}
					default:
						break;
				}
				return null;
			}

            if (!isRaster)
            {
            	if (isRasterDistances)
				{
                    var rasterInfo = AscFonts.FT_Glyph_Get_Raster(this.m_pFace, REND_MODE);
                    if (rasterInfo)
                    {
                    	var rasterBitmap = AscFonts.FT_Get_Glyph_Render_Buffer(this.m_pFace, rasterInfo, false);
                    	oSizes.oBBox.rasterDistances = get_raster_bounds(rasterBitmap.data, rasterBitmap.width, rasterBitmap.rows, rasterBitmap.pitch);
                    }
				}
                return oSizes;
            }

            //measure_time_start = performance.now();

            oSizes.bBitmap = true;
            var rasterInfo = AscFonts.FT_Glyph_Get_Raster(this.m_pFace, REND_MODE);
            if (!rasterInfo || rasterInfo.pitch == 0)
            	return oSizes;

            //window.rasterTime += (performance.now() - measure_time_start);

			oSizes.oBitmap = new CGlyphBitmap();
			oSizes.oBitmap.nX = rasterInfo.left;
			oSizes.oBitmap.nY = rasterInfo.top;
			oSizes.oBitmap.nWidth = rasterInfo.width;
			oSizes.oBitmap.nHeight = rasterInfo.rows;

            var rasterBitmap = AscFonts.FT_Get_Glyph_Render_Buffer(this.m_pFace, rasterInfo, true);

			if (this.m_bNeedDoBold && this.m_bAntiAliasing && !isDisableNeedBold)
			{
                oSizes.oBitmap.nWidth++;

				var _width_im = oSizes.oBitmap.nWidth;
				var _height = oSizes.oBitmap.nHeight;

				var nY, nX;
				var pDstBuffer;

				var _input = raster_memory.m_oBuffer.data;
				for (nY = 0, pDstBuffer = 0; nY < _height; ++nY, pDstBuffer += (raster_memory.pitch))
				{
					for (nX = _width_im - 1; nX >= 0; --nX)
					{
						if (0 != nX) // иначе ничего не делаем
						{
							var _pos_x = pDstBuffer + nX * 4 + 3;

							if (_width_im - 1 == nX)
							{
								// последний - просто копируем
								_input[_pos_x] = _input[_pos_x - 4];
							}
							else
							{
								// сдвигаем все вправо
								_input[_pos_x] = Math.min(255, _input[_pos_x - 4] + _input[_pos_x]);
							}
						}
					}
				}
			}

			oSizes.oBitmap.fromAlphaMask(this.m_oFontManager);
			return oSizes;
		};

		this.GetString = function(pString)
		{
			if (pString.GetLength() <= 0)
				return true;

			var unPrevGID = 0;
			var fPenX = 0, fPenY = 0;

			// Сначала мы все рассчитываем исходя только из матрицы шрифта FontMatrix
			if (this.m_bIsTransform)
                this.UpdateMatrix();

			var _cache_array = (this.m_bStringGID === false) ? this.m_arrCacheSizes : this.m_arrCacheSizesGid;

			for (var nIndex = 0; nIndex < pString.GetLength(); ++nIndex)
			{
				var pCurGlyph = pString.GetAt(nIndex);
				var ushUnicode = pCurGlyph.lUnicode;

				var charSymbolObj = _cache_array[ushUnicode];
				if (undefined == charSymbolObj)
				{
					_cache_array[ushUnicode] = this.CacheGlyph(ushUnicode, false);
                    charSymbolObj = _cache_array[ushUnicode];
                }

				var unGID = charSymbolObj.ushGID;
				var eState = charSymbolObj.eState;

				if (EGlyphState.glyphstateMiss == eState)
				{
					pString.SetStartPoint(nIndex, fPenX, fPenY);
					pString.SetBBox(nIndex, 0, 0, 0, 0);
					pString.SetState(nIndex, EGlyphState.glyphstateMiss);

					fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
					unPrevGID = 0;

					continue;
				}
				else if (EGlyphState.glyphstateDefault == eState)
				{
					pString.SetState(nIndex, EGlyphState.glyphstateDefault);
					// kerning face!!!
				}
				else // if ( glyphstateNormal == eState )
				{
					pString.SetState(nIndex, EGlyphState.glyphstateNormal);
                    // kerning face!!!
				}

				/*
				if (0 != this.m_nNum_charmaps)
				{
					var nCharmap = pFace.charmap;
					var nCurCMapIndex = AscFonts.FT_Get_Charmap_Index(nCharmap);
					if (nCurCMapIndex != _cmap_index)
					{
						_cmap_index = Math.max(0, _cmap_index);
						nCharmap = pFace.charmaps[_cmap_index];
						AscFonts.FT_Set_Charmap(pFace, nCharmap);
					}
				}
				*/

				if (this.m_bUseKerning && unPrevGID && (nIndex > 0 && pString.GetAt(nIndex).eState == pString.GetAt(nIndex - 1).eState))
				{
					fPenX += this.GetKerning(unPrevGID, unGID);
				}

				var fX = pString.m_fX + fPenX;
				var fY = pString.m_fY + fPenY;

				// Начальную точку рассчитываем сразу исходя из глобальной матрицы
				var fXX = (pString.m_arrCTM[4] + fX * pString.m_arrCTM[0] + fY * pString.m_arrCTM[2] - pString.m_fX);
				var fYY = (pString.m_arrCTM[5] + fX * pString.m_arrCTM[1] + fY * pString.m_arrCTM[3] - pString.m_fY);

				pString.SetStartPoint(nIndex, fXX, fYY);

				var _metrics = charSymbolObj.oMetrics;
				pString.SetMetrics(nIndex, _metrics.fWidth, _metrics.fHeight, _metrics.fHoriAdvance, _metrics.fHoriBearingX, _metrics.fHoriBearingY, _metrics.fVertAdvance, _metrics.fVertBearingX, _metrics.fVertBearingY);
				pString.SetBBox(nIndex, charSymbolObj.oBBox.fMinX, charSymbolObj.oBBox.fMaxY, charSymbolObj.oBBox.fMaxX, charSymbolObj.oBBox.fMinY);
				fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;

				unPrevGID = unGID;
			}

			pString.m_fEndX = fPenX + pString.m_fX;
			pString.m_fEndY = fPenY + pString.m_fY;
		};

		this.GetString2 = function(pString)
		{
			if (pString.GetLength() <= 0)
				return true;

            if (this.m_bIsTransform)
                this.UpdateMatrix();

			var unPrevGID = 0;
			var fPenX = 0, fPenY = 0;

			var _cache_array = (this.m_bStringGID === false) ? this.m_arrCacheSizes : this.m_arrCacheSizesGid;

			for (var nIndex = 0; nIndex < pString.GetLength(); ++nIndex)
			{
				var pCurGlyph = pString.GetAt(nIndex);
				var ushUnicode = pCurGlyph.lUnicode;

				var charSymbolObj = _cache_array[ushUnicode];
                if (undefined == charSymbolObj || null == charSymbolObj.oBitmap)
                {
                    _cache_array[ushUnicode] = this.CacheGlyph(ushUnicode, true);
                    charSymbolObj = _cache_array[ushUnicode];
                }

				var nCMapIndex = charSymbolObj.nCMapIndex;
				var unGID = charSymbolObj.ushGID;
				var eState = charSymbolObj.eState;

				if (EGlyphState.glyphstateMiss == eState)
				{
					pString.SetStartPoint(nIndex, fPenX, fPenY);
					pString.SetBBox(nIndex, 0, 0, 0, 0);
					pString.SetState(nIndex, EGlyphState.glyphstateMiss);

					fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
					unPrevGID = 0;

					continue;
				}
				else if (EGlyphState.glyphstateDefault == eState)
				{
					pString.SetState(nIndex, EGlyphState.glyphstateDefault);
                    // kerning face!!!
				}
				else
				{
					pString.SetState(nIndex, EGlyphState.glyphstateNormal);
                    // kerning face!!!
				}

				/*
				if (0 != this.m_nNum_charmaps)
				{
					var nCharmap = pFace.charmap;
					var nCurCMapIndex = AscFonts.FT_Get_Charmap_Index(nCharmap);
					if (nCurCMapIndex != nCMapIndex)
					{
						nCMapIndex = Math.max(0, nCMapIndex);
						nCharmap = this.m_pFace.charmaps[nCMapIndex];
						AscFonts.FT_Set_Charmap(this.m_pFace, nCharmap);
					}
				}
				*/

				if (this.m_bUseKerning && unPrevGID && (nIndex > 0 && pString.GetAt(nIndex).eState == pString.GetAt(nIndex - 1).eState))
				{
					fPenX += this.GetKerning(unPrevGID, unGID);
				}

				var fX = pString.m_fX + fPenX;
				var fY = pString.m_fY + fPenY;

				// Начальную точку рассчитываем сразу исходя из глобальной матрицы
				var fXX = (pString.m_arrCTM[4] + fX * pString.m_arrCTM[0] + fY * pString.m_arrCTM[2] - pString.m_fX);
				var fYY = (pString.m_arrCTM[5] + fX * pString.m_arrCTM[1] + fY * pString.m_arrCTM[3] - pString.m_fY);

				pString.SetStartPoint(nIndex, fXX, fYY);

                pCurGlyph.oMetrics = charSymbolObj.oMetrics;
				pString.SetBBox(nIndex, charSymbolObj.oBBox.fMinX, charSymbolObj.oBBox.fMaxY, charSymbolObj.oBBox.fMaxX, charSymbolObj.oBBox.fMinY);
				fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;

				pCurGlyph.bBitmap = charSymbolObj.bBitmap;
				pCurGlyph.oBitmap = charSymbolObj.oBitmap;

				unPrevGID = unGID;
			}

			pString.m_fEndX = fPenX + pString.m_fX;
			pString.m_fEndY = fPenY + pString.m_fY;
		};

		this.GetString2C = function(pString)
		{
			// Сначала мы все рассчитываем исходя только из матрицы шрифта FontMatrix
            if (this.m_bIsTransform)
                this.UpdateMatrix();

			var pCurGlyph = pString.m_pGlyphsBuffer[0];
			var ushUnicode = pCurGlyph.lUnicode;

			var _cache_array = (this.m_bStringGID === false) ? this.m_arrCacheSizes : this.m_arrCacheSizesGid;

            var charSymbolObj = _cache_array[ushUnicode];
            if (undefined == charSymbolObj || (null == charSymbolObj.oBitmap && charSymbolObj.bBitmap === false))
            {
                _cache_array[ushUnicode] = this.CacheGlyph(ushUnicode, true);
                charSymbolObj = _cache_array[ushUnicode];
            }

            if (!charSymbolObj)
            	return;

			var eState = charSymbolObj.eState;
			pCurGlyph.eState = charSymbolObj.eState;
			if (EGlyphState.glyphstateMiss == eState)
			{
				pCurGlyph.fX = 0;
				pCurGlyph.fY = 0;

				pCurGlyph.fLeft = 0;
				pCurGlyph.fTop = 0;
				pCurGlyph.fRight = 0;
				pCurGlyph.fBottom = 0;
				return;
			}

			// кернинга нету пока.
            var fX = pString.m_fX;
            var fY = pString.m_fY;
            var _m = pString.m_arrCTM;

            // Начальную точку рассчитываем сразу исходя из глобальной матрицы
            pCurGlyph.fX = (_m[4] + fX * _m[0] + fY * _m[2] - pString.m_fX);
            pCurGlyph.fY = (_m[5] + fX * _m[1] + fY * _m[3] - pString.m_fY);

			//pString.SetMetrics(nIndex, charSymbolObj.oMetrics.fWidth, charSymbolObj.oMetrics.fHeight, charSymbolObj.oMetrics.fHoriAdvance, charSymbolObj.oMetrics.fHoriBearingX, charSymbolObj.oMetrics.fHoriBearingY, charSymbolObj.oMetrics.fVertAdvance, charSymbolObj.oMetrics.fVertBearingX, charSymbolObj.oMetrics.fVertBearingY);
			pCurGlyph.oMetrics = charSymbolObj.oMetrics;

			/*
			pCurGlyph.fLeft   = charSymbolObj.oBBox.fMinX;
			pCurGlyph.fTop    = charSymbolObj.oBBox.fMaxY;
			pCurGlyph.fRight  = charSymbolObj.oBBox.fMaxX;
			pCurGlyph.fBottom = charSymbolObj.oBBox.fMinY;
			*/

			pCurGlyph.bBitmap = charSymbolObj.bBitmap;
			pCurGlyph.oBitmap = charSymbolObj.oBitmap;

            pString.m_fEndX = charSymbolObj.fAdvanceX + this.m_fCharSpacing + pString.m_fX;
            pString.m_fEndY = pString.m_fY;
		};

		this.GetChar = function(lUnicode, is_raster_distances)
		{
			var Result = undefined;
			var ushUnicode = lUnicode;

			// Сначала мы все рассчитываем исходя только из матрицы шрифта FontMatrix
            if (this.m_bIsTransform)
                this.UpdateMatrix();

			var _cache_array = (this.m_bStringGID === false) ? this.m_arrCacheSizes : this.m_arrCacheSizesGid;

            var charSymbolObj = _cache_array[ushUnicode];
            if (undefined == charSymbolObj)
            {
                _cache_array[ushUnicode] = this.CacheGlyph(ushUnicode, false, is_raster_distances);
                charSymbolObj = _cache_array[ushUnicode];
            }

            return charSymbolObj;
		};

		this.GetCharPath = function(lUnicode, worker, x, y)
		{
			var pFace = this.m_pFace;
			var pCurentGliph = pFace.glyph;

			var Result;
			var ushUnicode = lUnicode;

			// Сначала мы все рассчитываем исходя только из матрицы шрифта FontMatrix
            if (this.m_bIsTransform)
                this.UpdateMatrix();

            // no really cashe
            this.CacheGlyph(ushUnicode, false, false, worker, x, y);
		};

        this.GetStringPath = function(string, worker)
        {
            var _len = string.GetLength();
            if (_len <= 0)
                return true;

            for (var nIndex = 0; nIndex < _len; ++nIndex)
            {
                var _glyph = string.m_pGlyphsBuffer[nIndex];
                var _x = string.m_fX + 25.4 * _glyph.fX / this.m_unHorDpi;
                var _y = string.m_fY + 25.4 * _glyph.fY / this.m_unVerDpi;

                worker._s();
                this.GetCharPath(_glyph.lUnicode, worker, _x, _y);
                worker.df();
                worker._e();
            }
        };

		this.GetCharLoadMode = function(code)
        {
        	if (this.HintsSupport && this.HintsSubpixelSupport)
			{
				// -----------------------------------------------------------------
				// заглушки
				if (code === 95 && this.m_pFaceInfo.family_name === "Wingdings 3")
					return AscFonts.LOAD_MODE_DEFAULT;
				// -----------------------------------------------------------------
				return this.m_oFontManager.LOAD_MODE;
			}
			return AscFonts.LOAD_MODE_DEFAULT;
        };

        this.GetKerning = function(unPrevGID, unGID)
        {
            var delta = AscFonts.FT_GetKerningX(this.m_pFace, unPrevGID, unGID);
            return (delta >> 6);
        };

        this.SetStringGID = function(bGID)
        {
            if (this.m_bStringGID == bGID)
                return;

            this.m_bStringGID = bGID;
        };

        this.GetStringGID = function()
        {
            return this.m_bStringGID;
        };

        this.SetCharSpacing = function(fCharSpacing)
        {
            this.m_fCharSpacing = fCharSpacing;
        };

        this.GetCharSpacing = function()
        {
            return this.m_fCharSpacing;
        };

        this.GetStyleName = function()
        {
            return this.m_pFaceInfo.style_name;
        };

        this.UpdateStyles = function(bBold, bItalic)
        {
            var sStyle = this.GetStyleName();

            // Смотрим какой стиль у исходного шрифта
            var bSrcBold = (-1 != sStyle.indexOf("Bold"));
            var bSrcItalic = (-1 != sStyle.indexOf("Italic"));

            this.SetNeedBold(bBold && !bSrcBold);
            this.SetNeedItalic(bItalic && !bSrcItalic);
        };

        this.IsBold = function()
        {
        	if (this.m_bNeedDoBold)
        		return true;

        	return (-1 != this.m_pFaceInfo.style_name.indexOf("Bold")) ? true : false;
        };

        this.IsItalic = function()
        {
            if (this.m_bNeedDoItalic)
                return true;

            return (-1 != this.m_pFaceInfo.style_name.indexOf("Italic")) ? true : false;
        };

        this.SetNeedItalic = function(value)
        {
            if (this.m_bNeedDoItalic != value)
            {
                this.ClearCache();
                this.m_bNeedDoItalic = value;
                this.ResetFontMatrix();
            }
        };

        this.SetNeedBold = function(value)
        {
            if (this.m_bNeedDoBold != value)
            {
                this.ClearCache();
                this.m_bNeedDoBold = value;
            }
        };

        this.IsSuccess = function()
        {
            return (0 == this.m_nError);
        };

        this.GetAscender = function()
        {
            return this.m_lAscender;
        };

        this.GetDescender = function()
        {
            return this.m_lDescender;
        };

        this.GetHeight = function()
        {
            return this.m_lLineHeight;
        };

        this.Units_Per_Em = function()
        {
            return this.m_lUnits_Per_Em;
        };

        this.CheckHintsSupport = function()
        {
            this.HintsSupport = true;
            this.HintsSubpixelSupport = true;
        };

        this.cellGetMetrics = function()
        {
            var face = this.m_pFaceInfo;
            var ret = [];
            ret.push(face.units_per_EM);
            if (face.os2_version != 0xFFFF)
            {
                ret.push(face.os2_usWinAscent);
                ret.push(-face.os2_usWinDescent);
            }
            else
            {
                ret.push(face.header_yMax);
                ret.push(face.header_yMin);
            }
            return ret;
        };

        this.SetFace = function(face, fontManager)
		{
			this.m_pFace = face;
			this.m_pFaceInfo = new AscFonts.CFaceInfo();
			this.m_pFaceInfo.load(this.m_pFace);

            this.m_lUnits_Per_Em 	= this.m_pFaceInfo.units_per_EM;
            this.m_lAscender 		= this.m_pFaceInfo.ascender;
            this.m_lDescender 		= this.m_pFaceInfo.descender;
            this.m_lLineHeight 		= this.m_pFaceInfo.height;

            if (fontManager.IsUseWinOS2Params && this.m_pFaceInfo.os2_version != 0xFFFF)
            {
                if (fontManager.IsCellMode)
                {
                    /*
                    // что-то типо этого в экселе... пока выключаем
                    var _addidive = (0.15 * font.m_lLineHeight) >> 0;
                    font.m_lAscender += ((_addidive + 1) >> 1);
                    font.m_lDescender -= (_addidive >> 1);
                    font.m_lLineHeight += _addidive;
                    */

                    var _winAscent = this.m_pFaceInfo.os2_usWinAscent;
                    var _winDescent = -this.m_pFaceInfo.os2_usWinDescent;

                    // experimantal: for cjk fonts lineheight *= 1.3
                    if ((this.m_pFaceInfo.os2_ulUnicodeRange2 & 0x2DF00000) != 0)
                    {
                        var _addidive = (0.3 * (_winAscent - _winDescent)) >> 0;
                        _winAscent += ((_addidive + 1) >> 1);
                        _winDescent -= (_addidive >> 1);
                    }

                    // TODO:
                    // https://www.microsoft.com/typography/otspec/recom.htm - hhea, not typo!!!
                    if (this.m_pFaceInfo.height < (_winAscent - _winDescent))
                    {
                        this.m_lAscender = _winAscent;
                        this.m_lDescender = _winDescent;
                        this.m_lLineHeight = _winAscent - _winDescent;
                    }
                }
                else
                {
                    var bIsUseTypeAttack = ((this.m_pFaceInfo.os2_fsSelection & 128) == 128) ? true : false;
                    if (bIsUseTypeAttack)
                    {
                        this.m_lAscender  = this.m_pFaceInfo.os2_sTypoAscender;
                        this.m_lDescender = this.m_pFaceInfo.os2_sTypoDescender;

                        this.m_lLineHeight = (this.m_pFaceInfo.os2_sTypoAscender - this.m_pFaceInfo.os2_sTypoDescender + this.m_pFaceInfo.os2_sTypoLineGap);
                    }
                    else if (false)
                    {
                        this.m_lAscender  = this.m_pFaceInfo.os2_usWinAscent;
                        this.m_lDescender = -this.m_pFaceInfo.os2_usWinDescent;

                        this.m_lLineHeight = (this.m_pFaceInfo.os2_usWinAscent + this.m_pFaceInfo.os2_usWinDescent);
                    }
                }
            }

            this.m_nNum_charmaps = this.m_pFaceInfo.num_charmaps;
            this.m_nDefaultChar = this.m_pFaceInfo.os2_usDefaultChar;

            this.m_nSymbolic = this.m_pFaceInfo.os2_nSymbolic;
            this.m_nError = AscFonts.FT_Set_Char_Size(face, 0, this.m_fSize * 64, 0, 0);

            this.ResetTextMatrix();
            this.ResetFontMatrix();

            if (true === fontManager.m_bUseKerning)
            {
                this.m_bUseKerning = ((this.m_pFaceInfo.face_flags & 64) != 0 ? true : false);
            }

            if (0 != this.m_pFaceInfo.monochromeSizes.length)
			{
				this.fixed_sizes = [];
				for (var i = this.m_pFaceInfo.monochromeSizes.length - 1; i >= 0; i--)
				{
                    this.fixed_sizes[this.m_pFaceInfo.monochromeSizes[i] >> 6] = true;
				}
			}
        }
	}

	function CFontLoaderBySymbol()
	{
		this.FontFiles = {};

		this.LoadSymbol = function(pFontFile, symbol, isRaster, isRasterDistances, workerVector, workerVectorX, workerVectorY, isFromPicker)
		{
			var fontManager = pFontFile.m_oFontManager;

			var name = AscFonts.FontPickerByCharacter.getFontBySymbol(symbol);
			if (undefined === name || name == "")
				return null;

			var _fontFilePick = this.FontFiles[name];
			if (!_fontFilePick)
			{
                var _font_info = AscFonts.g_font_infos[AscFonts.g_map_font_index[name]];
                var _style = AscFonts.FontStyle.FontStyleRegular;
                if (pFontFile.IsBold())
                	_style |= AscFonts.FontStyle.FontStyleBold;
                if (pFontFile.IsItalic())
                    _style |= AscFonts.FontStyle.FontStyleItalic;

                _fontFilePick = _font_info.LoadFont(AscCommon.g_font_loader, fontManager, pFontFile.m_fSize, _style, pFontFile.m_unHorDpi, pFontFile.m_unVerDpi, undefined, true);

                if (!_fontFilePick)
                	return null;

                _fontFilePick.CheckHintsSupport();
                this.FontFiles[name] = _fontFilePick;
			}

			if (!_fontFilePick)
				return null;

            _fontFilePick.SetSizeAndDpi(pFontFile.m_fSize, pFontFile.m_unHorDpi, pFontFile.m_unVerDpi);

            var s = pFontFile.m_arrdTextMatrix;
            var d = _fontFilePick.m_arrdTextMatrix;

            d[0] = s[0];
            d[1] = s[1];
            d[2] = s[2];
            d[3] = s[3];
            d[4] = s[4];
            d[5] = s[5];

            _fontFilePick.UpdateMatrix();
            return _fontFilePick.CacheGlyph(symbol, isRaster, isRasterDistances, workerVector, workerVectorX, workerVectorY, true);
		};

		this.ClearCache = function()
		{
			if (this.FontClearCache_checker)
				return;
            this.FontClearCache_checker = true;
			for (var font in this.FontFiles)
				this.FontFiles[font].ClearCache();
            delete this.FontClearCache_checker;
		};

		this.ClearCacheNoAttack = function()
		{
            if (this.FontClearCacheNoAttack_checker)
                return;
            this.FontClearCacheNoAttack_checker = true;
            for (var font in this.FontFiles)
                this.FontFiles[font].ClearCacheNoAttack();
            delete this.FontClearCacheNoAttack_checker;
		};
	}

	window['AscFonts'].EGlyphState = EGlyphState;
	window['AscFonts'].CFontFile = CFontFile;
    window['AscFonts'].onLoadModule();
})(window);

/*
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(function(window, undefined) {

    var AscFonts = window['AscFonts'];

    function CFontManagerEngine()
    {
        this.library = AscFonts.CreateLibrary();
        this.manager = null;

        this.openFont = function(stream, faceindex)
        {
            var face = AscFonts.FT_Open_Face(this.library, stream, faceindex);
            if (!face)
                return null;

            var font = new AscFonts.CFontFile();
            font.SetFace(face, this.manager);

            if (!font.IsSuccess())
            {
                font = null;
                face = null;
                return null;
            }

            return font;
        };

        this.setHintsProps = function(bIsHinting, bIsSubpixHinting)
        {
            var REND_MODE_SUBPIX = (bIsHinting && bIsSubpixHinting) ? AscFonts.TT_INTERPRETER_VERSION_40 : AscFonts.TT_INTERPRETER_VERSION_35;
            this.manager.LOAD_MODE = bIsHinting ? AscFonts.LOAD_MODE_HINTING : AscFonts.LOAD_MODE_DEFAULT;

            AscFonts.FT_Set_TrueType_HintProp(this.library, REND_MODE_SUBPIX);
        };
    }

    window['AscFonts'].engine_Create = function(fontManager)
    {
        var engine = new CFontManagerEngine();
        engine.manager = fontManager;
        engine.setHintsProps(fontManager.bIsHinting, fontManager.bIsSubpixHinting);
        fontManager._engine = engine;
        AscFonts.initVariables();
    };

    window['AscFonts'].engine_Destroy = function(fontManager)
    {
    };

    window['AscFonts'].onLoadModule();
})(window);
