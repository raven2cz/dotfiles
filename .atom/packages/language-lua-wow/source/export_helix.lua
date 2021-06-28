-- could parse in python, but meh.

local function dofile(file)
	local f = assert(io.open(file))
	return assert(loadstring(f:read("*all"):gsub("local ", "")))() -- unlocal the table
end

local function export(infile, outfile, var)
	dofile(infile)
	local f = assert(io.open(outfile, "w"))
	for _, v in next, _G[var] do
		f:write(v .. "\n")
	end
end

export("Helix/GlobalAPI.lua", "raw_api", "GlobalAPI")
export("Helix/Events.lua", "raw_events", "Events")
