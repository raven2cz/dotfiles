#!/bin/sh

myKernel=$(uname -r)

cat <<EOF | xmenu | sh &
$myKernel	urxvt

Shutdown		poweroff
Reboot			reboot

IMG:/home/box/.cache/xdg-xmenu/icons/Alacritty.png	Alacritty (Terminal)	alacritty
IMG:/home/box/.cache/xdg-xmenu/icons/kitty.png	kitty (Terminal emulator)	kitty

IMG:/home/box/.cache/xdg-xmenu/icons/firefox.png	Firefox (Web Browser)	/usr/lib/firefox/firefox
IMG:/home/box/.cache/xdg-xmenu/icons/krusader_user.png	Krusader (File Manager)	krusader -qwindowtitle
IMG:/home/box/.cache/xdg-xmenu/icons/system-file-manager.png	Dolphin (File Manager)	dolphin
IMG:/home/box/.cache/xdg-xmenu/icons/idea.png	IntelliJ IDEA Ultimate Edition	"/home/box/ide/idea-IU-221.5787.30/bin/idea.sh"

IMG:/home/box/.cache/xdg-xmenu/icons/applications-accessories.png	Accessories
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Application Finder	xfce4-appfinder
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Archive Manager	file-roller
	IMG:/home/box/.cache/xdg-xmenu/icons/ark.png	Ark (Archiving Tool)	ark
	IMG:/home/box/.cache/xdg-xmenu/icons/atom.png	Atom (Text Editor)	env ATOM_DISABLE_SHELLING_OUT_FOR_ENVIRONMENT=false /usr/bin/atom
	IMG:/home/box/.cache/xdg-xmenu/icons/io.atom.png	Atom (Text Editor)	/usr/bin/flatpak run --branch=stable --arch=x86_64 --command=atom --file-forwarding io.atom.Atom @@ @@
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Books	gnome-books
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Bulk Rename (Bulk Rename)	thunar --bulk-rename
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Calculator	gnome-calculator
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Characters	/usr/bin/gnome-characters
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Clocks (Clocks)	gnome-clocks
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Connections	gnome-connections
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Disks	gnome-disks
	IMG:/home/box/.cache/xdg-xmenu/icons/doom-78.png	Doom Emacs (Text Editor)	doom run
	IMG:/home/box/.cache/xdg-xmenu/icons/filelight.png	Filelight (Disk Usage Statistics)	filelight
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Files	nautilus --new-window
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Fonts	gnome-font-viewer
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	gedit (Text Editor)	gedit
	IMG:/home/box/.cache/xdg-xmenu/icons/ipython.png	ipython (IPython)	xterm -e ipython
	IMG:/home/box/.cache/xdg-xmenu/icons/kalarm.png	KAlarm (Personal Alarm Scheduler)	kalarm
	IMG:/home/box/.cache/xdg-xmenu/icons/kate.png	Kate (Advanced Text Editor)	kate -b
	IMG:/home/box/.cache/xdg-xmenu/icons/kbackup.png	KBackup (Backup Program)	kbackup
	IMG:/home/box/.cache/xdg-xmenu/icons/accessories-calculator.png	KCalc (Scientific Calculator)	kcalc
	IMG:/home/box/.cache/xdg-xmenu/icons/accessories-character-map.png	KCharSelect (Character Selector)	kcharselect --qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/org.kde.png	KDE Itinerary (Itinerary management)	itinerary
	IMG:/home/box/.cache/xdg-xmenu/icons/kfloppy.png	KFloppy (Floppy Formatter)	kfloppy -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kgpg.png	KGpg (Encryption Tool)	kgpg
	IMG:/home/box/.cache/xdg-xmenu/icons/kleopatra.png	Kleopatra (Certificate Manager and Unified Crypto GUI)	kleopatra
	IMG:/home/box/.cache/xdg-xmenu/icons/klipper.png	Klipper (Clipboard Tool)	klipper
	IMG:/home/box/.cache/xdg-xmenu/icons/kmag.png	KMag (Screen Magnifier)	kmag
	IMG:/home/box/.cache/xdg-xmenu/icons/kontact-import-wizard.png	KMail Import Wizard	akonadiimportwizard
	IMG:/home/box/.cache/xdg-xmenu/icons/kmousetool.png	KMouseTool (Automatic Mouse Click)	kmousetool -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kmouth.png	KMouth (Speech Synthesizer Frontend)	kmouth
	IMG:/home/box/.cache/xdg-xmenu/icons/knotes.png	KNotes (Popup Notes)	knotes
	IMG:/home/box/.cache/xdg-xmenu/icons/krename.png	KRename	krename -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/krusader_user.png	Krusader (File Manager)	krusader -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kteatime.png	KTeaTime (Tea Cooker)	kteatime
	IMG:/home/box/.cache/xdg-xmenu/icons/ktimer.png	KTimer (Countdown Launcher)	ktimer
	IMG:/home/box/.cache/xdg-xmenu/icons/kvantum.png	Kvantum Manager	kvantummanager
	IMG:/home/box/.cache/xdg-xmenu/icons/kwrite.png	KWrite (Text Editor)	kwrite
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Logs (Log Viewer)	gnome-logs
	IMG:/home/box/.cache/xdg-xmenu/icons/alacarte.png	Main Menu	alacarte
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Maps	gapplication launch org.gnome.Maps
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Mousepad (Text Editor)	mousepad
	IMG:/home/box/.cache/xdg-xmenu/icons/nvim.png	Neovim (Text Editor)	xterm -e nvim
	IMG:/home/box/.cache/xdg-xmenu/icons/gnome-nettool.png	Network Tools (Network information tools)	gnome-nettool
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.seahorse.png	Passwords and Keys	seahorse
	IMG:/home/box/.cache/xdg-xmenu/icons/picom.png	picom (X compositor)	picom
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Recipes	gnome-recipes
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Screenshot	xfce4-screenshooter
	IMG:/home/box/.cache/xdg-xmenu/icons/xfce-sensors.png	Sensor Viewer (Sensor Values Viewer)	xfce4-sensors
	IMG:/home/box/.cache/xdg-xmenu/icons/spectacle.png	Spectacle (Screenshot Capture Utility)	/usr/bin/spectacle
	IMG:/home/box/.cache/xdg-xmenu/icons/sweeper.png	Sweeper (System Cleaner)	sweeper
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Task Manager (Task Manager)	xfce4-taskmanager
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Thunar File Manager (File Manager)	thunar
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	To Do	gnome-todo
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Weather	gapplication launch org.gnome.Weather
	IMG:/home/box/.cache/xdg-xmenu/icons/stock_xfburn.png	Xfburn (Disk Burning)	xfburn
	IMG:/home/box/.cache/xdg-xmenu/icons/zanshin.png	Zanshin (To Do Management Application)	zanshin
