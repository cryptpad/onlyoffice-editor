#!/usr/bin/env python

import sys
sys.path.append('../../../../../build_tools/scripts')
import base
import os

base.configure_common_apps()

freetype_version = "2.10.1"
freetype_name = "freetype-" + freetype_version

# fetch emsdk
if not base.is_dir("emsdk"):
  base.cmd("git", ["clone", "https://github.com/emscripten-core/emsdk.git"])
  os.chdir("emsdk")
  base.cmd("emsdk", ["install", "latest"])
  base.cmd("emsdk", ["activate", "latest"])
  os.chdir("../")

# fetch freetype
if not base.is_dir(freetype_name):
  base.download("https://netcologne.dl.sourceforge.net/project/freetype/freetype2/2.10.1/ft" + freetype_version.replace(".", "") + ".zip", freetype_name + ".zip")
  base.extract(freetype_name + ".zip", "./")


# compile
compiler_flags = ["-o fonts.js",
                  "-O3",
                  "-fno-exceptions",
                  "-fno-rtti",
                  "-s WASM=1",
                  "-s ALLOW_MEMORY_GROWTH=1",
                  "-s FILESYSTEM=0",
                  "-s ENVIRONMENT='web'"]

exported_functions = ["_malloc",
                      "_free",
                      "_ASC_FT_Malloc",
                      "_ASC_FT_Free",
                      "_ASC_FT_Init",
                      "_ASC_FT_Open_Face",
                      "_ASC_FT_SetCMapForCharCode",
                      "_FT_Done_FreeType",
                      "_FT_Done_Face",
                      "_FT_Load_Glyph",
                      "_FT_Get_Glyph",
                      "_FT_Set_Transform",
                      "_FT_Set_Char_Size",
                      "_ASC_FT_GetFaceInfo",
                      "_ASC_FT_GetFaceMaxAdvanceX",
                      "_ASC_FT_GetKerningX",
                      "_ASC_FT_Glyph_Get_CBox",
                      "_ASC_FT_Get_Glyph_Measure_Params",
                      "_ASC_FT_Get_Glyph_Render_Params",
                      "_ASC_FT_Get_Glyph_Render_Buffer",
                      "_ASC_FT_Set_Transform",
                      "_ASC_FT_Set_TrueType_HintProp"]

input_sources = ["builds/windows/ftdebug.c",
                 "src/autofit/autofit.c",
                 "src/bdf/bdf.c",
                 "src/cff/cff.c",
                 "src/base/ftbase.c",
                 "src/base/ftbitmap.c",
                 "src/base/ftfstype.c",
                 "src/base/ftgasp.c",
                 "src/cache/ftcache.c",
                 "src/base/ftglyph.c",
                 "src/gzip/ftgzip.c",
                 "src/base/ftinit.c",
                 "src/lzw/ftlzw.c",
                 "src/base/ftstroke.c",
                 "src/base/ftsystem.c",
                 "src/smooth/smooth.c",
                 "src/base/ftbbox.c",
                 "src/base/ftbdf.c",
                 "src/base/ftcid.c",
                 "src/base/ftmm.c",
                 "src/base/ftpfr.c",
                 "src/base/ftsynth.c",
                 "src/base/fttype1.c",
                 "src/base/ftwinfnt.c",
                 "src/base/ftgxval.c",
                 "src/base/ftotval.c",
                 "src/base/ftpatent.c",
                 "src/pcf/pcf.c",
                 "src/pfr/pfr.c",
                 "src/psaux/psaux.c",
                 "src/pshinter/pshinter.c",
                 "src/psnames/psmodule.c",
                 "src/raster/raster.c",
                 "src/sfnt/sfnt.c",
                 "src/truetype/truetype.c",
                 "src/type1/type1.c",
                 "src/cid/type1cid.c",
                 "src/type42/type42.c",
                 "src/winfonts/winfnt.c"]

sources = []
for item in input_sources:
  sources.append(freetype_name + "/" + item)

sources.append("freetype-common/freetype.c")

compiler_flags.append("-I" + freetype_name + "/include")
compiler_flags.append("-I" + freetype_name + "/include/freetype")
compiler_flags.append("-I" + freetype_name + "/include/freetype/internal")
compiler_flags.append("-DWIN32 -DNDEBUG -D_LIB -D_CRT_SECURE_NO_WARNINGS -DFT2_BUILD_LIBRARY")

# arguments
arguments = ""
for item in compiler_flags:
  arguments += (item + " ")

arguments += "-s EXPORTED_FUNCTIONS=\"["
for item in exported_functions:
  arguments += ("'" + item + "',")
arguments = arguments[:-1]
arguments += "]\" "

for item in sources:
  arguments += (item + " ")

# command
windows_bat = []
windows_bat.append("call emsdk/emsdk_env.bat")
windows_bat.append("call emcc " + arguments)
base.run_as_bat(windows_bat)

# finalize
base.replaceInFile("./fonts.js", "__ATPOSTRUN__=[];", "__ATPOSTRUN__=[function(){window[\"AscFonts\"].onLoadModule();}];")
base.replaceInFile("./fonts.js", "function getBinaryPromise(){", "function getBinaryPromise2(){")

fonts_js_content = base.readFile("fonts.js")
engine_base_js_content = base.readFile("../engine_base.js")
engine_js_content = engine_base_js_content.replace("//module", fonts_js_content)

# remove previous version
if base.is_file("../engine.js"):
  base.delete_file("../engine.js")
if base.is_file("../fonts.wasm"):
  base.delete_file("../fonts.wasm")

# write new version
base.writeFile("../engine.js", engine_js_content)
base.copy_file("fonts.wasm", "../fonts.wasm")