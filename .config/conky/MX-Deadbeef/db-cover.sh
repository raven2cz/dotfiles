#! /bin/bash
# An album art script for Deadbeef

# check deadbeef 
#
if ! which deadbeef >/dev/null; then
   # no deadbeef found
   exit 1
fi
ARTCACHE=~/.config/deadbeef/artcache
ARTIST="`deadbeef --nowplaying "%a"`"
ALBUM="`deadbeef --nowplaying "%b"`"
CURCOVER="$ARTCACHE/$ARTIST/$ALBUM.jpg"
#CONKYDIR="$HOME/.config/conky"
# conky dir is current dir
CONKYDIR="."
COVER="$CONKYDIR/conkyCover.png"

if [ ! -f "$CONKYDIR/Vinyl/base.png" ]; then
	exit 1
fi

if [ ! -f "$CURCOVER" ]; then
    convert $CONKYDIR/Vinyl/base.png $CONKYDIR/Vinyl/top.png \
    -geometry +0+0 -composite "$COVER"
else
    cp "$CURCOVER" "$COVER"
    
    ASPECT=$(($(identify -format %w "$COVER") - $(identify -format %h "$COVER")))
	    
	if [ "$ASPECT" = "0" ]; then
		convert "$COVER"  -thumbnail 300x86 "$COVER"
		convert "$COVER" -crop 86x86+$(( ($(identify -format %w "$COVER") - 86) / 2))+0 +repage "$COVER"
    else
        convert "$COVER"  -thumbnail 86x500 "$COVER"
        convert "$COVER" -crop 86x86+0+$(( ($(identify -format %h "$COVER") - 86) / 2)) +repage "$COVER"
	fi
	convert $CONKYDIR/Vinyl/base.png "$COVER" -geometry +4+3 \
	-composite $CONKYDIR/Vinyl/top.png -geometry +0+0 -composite "$COVER"
fi