IMG:/home/box/.cache/xdg-xmenu/icons/applications-development.png	Development
	IMG:/home/box/.cache/xdg-xmenu/icons/accerciser.png	Accerciser	accerciser
	IMG:/home/box/.cache/xdg-xmenu/icons/akonadiconsole.png	Akonadi Console	akonadiconsole
	IMG:/home/box/.cache/xdg-xmenu/icons/atom.png	Atom (Text Editor)	env ATOM_DISABLE_SHELLING_OUT_FOR_ENVIRONMENT=false /usr/bin/atom
	IMG:/home/box/.cache/xdg-xmenu/icons/io.atom.png	Atom (Text Editor)	/usr/bin/flatpak run --branch=stable --arch=x86_64 --command=atom --file-forwarding io.atom.Atom @@ @@
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Boxes (Virtual machine viewer/manager)	gnome-boxes
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Builder	gnome-builder
	IMG:/home/box/.cache/xdg-xmenu/icons/cervisia.png	Cervisia (CVS Frontend)	cervisia -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/CMakeSetup.png	CMake	cmake-gui
	IMG:/home/box/.cache/xdg-xmenu/icons/cuttlefish.png	Cuttlefish (Icon Viewer)	cuttlefish
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Devhelp (API Documentation Browser)	devhelp
	IMG:/home/box/.cache/xdg-xmenu/icons/electron11.png	Electron 11	electron11
	IMG:/home/box/.cache/xdg-xmenu/icons/emacs.png	Emacs (Client) (Text Editor)	sh -c "if [ -n \"\$*\" ]; then exec emacsclient --alternate-editor= --display=\"\$DISPLAY\" \"\$@\"; else exec emacsclient --alternate-editor= --create-frame; fi" placeholder
	IMG:/home/box/.cache/xdg-xmenu/icons/emacs.png	Emacs (Text Editor)	emacs
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	GHex (Hex Editor)	ghex
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Glade (Interface Designer)	glade
	IMG:/home/box/.cache/xdg-xmenu/icons/idea.png	IntelliJ IDEA Ultimate Edition	"/home/box/ide/idea-IU-221.5787.30/bin/idea.sh"
	IMG:/home/box/.cache/xdg-xmenu/icons/ipython.png	ipython (IPython)	xterm -e ipython
	IMG:/home/box/.cache/xdg-xmenu/icons/kapptemplate.png	KAppTemplate (App Code Template Generator)	kapptemplate
	IMG:/home/box/.cache/xdg-xmenu/icons/kate.png	Kate (Advanced Text Editor)	kate -b
	IMG:/home/box/.cache/xdg-xmenu/icons/kcachegrind.png	KCachegrind (Profiler Frontend)	kcachegrind -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kdevelop.png	KDevelop (Integrated Development Environment)	kdevelop
	IMG:/home/box/.cache/xdg-xmenu/icons/kdevelop.png	KDevelop (Pick Session) (Integrated Development Environment (Pick Session to start with))	kdevelop --ps
	IMG:/home/box/.cache/xdg-xmenu/icons/kdiff3.png	KDiff3 (Diff/Patch Frontend)	kdiff3
	IMG:/home/box/.cache/xdg-xmenu/icons/kimagemapeditor.png	KImageMapEditor (HTML Image Map Editor)	kimagemapeditor -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/preferences-desktop-theme.png	Kirigami Gallery	kirigami2gallery
	IMG:/home/box/.cache/xdg-xmenu/icons/kompare.png	Kompare (Diff/Patch Frontend)	kompare -o
	IMG:/home/box/.cache/xdg-xmenu/icons/kuiviewer.png	KUIViewer (Qt Designer UI File Viewer)	kuiviewer -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/lokalize.png	Lokalize (Computer-Aided Translation System)	lokalize
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Meld (Diff Viewer)	meld
	IMG:/home/box/.cache/xdg-xmenu/icons/plasma.png	Plasma Engine Explorer (Plasma Data Engines Viewing Tool)	plasmaengineexplorer
	IMG:/home/box/.cache/xdg-xmenu/icons/preferences-desktop-theme.png	Plasma Global Theme Explorer	lookandfeelexplorer
	IMG:/home/box/.cache/xdg-xmenu/icons/preferences-desktop-theme.png	Plasma Theme Explorer	plasmathemeexplorer
	IMG:/home/box/.cache/xdg-xmenu/icons/assistant.png	Qt Assistant	assistant
	IMG:/home/box/.cache/xdg-xmenu/icons/QtProject-designer.png	Qt Designer (Interface Designer)	designer
	IMG:/home/box/.cache/xdg-xmenu/icons/linguist.png	Qt Linguist	linguist
	IMG:/home/box/.cache/xdg-xmenu/icons/qdbusviewer.png	Qt QDBusViewer  (D-Bus Debugger)	qdbusviewer
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Sysprof (Profiler)	sysprof
	IMG:/home/box/.cache/xdg-xmenu/icons/umbrello.png	Umbrello (UML Modeller)	umbrello5 -caption
	IMG:/home/box/.cache/xdg-xmenu/icons/search.png	UserFeedback Console (UserFeedback Management Console)	UserFeedbackConsole
