--[[ by mrpeachy - 
combines background bar and calendar functions
]]
require 'cairo'
require 'imlib2'

function rgb_to_r_g_b(col_a)
return ((col_a[1] / 0x10000) % 0x100) / 255., ((col_a[1] / 0x100) % 0x100) / 255., (col_a[1] % 0x100) / 255., col_a[2]
end

function conky_gradbar(bartab)
if conky_window == nil then return end
local cs = cairo_xlib_surface_create(conky_window.display, conky_window.drawable, conky_window.visual, conky_window.width, conky_window.height)
local cr = cairo_create(cs)
local updates=tonumber(conky_parse('${updates}'))
if updates>5 then
--#########################################################################################################
--convert to table
local bartab=loadstring("return" .. bartab)()
local bar_startx=bartab[1]
local bar_starty=bartab[2]
local number=bartab[3]
local number=conky_parse(number)
local number_max=bartab[4]
local divisions=bartab[5]
local div_width=bartab[6]
local div_height=bartab[7]
local div_gap=bartab[8]
local bg_col=bartab[9]
local bg_alpha=bartab[10]
local st_col=bartab[11]
local st_alpha=bartab[12]
local mid_col=bartab[13]
local mid_alpha=bartab[14]
local end_col=bartab[15]
local end_alpha=bartab[16]
--color conversion
local br,bg,bb,ba=rgb_to_r_g_b({bg_col,bg_alpha})
local sr,sg,sb,sa=rgb_to_r_g_b({st_col,st_alpha})
local mr,mg,mb,ma=rgb_to_r_g_b({mid_col,mid_alpha})
local er,eg,eb,ea=rgb_to_r_g_b({end_col,end_alpha})
if number==nil then number=0 end
local number_divs=(number/number_max)*divisions
cairo_set_line_width (cr,div_width)
--gradient calculations
for i=1,divisions do
if i<(divisions/2) and i<=number_divs then
colr=((mr-sr)*(i/(divisions/2)))+sr
colg=((mg-sg)*(i/(divisions/2)))+sg
colb=((mb-sb)*(i/(divisions/2)))+sb
cola=((ma-sa)*(i/(divisions/2)))+sa
elseif i>=(divisions/2) and i<=number_divs then
colr=((er-mr)*((i-(divisions/2))/(divisions/2)))+mr
colg=((eg-mg)*((i-(divisions/2))/(divisions/2)))+mg
colb=((eb-mb)*((i-(divisions/2))/(divisions/2)))+mb
cola=((ea-ma)*((i-(divisions/2))/(divisions/2)))+ma
else
colr=br
colg=bg
colb=bb
cola=ba
end
cairo_set_source_rgba (cr,colr,colg,colb,cola)
cairo_move_to (cr,bar_startx+((div_width+div_gap)*i-1),bar_starty)
cairo_rel_line_to (cr,0,div_height)
cairo_stroke (cr)
end
--#########################################################################################################
end-- if updates>5
bartab=nil
colr=nil
colg=nil
colb=nil
cola=nil
cairo_destroy(cr)
cairo_surface_destroy(cs)
cr=nil
return ""
end-- end main function

function conky_draw_bg(bgtab)
if conky_window == nil then return end
local cs = cairo_xlib_surface_create(conky_window.display, conky_window.drawable, conky_window.visual, conky_window.width, conky_window.height)
local cr = cairo_create(cs)
--#########################################################################################################
--convert to table
local bgtab=loadstring("return" .. bgtab)()
local r=bgtab[1]
local x=bgtab[2]
local y=bgtab[3]
local w=bgtab[4]
local h=bgtab[5]
local color=bgtab[6]
local alpha=bgtab[7]
local draw=bgtab[8]
local lwidth=bgtab[9]
local olcolor=bgtab[10]
local olalpha=bgtab[11]
if w==0 then 
w=tonumber(conky_window.width)
end
if h==0 then
h=tonumber(conky_window.height)
end
cairo_set_source_rgba (cr,rgb_to_r_g_b({color,alpha}))
--top left mid circle
local xtl=x+r
local ytl=y+r
--top right mid circle
local xtr=(x+r)+((w)-(2*r))
local ytr=y+r
--bottom right mid circle
local xbr=(x+r)+((w)-(2*r))
local ybr=(y+r)+((h)-(2*r))
--bottom right mid circle
local xbl=(x+r)
local ybl=(y+r)+((h)-(2*r))
--the drawing part---------------------------
cairo_move_to (cr,xtl,ytl-r)
cairo_line_to (cr,xtr,ytr-r)
cairo_arc(cr,xtr,ytr,r,((2*math.pi/4)*3),((2*math.pi/4)*4))
cairo_line_to (cr,xbr+r,ybr)
cairo_arc(cr,xbr,ybr,r,((2*math.pi/4)*4),((2*math.pi/4)*1))
cairo_line_to (cr,xbl,ybl+r)
cairo_arc(cr,xbl,ybl,r,((2*math.pi/4)*1),((2*math.pi/4)*2))
cairo_line_to (cr,xtl-r,ytl)
cairo_arc(cr,xtl,ytl,r,((2*math.pi/4)*2),((2*math.pi/4)*3))
cairo_close_path(cr)
if draw==1 then
cairo_fill (cr)
elseif draw==2 then
cairo_set_line_width (cr,lwidth)
cairo_stroke (cr)
elseif draw==3 then
cairo_fill_preserve (cr)
cairo_set_source_rgba (cr,rgb_to_r_g_b({olcolor,olalpha}))
cairo_set_line_width (cr,lwidth)
cairo_stroke (cr)
end
--#########################################################################################################
bgtab=nil
w=nil
h=nil
cairo_destroy(cr)
cairo_surface_destroy(cs)
cr=nil
return ""
end-- end main function

