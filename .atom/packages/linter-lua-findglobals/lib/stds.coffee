extend = (dst, args...) ->
  dst = {} unless dst?
  for src in args when typeof src is 'object'
    for k, v of src
      dst[k] = v
  dst

# this is mostly from luacheck

stds = {}

stds.lua51 =
	_G: true
	package: true
	_VERSION: true
	arg: true
	assert: true
	collectgarbage: true
	coroutine: true
	debug: true
	dofile: true
	error: true
	gcinfo: true
	getfenv: true
	getmetatable: true
	io: true
	ipairs: true
	load: true
	loadfile: true
	loadstring: true
	math: true
	module: true
	newproxy: true
	next: true
	os: true
	pairs: true
	pcall: true
	print: true
	rawequal: true
	rawget: true
	rawset: true
	require: true
	select: true
	setfenv: true
	setmetatable: true
	string: true
	table: true
	tonumber: true
	tostring: true
	type: true
	unpack: true
	xpcall: true

stds.lua52 =
	_ENV: true
	_G: true
	package: true
	_VERSION: true
	arg: true
	assert: true
	bit32: true
	collectgarbage: true
	coroutine: true
	debug: true
	dofile: true
	error: true
	getmetatable: true
	io: true
	ipairs: true
	load: true
	loadfile: true
	math: true
	next: true
	os: true
	pairs: true
	pcall: true
	print: true
	rawequal: true
	rawget: true
	rawlen: true
	rawset: true
	require: true
	select: true
	setmetatable: true
	string: true
	table: true
	tonumber: true
	tostring: true
	type: true
	xpcall: true

stds.lua53 =
	_ENV: true
	_G: true
	package: true
	_VERSION: true
	arg: true
	assert: true
	collectgarbage: true
	coroutine: true
	debug: true
	dofile: true
	error: true
	getmetatable: true
	io: true
	ipairs: true
	load: true
	loadfile: true
	math: true
	next: true
	os: true
	pairs: true
	pcall: true
	print: true
	rawequal: true
	rawget: true
	rawlen: true
	rawset: true
	require: true
	select: true
	setmetatable: true
	string: true
	table: true
	tonumber: true
	tostring: true
	type: true
	utf8: true
	xpcall: true

stds.luajit =
	_G: true
	package: true
	_VERSION: true
	arg: true
	assert: true
	bit: true
	collectgarbage: true
	coroutine: true
	debug: true
	dofile: true
	error: true
	gcinfo: true
	getfenv: true
	getmetatable: true
	io: true
	ipairs: true
	jit: true
	load: true
	loadfile: true
	loadstring: true
	math: true
	module: true
	newproxy: true
	next: true
	os: true
	pairs: true
	pcall: true
	print: true
	rawequal: true
	rawget: true
	rawset: true
	require: true
	select: true
	setfenv: true
	setmetatable: true
	string: true
	table: true
	tonumber: true
	tostring: true
	type: true
	unpack: true
	xpcall: true

stds.min = {}
for k of stds.lua51
	stds.min[k] = true if stds.lua52[k] and stds.lua53[k] and stds.luajit[k]

stds.max = extend({}, stds.lua51, stds.lua52, stds.lua53, stds.luajit)

stds.none = {}

module.exports = stds