IMG:/home/box/.cache/xdg-xmenu/icons/applications-education.png	Education
	IMG:/home/box/.cache/xdg-xmenu/icons/artikulate.png	Artikulate (Artikulate Pronunciation Trainer)	artikulate -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/blinken.png	Blinken (Memory Enhancement Game)	blinken
	IMG:/home/box/.cache/xdg-xmenu/icons/cantor.png	Cantor (Frontend to Mathematical Software)	cantor -qwindowicon cantor -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kalgebra.png	KAlgebra (Graph Calculator)	kalgebra
	IMG:/home/box/.cache/xdg-xmenu/icons/kalgebra.png	KAlgebra Mobile (Pocket Graph Calculator)	kalgebramobile
	IMG:/home/box/.cache/xdg-xmenu/icons/kalzium.png	Kalzium (Periodic Table of Elements)	kalzium -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kanagram.png	Kanagram (Letter Order Game)	kanagram
	IMG:/home/box/.cache/xdg-xmenu/icons/kbruch.png	KBruch (Exercise Fractions)	kbruch -qwindowtitle -qwindowicon kbruch
	IMG:/home/box/.cache/xdg-xmenu/icons/marble.png	KDE Marble (Virtual Globe)	marble
	IMG:/home/box/.cache/xdg-xmenu/icons/kgeography.png	KGeography (Geography Trainer)	kgeography
	IMG:/home/box/.cache/xdg-xmenu/icons/khangman.png	KHangMan (Hangman Game)	khangman -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kig.png	Kig (Interactive Geometry)	kig --qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kiten.png	Kiten (Japanese Reference/Study Tool)	kiten -qwindowtitle -qwindowicon kiten
	IMG:/home/box/.cache/xdg-xmenu/icons/klettres.png	KLettres (Learn The Alphabet)	klettres -qwindowtitle -qwindowicon klettres
	IMG:/home/box/.cache/xdg-xmenu/icons/kmplot.png	KmPlot (Mathematical Function Plotter)	kmplot
	IMG:/home/box/.cache/xdg-xmenu/icons/ktouch.png	KTouch (Touch Typing Tutor)	ktouch
	IMG:/home/box/.cache/xdg-xmenu/icons/kturtle.png	KTurtle (Educational Programming Environment)	kturtle -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kwordquiz.png	KWordQuiz (Flash Card Trainer)	kwordquiz -qwindowtitle -qwindowicon kwordquiz
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-math.png	LibreOffice Math (Formula Editor)	libreoffice --math
	IMG:/home/box/.cache/xdg-xmenu/icons/minuet.png	Minuet (Music Education Software)	minuet
	IMG:/home/box/.cache/xdg-xmenu/icons/parley.png	Parley (Vocabulary Trainer)	parley
	IMG:/home/box/.cache/xdg-xmenu/icons/rocs.png	Rocs (Rocs Graph Theory)	rocs -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/step.png	Step (Interactive Physical Simulator)	step -qwindowtitle -qwindowicon step
