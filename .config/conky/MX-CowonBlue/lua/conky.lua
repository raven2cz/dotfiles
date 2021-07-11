-- some globals
   CJK = 'false'
   DATE_FORMAT = '${time %A   %B %d}'
   LANG = os.getenv("LC_ALL")
   if ( not LANG or LANG == '' ) then  LANG = os.getenv("LANG") end
   if ( not LANG or LANG == '' ) then  LANG = "C" end
   if string.match(LANG,"^%l%l+_%u+") then
      LL_CC = string.sub(LANG, string.find(LANG, "^%l%l+_%u+"))
   else
      LL_CC = "C"
   end
   if  string.match(LANG,"^%l%l+") then
       LL = string.sub(LANG, string.find(LANG, "^%l%l+"))
   else
       LL = "C"
   end

-- some locals
local date_format_table =
{
   ['en_US']   = '${time %A   %B %d}',
   ['en']      = '${time %A   %B %d}',
   ['C']       = '${time %A   %B %d}',
   ['de_DE']   = '${time %A  %-d. %B}',
   ['de']      = '${time %A  %-d. %B}',
   ['ja']      = '${time %B %d日 %A}',
   ['ko']      = '${time %B %d일 %A}',
   ['zh']      = '${time %B %d日 %A}',
   ['default'] = '${time %A  %d %B}',
}

local cjk_table =
{
   ['ja'] = 'true',
   ['ko'] = 'true',
   ['zh'] = 'true',
   ['ar'] = 'true',
   ['fa'] = 'true',
   ['he'] = 'true',
}

-- some functions
function has_ampm()
    local handle = io.popen("locale  -k d_t_fmt | grep  -sqo -E '%r|%p|%I' && echo yes || echo no")
    local output = handle:read("*l")
    handle:close()
    return  output
end

if has_ampm() == "yes" then
    ampm = true
else
    ampm = false
end

function conky_hours()
    if ampm then
        return os.date("%I")
    else
        return os.date("%H")
    end
end

function conky_ampm()
    if ampm then
        return os.date("%P")
    else
        return ''
    end
end

function conky_AMPM()
    if ampm then
        return os.date("%p")
    else
        return ''
    end
end

function conky_am_pm()
    return conky_ampm()
end

function conky_AM_PM()
    return conky_AMPM()
end

function conky_lang()
     return os.getenv("LANG")
end

function conky_cpu()
     local str=''
     str=conky_parse('${cpu cpu0}')
     return string.format("%3d", str)
end

function conky_memperc()
     local str=''
     str=conky_parse('${memperc}')
     return string.format("%2d", str)
end

-- CJK handling

function conky_cjk()
    if cjk_table[LL] then
       return 'true'
    else
       return 'false'
    end
end

function conky_time(a)
     local s='${time %' .. a .. '}'
     return conky_parse(s)
end

function conky_set_time(d)
     if ( d == 'a' or d == 'A' ) then
        TIME_A = d
     elseif ( d == 'b' or d == 'B' ) then 
        TIME_B = d
     end
     set_date_format()
     return ''
end

function date_format()
     local date_format
     if      date_format_table[LL_CC] then
             date_format = date_format_table[LL_CC]
     elseif  date_format_table[LL] then
             date_format = date_format_table[LL]
     else
        date_format = date_format_table['default']
     end
        if TIME_A == 'a' then date_format = date_format:gsub('A', 'a');  end
        if TIME_B == 'b' then date_format = date_format:gsub('B', 'b');  end
     return date_format
end

function set_date_format()
     DATE_FORMAT = date_format()
     return
end

function conky_date_format() return DATE_FORMAT; end
function conky_get_date_format() return DATE_FORMAT; end

function conky_date()
     local format_str = DATE_FORMAT
     str=conky_parse(format_str)
     return str
end

