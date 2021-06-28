-- http://lua-users.org/wiki/LuaCompilerInLua

-- compile the input file(s)
local chunk = {}
for _, file in ipairs(arg) do
  chunk[#chunk + 1] = assert(loadfile(file))
end

if #chunk == 1 then
  chunk = chunk[1]
else
  -- combine multiple input files into a single chunk
  for i, func in ipairs(chunk) do
    chunk[i] = ("%sloadstring%q(...);"):format(
      i==#chunk and "return " or " ",
      string.dump(func))
  end
  chunk = assert(loadstring(table.concat(chunk))
end

local out = assert(io.open("luac.lua.out", "wb"))
out:write(string.dump(chunk))
out:close()