IMG:/home/box/.cache/xdg-xmenu/icons/applications-games.png	Games
	IMG:/home/box/.cache/xdg-xmenu/icons/blinken.png	Blinken (Memory Enhancement Game)	blinken
	IMG:/home/box/.cache/xdg-xmenu/icons/bomber.png	Bomber (Arcade Bombing Game)	bomber -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/bovo.png	Bovo (Five-in-a-row Board Game)	bovo -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Chess (Chess Game)	gnome-chess
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Five or More	five-or-more
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Four-in-a-row	four-in-a-row
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Games (Video game player)	gnome-games
	IMG:/home/box/.cache/xdg-xmenu/icons/granatier.png	Granatier (Bomberman clone)	granatier
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Hitori	hitori
	IMG:/home/box/.cache/xdg-xmenu/icons/kajongg.png	Kajongg (Mahjong tile game from China)	kajongg
	IMG:/home/box/.cache/xdg-xmenu/icons/kanagram.png	Kanagram (Letter Order Game)	kanagram
	IMG:/home/box/.cache/xdg-xmenu/icons/kapman.png	Kapman (Pac-Man Clone)	kapman
	IMG:/home/box/.cache/xdg-xmenu/icons/katomic.png	KAtomic (Sokoban-like Logic Game)	katomic -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kblackbox.png	KBlackBox (Blackbox Logic Game)	kblackbox -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kblocks.png	KBlocks (Falling Blocks Game)	kblocks -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kbounce.png	KBounce (Ball Bouncing Game)	kbounce -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kbreakout.png	KBreakOut (Breakout-like Game)	kbreakout -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kdiamond.png	KDiamond (Three-in-a-row game)	kdiamond -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kfourinline.png	KFourInLine (Four-in-a-row Board Game)	kfourinline
	IMG:/home/box/.cache/xdg-xmenu/icons/kgoldrunner.png	KGoldrunner (Hunt Gold, Dodge Enemies and Solve Puzzles)	kgoldrunner
	IMG:/home/box/.cache/xdg-xmenu/icons/khangman.png	KHangMan (Hangman Game)	khangman -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kigo.png	Kigo (Go Board Game)	kigo -qwindowicon kigo -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/killbots.png	Killbots (Strategy Game with Robots)	killbots -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kiriki.png	Kiriki (Yahtzee-like Dice Game)	kiriki -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kjumpingcube.png	KJumpingCube (Territory Capture Game)	kjumpingcube -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/klickety.png	Klickety (Board Game)	klickety -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Klotski	gnome-klotski
	IMG:/home/box/.cache/xdg-xmenu/icons/kmahjongg.png	KMahjongg (Mahjongg Solitaire)	kmahjongg -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kmines.png	KMines (Minesweeper-like Game)	kmines -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/knetwalk.png	KNetWalk (Network Construction Game)	knetwalk -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/knights.png	Knights (Chess game)	knights -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kolf.png	Kolf (Miniature Golf)	kolf
	IMG:/home/box/.cache/xdg-xmenu/icons/kollision.png	Kollision (A simple ball dodging game)	kollision
	IMG:/home/box/.cache/xdg-xmenu/icons/klines.png	Kolor Lines (Tactical Game)	klines -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/konquest.png	Konquest (Galactic Strategy Game)	konquest -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kpat.png	KPatience (Patience Card Game)	kpat -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kreversi.png	KReversi (Reversi Board Game)	kreversi -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/preferences-desktop-locale.png	KsirK Skin Editor (Skin Editor for the World Domination Strategy Game)	ksirkskineditor -qwindowtitle -qwindowicon preferences-desktop-locale
	IMG:/home/box/.cache/xdg-xmenu/icons/ksirk.png	KsirK (World Domination Strategy Game)	ksirk -qwindowtitle -qwindowicon ksirk
	IMG:/home/box/.cache/xdg-xmenu/icons/ksnakeduel.png	KSnakeDuel (A race in hyperspace)	ksnakeduel
	IMG:/home/box/.cache/xdg-xmenu/icons/kspaceduel.png	KSpaceDuel (Space Arcade Game)	kspaceduel -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/ksquares.png	KSquares (Connect the dots to create squares)	ksquares -qwindowicon ksquares -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/ksudoku.png	KSudoku (Sudoku Game)	ksudoku -qwindowicon ksudoku -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kubrick.png	Kubrick (3-D Game based on Rubik's Cube)	kubrick
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Lights Off	lightsoff
	IMG:/home/box/.cache/xdg-xmenu/icons/lskat.png	LSkat (Classic German Card Game)	lskat
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Mahjongg	gnome-mahjongg
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Mines	gnome-mines
	IMG:/home/box/.cache/xdg-xmenu/icons/knavalbattle.png	Naval Battle (Ship Sinking Game)	knavalbattle -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Nibbles	gnome-nibbles
	IMG:/home/box/.cache/xdg-xmenu/icons/palapeli.png	Palapeli (Jigsaw puzzle game)	palapeli
	IMG:/home/box/.cache/xdg-xmenu/icons/picmi.png	Picmi (Logic Game)	picmi
	IMG:/home/box/.cache/xdg-xmenu/icons/ktuberling.png	Potato Guy (Picture Game for Children)	ktuberling -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Quadrapassel	quadrapassel
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Reversi (Reversi)	iagno
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Robots	gnome-robots
	IMG:/home/box/.cache/xdg-xmenu/icons/ksame.png	SameGame (Board Game)	klickety --KSameMode -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kshisen.png	Shisen-Sho (Shisen-Sho Mahjongg-like Tile Game)	kshisen -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Sudoku	gnome-sudoku
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Swell Foop	swell-foop
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Tali	tali
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Taquin (15-puzzle)	gnome-taquin
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Tetravex	gnome-tetravex
IMG:/home/box/.cache/xdg-xmenu/icons/applications-graphics.png	Graphics
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Document Scanner	simple-scan
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Document Viewer	evince
	IMG:/home/box/.cache/xdg-xmenu/icons/gwenview.png	Gwenview (KDE Image Viewer)	gwenview
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Image Viewer	eog
	IMG:/home/box/.cache/xdg-xmenu/icons/kcolorchooser.png	KColorChooser (Color Chooser)	kcolorchooser
	IMG:/home/box/.cache/xdg-xmenu/icons/kolourpaint.png	KolourPaint (Paint Program)	kolourpaint
	IMG:/home/box/.cache/xdg-xmenu/icons/org.kde.png	Kontrast	kontrast
	IMG:/home/box/.cache/xdg-xmenu/icons/kruler.png	KRuler (Screen Ruler)	kruler
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-draw.png	LibreOffice Draw (Drawing Program)	libreoffice --draw
	IMG:/home/box/.cache/xdg-xmenu/icons/okular.png	Okular (Document Viewer)	okular
	IMG:/home/box/.cache/xdg-xmenu/icons/qimgv.png	qimgv (Image Viewer)	qimgv
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Ristretto Image Viewer (Image Viewer)	ristretto
	IMG:/home/box/.cache/xdg-xmenu/icons/org.kde.png	Skanlite (Image Scanning Application)	skanlite
	IMG:/home/box/.cache/xdg-xmenu/icons/skanpage.png	Skanpage (Image Scanning Application)	skanpage
IMG:/home/box/.cache/xdg-xmenu/icons/applications-internet.png	Internet
	IMG:/home/box/.cache/xdg-xmenu/icons/akregator.png	Akregator (Feed Reader)	akregator
	IMG:/home/box/.cache/xdg-xmenu/icons/network-wired.png	Avahi SSH Server Browser	/usr/bin/bssh
	IMG:/home/box/.cache/xdg-xmenu/icons/network-wired.png	Avahi VNC Server Browser	/usr/bin/bvnc
	IMG:/home/box/.cache/xdg-xmenu/icons/brave-desktop.png	Brave (Web Browser)	brave
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Connections	gnome-connections
	IMG:/home/box/.cache/xdg-xmenu/icons/kaddressbook.png	Contact Print Theme Editor (Contact Print Theme Editor)	contactprintthemeeditor
	IMG:/home/box/.cache/xdg-xmenu/icons/kaddressbook.png	Contact Theme Editor (Contact Theme Editor)	contactthemeeditor
	IMG:/home/box/.cache/xdg-xmenu/icons/discord.png	Discord (Internet Messenger)	env XDG_CURRENT_DESKTOP=Unity /usr/bin/discord
	IMG:/home/box/.cache/xdg-xmenu/icons/falkon.png	Falkon (Web Browser)	falkon
	IMG:/home/box/.cache/xdg-xmenu/icons/firefox.png	Firefox (Web Browser)	/usr/lib/firefox/firefox
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Geary (Email)	geary
	IMG:/home/box/.cache/xdg-xmenu/icons/telepathy-kde.png	IM Contacts (Instant Messenger Contacts)	ktp-contactlist
	IMG:/home/box/.cache/xdg-xmenu/icons/kdeconnect.png	KDE Connect (Device Synchronization)	kdeconnect-app
	IMG:/home/box/.cache/xdg-xmenu/icons/kdeconnect.png	KDE Connect Indicator	kdeconnect-indicator
	IMG:/home/box/.cache/xdg-xmenu/icons/kdeconnect.png	KDE Connect SMS (SMS)	kdeconnect-sms
	IMG:/home/box/.cache/xdg-xmenu/icons/kde-im-log-viewer.png	KDE IM Log Viewer (KDE Instant Messenger Log Viewer)	ktp-log-viewer
	IMG:/home/box/.cache/xdg-xmenu/icons/kget.png	KGet (Download Manager)	kget -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kmail.png	KMail Header Theme Editor (Mail Header Theme Editor)	headerthemeeditor
	IMG:/home/box/.cache/xdg-xmenu/icons/kmail.png	KMail (Mail Client)	kmail -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kmail.png	KMail Refresh Settings (KMail refresh settings)	kmail-refresh-settings -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/konqueror.png	Konqueror (Web Browser)	konqueror
	IMG:/home/box/.cache/xdg-xmenu/icons/konversation.png	Konversation (IRC Client)	konversation -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kopete.png	Kopete (Instant Messenger)	kopete -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/krdc.png	KRDC (Remote Desktop Client)	krdc -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/krfb.png	Krfb (Desktop Sharing (VNC))	krfb -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/ktnef.png	KTnef (TNEF File Viewer (proprietary format used by outlook))	ktnef
	IMG:/home/box/.cache/xdg-xmenu/icons/ktorrent.png	KTorrent (BitTorrent Client)	ktorrent
	IMG:/home/box/.cache/xdg-xmenu/icons/kmail.png	MBoxImporter	mboximporter
	IMG:/home/box/.cache/xdg-xmenu/icons/kdeconnect.png	Open on connected device via KDE Connect (Open on connected device via KDE Connect)	kdeconnect-handler --open
	IMG:/home/box/.cache/xdg-xmenu/icons/kontact.png	PIM Data Exporter (Saves and restores all data from PIM apps)	pimdataexporter
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Polari	gapplication launch org.gnome.Polari
	IMG:/home/box/.cache/xdg-xmenu/icons/org.remmina.png	Remmina (Remote Desktop Client)	remmina-file-wrapper
	IMG:/home/box/.cache/xdg-xmenu/icons/kmail.png	Sieve Editor (Editor for email filter Sieve scripts)	sieveeditor
	IMG:/home/box/.cache/xdg-xmenu/icons/synology-drive.png	Synology Drive Client	synology-drive start
	IMG:/home/box/.cache/xdg-xmenu/icons/synology-drive.png	Synology Drive	sh -c 'env "LD_LIBRARY_PATH=$HOME/.SynologyDrive/SynologyDrive.app/lib/" "$HOME/.SynologyDrive/SynologyDrive.app/bin/cloud-drive-ui" --open-file "'0.000000'"'
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Web (Web Browser)	epiphany
	IMG:/home/box/.cache/xdg-xmenu/icons/Zoom.png	Zoom	/usr/bin/zoom
IMG:/home/box/.cache/xdg-xmenu/icons/applications-multimedia.png	Multimedia
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Cheese (Webcam Booth)	cheese
	IMG:/home/box/.cache/xdg-xmenu/icons/dragonplayer.png	Dragon Player (Video Player)	dragon
	IMG:/home/box/.cache/xdg-xmenu/icons/elisa.png	Elisa (Music Player)	elisa
	IMG:/home/box/.cache/xdg-xmenu/icons/juk.png	JuK (Music Player)	juk
	IMG:/home/box/.cache/xdg-xmenu/icons/k3b.png	K3b (Disk Burning)	k3b
	IMG:/home/box/.cache/xdg-xmenu/icons/kamoso.png	Kamoso (Camera)	kamoso -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kdenlive.png	Kdenlive (Video Editor)	kdenlive
	IMG:/home/box/.cache/xdg-xmenu/icons/kwave.png	Kwave Sound Editor (Sound Editor)	kwave
	IMG:/home/box/.cache/xdg-xmenu/icons/mpv.png	mpv Media Player (Multimedia player)	mpv --player-operation-mode=pseudo-gui --
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Music (Music Player)	gnome-music
	IMG:/home/box/.cache/xdg-xmenu/icons/multimedia-volume-control.png	PulseAudio Volume Control (Volume Control)	pavucontrol
	IMG:/home/box/.cache/xdg-xmenu/icons/qv4l2.png	Qt V4L2 test Utility	qv4l2
	IMG:/home/box/.cache/xdg-xmenu/icons/qvidcap.png	Qt V4L2 video capture utility	qvidcap
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Sound Recorder	gnome-sound-recorder
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Videos	totem
	IMG:/home/box/.cache/xdg-xmenu/icons/vlc.png	VLC media player (Media player)	/usr/bin/vlc --started-from-file
	IMG:/home/box/.cache/xdg-xmenu/icons/multimedia-volume-control.png	Volctl	volctl
	IMG:/home/box/.cache/xdg-xmenu/icons/stock_xfburn.png	Xfburn (Disk Burning)	xfburn
IMG:/home/box/.cache/xdg-xmenu/icons/applications-office.png	Office
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Calendar	gnome-calendar
	IMG:/home/box/.cache/xdg-xmenu/icons/kaddressbook.png	Contact Print Theme Editor (Contact Print Theme Editor)	contactprintthemeeditor
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Contacts	gnome-contacts
	IMG:/home/box/.cache/xdg-xmenu/icons/kaddressbook.png	Contact Theme Editor (Contact Theme Editor)	contactthemeeditor
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Dictionary (Dictionary Client)	xfce4-dict
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Document Viewer	evince
	IMG:/home/box/.cache/xdg-xmenu/icons/evolution.png	Evolution (Groupware Suite)	evolution
	IMG:/home/box/.cache/xdg-xmenu/icons/kaddressbook.png	KAddressBook (Contact Manager)	kaddressbook
	IMG:/home/box/.cache/xdg-xmenu/icons/org.kde.png	Kalendar (Calendar application)	kalendar
	IMG:/home/box/.cache/xdg-xmenu/icons/kmail.png	KMail Header Theme Editor (Mail Header Theme Editor)	headerthemeeditor
	IMG:/home/box/.cache/xdg-xmenu/icons/kmail.png	KMail (Mail Client)	kmail -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kmail.png	KMail Refresh Settings (KMail refresh settings)	kmail-refresh-settings -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kontact.png	Kontact (Personal Information Manager)	kontact
	IMG:/home/box/.cache/xdg-xmenu/icons/korganizer.png	KOrganizer (Personal Organizer)	korganizer
	IMG:/home/box/.cache/xdg-xmenu/icons/ktnef.png	KTnef (TNEF File Viewer (proprietary format used by outlook))	ktnef
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-base.png	LibreOffice Base (Database Development)	libreoffice --base
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-calc.png	LibreOffice Calc (Spreadsheet)	env GTK_THEME=Adwaita libreoffice --calc
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-calc.png	LibreOffice Calc (Spreadsheet)	libreoffice --calc
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-draw.png	LibreOffice Draw (Drawing Program)	libreoffice --draw
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-impress.png	LibreOffice Impress (Presentation)	libreoffice --impress
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-math.png	LibreOffice Math (Formula Editor)	libreoffice --math
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-startcenter.png	LibreOffice (Office)	libreoffice
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-writer.png	LibreOffice Writer (Word Processor)	env GTK_THEME=Adwaita libreoffice --writer
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-writer.png	LibreOffice Writer (Word Processor)	libreoffice --writer
	IMG:/home/box/.cache/xdg-xmenu/icons/lokalize.png	Lokalize (Computer-Aided Translation System)	lokalize
	IMG:/home/box/.cache/xdg-xmenu/icons/kmail.png	MBoxImporter	mboximporter
	IMG:/home/box/.cache/xdg-xmenu/icons/okular.png	Okular (Document Viewer)	okular
	IMG:/home/box/.cache/xdg-xmenu/icons/kmail.png	Sieve Editor (Editor for email filter Sieve scripts)	sieveeditor
IMG:/home/box/.cache/xdg-xmenu/icons/applications-science.png	Science
	IMG:/home/box/.cache/xdg-xmenu/icons/cantor.png	Cantor (Frontend to Mathematical Software)	cantor -qwindowicon cantor -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kalgebra.png	KAlgebra (Graph Calculator)	kalgebra
	IMG:/home/box/.cache/xdg-xmenu/icons/kalgebra.png	KAlgebra Mobile (Pocket Graph Calculator)	kalgebramobile
	IMG:/home/box/.cache/xdg-xmenu/icons/kalzium.png	Kalzium (Periodic Table of Elements)	kalzium -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/marble.png	KDE Marble (Virtual Globe)	marble
	IMG:/home/box/.cache/xdg-xmenu/icons/libreoffice-math.png	LibreOffice Math (Formula Editor)	libreoffice --math
	IMG:/home/box/.cache/xdg-xmenu/icons/rocs.png	Rocs (Rocs Graph Theory)	rocs -qwindowtitle
IMG:/home/box/.cache/xdg-xmenu/icons/preferences-desktop.png	Settings
	IMG:/home/box/.cache/xdg-xmenu/icons/mugshot.png	About Me	/usr/bin/mugshot
	IMG:/home/box/.cache/xdg-xmenu/icons/system-software-install.png	Add/Remove Software	pamac-manager
	IMG:/home/box/.cache/xdg-xmenu/icons/preferences-system-network.png	Advanced Network Configuration	nm-connection-editor
	IMG:/home/box/.cache/xdg-xmenu/icons/display.png	ARandR (Screen Settings)	arandr
	IMG:/home/box/.cache/xdg-xmenu/icons/preferences-desktop-theme.png	Customize Look and Feel (Customize Look and Feel)	lxappearance
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	File Manager Settings	thunar-settings
	IMG:/home/box/.cache/xdg-xmenu/icons/ibus-setup.png	IBus Preferences	ibus-setup
	IMG:/home/box/.cache/xdg-xmenu/icons/kdeconnect.png	KDE Connect Settings (Connect and sync your devices)	kdeconnect-settings
	IMG:/home/box/.cache/xdg-xmenu/icons/preferences-system.png	KDE System Settings (KDE System Settings)	systemsettings5
	IMG:/home/box/.cache/xdg-xmenu/icons/kvantum.png	Kvantum Manager	kvantummanager
	IMG:/home/box/.cache/xdg-xmenu/icons/alacarte.png	Main Menu	alacarte
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Power Manager (Power Manager)	xfce4-power-manager-settings
	IMG:/home/box/.cache/xdg-xmenu/icons/printer.png	Print Settings (Print Settings)	system-config-printer
	IMG:/home/box/.cache/xdg-xmenu/icons/multimedia-volume-control.png	PulseAudio Volume Control (Volume Control)	pavucontrol
	IMG:/home/box/.cache/xdg-xmenu/icons/preferences-desktop-theme.png	Qt5 Settings	qt5ct
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Removable Drives and Media	thunar-volman-settings
	IMG:/home/box/.cache/xdg-xmenu/icons/rygel.png	Rygel Preferences (UPnP/DLNA Preferences)	rygel-preferences
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Text Editor Settings	mousepad --preferences
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Xfce Terminal Settings	xfce4-terminal --preferences
IMG:/home/box/.cache/xdg-xmenu/icons/applications-system.png	System
	IMG:/home/box/.cache/xdg-xmenu/icons/system-software-install.png	Add/Remove Software	pamac-manager
	IMG:/home/box/.cache/xdg-xmenu/icons/Alacritty.png	Alacritty (Terminal)	alacritty
	IMG:/home/box/.cache/xdg-xmenu/icons/network-wired.png	Avahi Zeroconf Browser	/usr/bin/avahi-discover
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Boxes (Virtual machine viewer/manager)	gnome-boxes
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Bulk Rename (Bulk Rename)	thunar --bulk-rename
	IMG:/home/box/.cache/xdg-xmenu/icons/gnome-color-manager.png	Color Profile Viewer	gcm-viewer
	IMG:/home/box/.cache/xdg-xmenu/icons/conky-logomark-violet.png	conky	conky --daemonize --pause=1
	IMG:/home/box/.cache/xdg-xmenu/icons/ca.desrt.png	dconf Editor (Configuration editor for dconf)	dconf-editor
	IMG:/home/box/.cache/xdg-xmenu/icons/plasmadiscover.png	Discover (Software Center)	plasma-discover
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Disk Usage Analyzer	baobab
	IMG:/home/box/.cache/xdg-xmenu/icons/system-file-manager.png	Dolphin (File Manager)	dolphin
	IMG:/home/box/.cache/xdg-xmenu/icons/fish.png	fish	xterm -e fish
	IMG:/home/box/.cache/xdg-xmenu/icons/hwloc.png	Hardware Locality lstopo	lstopo
	IMG:/home/box/.cache/xdg-xmenu/icons/partitionmanager.png	KDE Partition Manager (Partition Editor)	partitionmanager
	IMG:/home/box/.cache/xdg-xmenu/icons/kdf.png	KDiskFree (View Disk Usage)	kdf -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kitty.png	kitty (Terminal emulator)	kitty
	IMG:/home/box/.cache/xdg-xmenu/icons/utilities-terminal.png	Konsole (Terminal)	konsole
	IMG:/home/box/.cache/xdg-xmenu/icons/utilities-log-viewer.png	KSystemLog (System Log Viewer)	ksystemlog -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kwalletmanager.png	KWalletManager (KDE Wallet Management Tool)	kwalletmanager5
	IMG:/home/box/.cache/xdg-xmenu/icons/kwikdisk.png	KwikDisk (Removable Media Utility)	kwikdisk -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Logs (Log Viewer)	gnome-logs
	IMG:/home/box/.cache/xdg-xmenu/icons/cups.png	Manage Printing	/usr/bin/xdg-open http://localhost:631/
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	MultiWriter	gnome-multi-writer
	IMG:/home/box/.cache/xdg-xmenu/icons/gnome-nettool.png	Network Tools (Network information tools)	gnome-nettool
	IMG:/home/box/.cache/xdg-xmenu/icons/java11-openjdk.png	OpenJDK Java 11 Console	/usr/lib/jvm/java-11-openjdk/bin/jconsole
	IMG:/home/box/.cache/xdg-xmenu/icons/java11-openjdk.png	OpenJDK Java 11 Shell	xterm -e /usr/lib/jvm/java-11-openjdk/bin/jshell
	IMG:/home/box/.cache/xdg-xmenu/icons/java17-openjdk.png	OpenJDK Java 17 Console	/usr/lib/jvm/java-17-openjdk/bin/jconsole
	IMG:/home/box/.cache/xdg-xmenu/icons/java17-openjdk.png	OpenJDK Java 17 Shell	xterm -e /usr/lib/jvm/java-17-openjdk/bin/jshell
	IMG:/home/box/.cache/xdg-xmenu/icons/java18-openjdk.png	OpenJDK Java 18 Console	/usr/lib/jvm/java-18-openjdk/bin/jconsole
	IMG:/home/box/.cache/xdg-xmenu/icons/java18-openjdk.png	OpenJDK Java 18 Shell	xterm -e /usr/lib/jvm/java-18-openjdk/bin/jshell
	IMG:/home/box/.cache/xdg-xmenu/icons/org.freedesktop.png	Parental Controls	malcontent-control
	IMG:/home/box/.cache/xdg-xmenu/icons/printer.png	Print Settings (Print Settings)	system-config-printer
	IMG:/home/box/.cache/xdg-xmenu/icons/xfce-sensors.png	Sensor Viewer (Sensor Values Viewer)	xfce4-sensors
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Software	gnome-software
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	System Monitor	gnome-system-monitor
	IMG:/home/box/.cache/xdg-xmenu/icons/utilities-system-monitor.png	System Monitor (System Monitor)	plasma-systemmonitor
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Task Manager (Task Manager)	xfce4-taskmanager
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Terminal	gnome-terminal
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Thunar File Manager (File Manager)	thunar
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Usage	gnome-usage
	IMG:/home/box/.cache/xdg-xmenu/icons/xterm-color_48x48.png	UXTerm	uxterm
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Xfce Terminal (Terminal Emulator)	xfce4-terminal
	IMG:/home/box/.cache/xdg-xmenu/icons/xterm-color_48x48.png	XTerm	xterm
	IMG:/home/box/.cache/xdg-xmenu/icons/yakuake.png	Yakuake (Drop-down Terminal)	yakuake
IMG:/home/box/.cache/xdg-xmenu/icons/applications-other.png	Others
	IMG:/home/box/.cache/xdg-xmenu/icons/synology-note-station.png	Synology Note Station Client	"/opt/synology-note-station/launch.sh"
EOF