function conky_luaimage(imtab)
if conky_window == nil then return end
local cs = cairo_xlib_surface_create(conky_window.display, conky_window.drawable, conky_window.visual, conky_window.width, conky_window.height)
local cr = cairo_create(cs)
--#########################################################################################################
local imtab=loadstring("return" .. imtab)()
local im_x=imtab[1]
local im_y=imtab[2]
local im_w=imtab[3]
local im_h=imtab[4]
local file=imtab[5]
local show = imlib_load_image(file)
if show == nil then return end
imlib_context_set_image(show)
if tonumber(im_w)==0 then 
width=imlib_image_get_width() 
else
width=tonumber(im_w)
end
if tonumber(im_h)==0 then 
height=imlib_image_get_height() 
else
height=tonumber(im_h)
end
imlib_context_set_image(show)
local scaled=imlib_create_cropped_scaled_image(0, 0, imlib_image_get_width(), imlib_image_get_height(), width, height)
imlib_free_image()
imlib_context_set_image(scaled)
imlib_render_image_on_drawable(im_x, im_y)
imlib_free_image()
show=nil
--#########################################################################################################
imtab=nil
height=nil
width=nil
cairo_destroy(cr)
cairo_surface_destroy(cs)
cr=nil
return ""
end-- end main function

function conky_tex_bg(textab)
local textab=loadstring("return" .. textab)()
local tex_file=textab[6]
local surface = cairo_image_surface_create_from_png(tostring(tex_file))
local cw,ch = conky_window.width, conky_window.height
local cs=cairo_xlib_surface_create(conky_window.display, conky_window.drawable, conky_window.visual, cw,ch)
local cr=cairo_create(cs)
--#########################################################################################################
--convert to table
local r=textab[1]
local x=textab[2]
local y=textab[3]
local w=textab[4]
local h=textab[5]
if w=="0" then
w=cw
end
if h=="0" then
h=ch
end
--top left mid circle
local xtl=x+r
local ytl=y+r
--top right mid circle
local xtr=(x+r)+((w)-(2*r))
local ytr=y+r
--bottom right mid circle
local xbr=(x+r)+((w)-(2*r))
local ybr=(y+r)+((h)-(2*r))
--bottom right mid circle
local xbl=(x+r)
local ybl=(y+r)+((h)-(2*r))
--the drawing part---------------------------
cairo_move_to (cr,xtl,ytl-r)
cairo_line_to (cr,xtr,ytr-r)
cairo_arc(cr,xtr,ytr,r,((2*math.pi/4)*3),((2*math.pi/4)*4))
cairo_line_to (cr,xbr+r,ybr)
cairo_arc(cr,xbr,ybr,r,((2*math.pi/4)*4),((2*math.pi/4)*1))
cairo_line_to (cr,xbl,ybl+r)
cairo_arc(cr,xbl,ybl,r,((2*math.pi/4)*1),((2*math.pi/4)*2))
cairo_line_to (cr,xtl-r,ytl)
cairo_arc(cr,xtl,ytl,r,((2*math.pi/4)*2),((2*math.pi/4)*3))
cairo_close_path(cr)
cairo_clip (cr)
cairo_new_path (cr);
--image part
cairo_set_source_surface (cr, surface, 0, 0)
cairo_paint (cr)
--#########################################################################################################
textab=nil
w=nil
h=nil
cairo_destroy(cr)
cairo_surface_destroy (cs)
cairo_surface_destroy (surface)
cr=nil
return ""
end-- end main function

function conky_luatext(txttab)--x,y,c,a,f,fs,txt,j ##################################################
if conky_window == nil then return end
local cs = cairo_xlib_surface_create(conky_window.display, conky_window.drawable, conky_window.visual, conky_window.width, conky_window.height)
local cr = cairo_create(cs)
--#########################################################################################################
--convert to table
local txttab=loadstring("return" .. txttab)()
local x=txttab[1]
local y=txttab[2]
local c=txttab[3]
local a=txttab[4]
local f=txttab[5]
local fs=txttab[6]
local j=txttab[7]
local txt=txttab[8]
cairo_select_font_face (cr, f, CAIRO_FONT_SLANT_NORMAL, CAIRO_FONT_WEIGHT_NORMAL);
cairo_set_font_size (cr, fs)
local extents=cairo_text_extents_t:create()
cairo_text_extents(cr,txt,extents)
local wx=extents.x_advance
cairo_set_source_rgba (cr,rgb_to_r_g_b({c,a}))
if j=="l" then
cairo_move_to (cr,x,y)
elseif j=="c" then
cairo_move_to (cr,x-(wx/2),y)
elseif j=="r" then
cairo_move_to (cr,x-wx,y)
end
cairo_show_text (cr,txt)
cairo_stroke (cr)
--#########################################################################################################
txttab=nil
cairo_destroy(cr)
cairo_surface_destroy (cs)
cr=nil
return ""
end-- end main function
