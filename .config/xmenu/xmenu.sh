#!/bin/sh

myKernel=$(uname -r)

cat <<EOF | xmenu | sh &
$myKernel	urxvt

Shutdown		poweroff
Reboot			reboot

IMG:/home/box/.cache/xdg-xmenu/icons/kitty.png	kitty (Terminal emulator)	kitty
IMG:/home/box/.cache/xdg-xmenu/icons/Alacritty.png	Alacritty (Terminal)	alacritty
IMG:/home/box/.cache/xdg-xmenu/icons/utilities-terminal.png	urxvt	urxvt

IMG:/home/box/.cache/xdg-xmenu/icons/firefox.png	Firefox (Web Browser)	/usr/lib/firefox/firefox
IMG:/home/box/.cache/xdg-xmenu/icons/krusader_user.png	Krusader (File Manager)	krusader -qwindowtitle
IMG:/home/box/.cache/xdg-xmenu/icons/system-file-manager.png	Dolphin (File Manager)	dolphin
IMG:/home/box/.cache/xdg-xmenu/icons/idea.png	IntelliJ IDEA Ultimate Edition	"/home/box/ide/idea-IU-203.7717.56/bin/idea.sh"
IMG:/home/box/.cache/xdg-xmenu/icons/webstorm.png	WebStorm	"/home/box/ide/WebStorm-203.7717.59/bin/webstorm.sh"
IMG:/home/box/.cache/xdg-xmenu/icons/clion.png	CLion	"/home/box/ide/clion-2021.1.3/bin/clion.sh"

IMG:/home/box/.cache/xdg-xmenu/icons/applications-accessories.png	Accessories
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Application Finder	xfce4-appfinder
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Archive Manager	file-roller
	IMG:/home/box/.cache/xdg-xmenu/icons/ark.png	Ark (Archiving Tool)	ark
	IMG:/home/box/.cache/xdg-xmenu/icons/atom.png	Atom (Text Editor)	env ATOM_DISABLE_SHELLING_OUT_FOR_ENVIRONMENT=false /usr/bin/atom
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Books	gnome-books
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Bulk Rename (Bulk Rename)	thunar --bulk-rename
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Calculator	gnome-calculator
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Characters	/usr/bin/gnome-characters
	IMG:/home/box/.cache/xdg-xmenu/icons/clipit-trayicon-offline.png	ClipIt	clipit
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Clocks (Clocks)	gnome-clocks
	IMG:/home/box/.cache/xdg-xmenu/icons/conky-manager2.png	Conky Manager (Conky Theme Manager)	conky-manager2
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Connections	gnome-connections
	IMG:/home/box/.cache/xdg-xmenu/icons/copyq.png	CopyQ (Clipboard Manager)	copyq --start-server show
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Disks	gnome-disks
	IMG:/home/box/.cache/xdg-xmenu/icons/filelight.png	Filelight (Disk Usage Statistics)	filelight
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Files	nautilus --new-window
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Fonts	gnome-font-viewer
	IMG:/home/box/.cache/xdg-xmenu/icons/hp_logo.png	HP Device Manager (Printer Management Application)	hp-toolbox
	IMG:/home/box/.cache/xdg-xmenu/icons/ipython.png	ipython (IPython)	xterm -e ipython
	IMG:/home/box/.cache/xdg-xmenu/icons/kalarm.png	KAlarm (Personal Alarm Scheduler)	kalarm
	IMG:/home/box/.cache/xdg-xmenu/icons/kate.png	Kate (Advanced Text Editor)	kate -b
	IMG:/home/box/.cache/xdg-xmenu/icons/kbackup.png	KBackup (Backup Program)	kbackup
	IMG:/home/box/.cache/xdg-xmenu/icons/accessories-calculator.png	KCalc (Scientific Calculator)	kcalc
	IMG:/home/box/.cache/xdg-xmenu/icons/accessories-character-map.png	KCharSelect (Character Selector)	kcharselect --qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/itinerary.png	KDE Itinerary (Itinerary management)	itinerary
	IMG:/home/box/.cache/xdg-xmenu/icons/kfloppy.png	KFloppy (Floppy Formatter)	kfloppy -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kgpg.png	KGpg (Encryption Tool)	kgpg
	IMG:/home/box/.cache/xdg-xmenu/icons/kleopatra.png	Kleopatra (Certificate Manager and Unified Crypto GUI)	kleopatra
	IMG:/home/box/.cache/xdg-xmenu/icons/klipper.png	Klipper (Clipboard Tool)	klipper
	IMG:/home/box/.cache/xdg-xmenu/icons/kmag.png	KMag (Screen Magnifier)	kmag
	IMG:/home/box/.cache/xdg-xmenu/icons/kontact-import-wizard.png	KMail Import Wizard	akonadiimportwizard
	IMG:/home/box/.cache/xdg-xmenu/icons/kmousetool.png	KMouseTool (Automatic Mouse Click)	kmousetool -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kmouth.png	KMouth (Speech Synthesizer Frontend)	kmouth
	IMG:/home/box/.cache/xdg-xmenu/icons/knotes.png	KNotes (Popup Notes)	knotes
	IMG:/home/box/.cache/xdg-xmenu/icons/krusader_user.png	Krusader (File Manager)	krusader -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kteatime.png	KTeaTime (Tea Cooker)	kteatime
	IMG:/home/box/.cache/xdg-xmenu/icons/ktimer.png	KTimer (Countdown Launcher)	ktimer
	IMG:/home/box/.cache/xdg-xmenu/icons/kvantum.png	Kvantum Manager	kvantummanager
	IMG:/home/box/.cache/xdg-xmenu/icons/kwrite.png	KWrite (Text Editor)	kwrite
	IMG:/home/box/.cache/xdg-xmenu/icons/lightdm-gtk-greeter-settings.png	LightDM GTK+ Greeter settings	lightdm-gtk-greeter-settings-pkexec
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Logs (Log Viewer)	gnome-logs
	IMG:/home/box/.cache/xdg-xmenu/icons/alacarte.png	Main Menu	alacarte
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Maps	gapplication launch org.gnome.Maps
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Mousepad (Text Editor)	mousepad
	IMG:/home/box/.cache/xdg-xmenu/icons/nvim.png	Neovim (Text Editor)	xterm -e nvim
	IMG:/home/box/.cache/xdg-xmenu/icons/gnome-nettool.png	Network Tools (Network information tools)	gnome-nettool
	IMG:/home/box/.cache/xdg-xmenu/icons/nitrogen.png	nitrogen (Wallpaper Setter)	nitrogen
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.seahorse.png	Passwords and Keys	seahorse
	IMG:/home/box/.cache/xdg-xmenu/icons/picom.png	picom (X compositor)	picom
	IMG:/home/box/.cache/xdg-xmenu/icons/qtpass.png	QtPass (Password Manager)	qtpass
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Recipes	gnome-recipes
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Screenshot	gnome-screenshot --interactive
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Screenshot	xfce4-screenshooter
	IMG:/home/box/.cache/xdg-xmenu/icons/xfce-sensors.png	Sensor Viewer (Sensor Values Viewer)	xfce4-sensors
	IMG:/home/box/.cache/xdg-xmenu/icons/spectacle.png	Spectacle (Screenshot Capture Utility)	/usr/bin/spectacle
	IMG:/home/box/.cache/xdg-xmenu/icons/sweeper.png	Sweeper (System Cleaner)	sweeper
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Task Manager (Task Manager)	xfce4-taskmanager
	IMG:/home/box/.cache/xdg-xmenu/icons/terminator.png	Terminator	terminator
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Text Editor	gedit
	IMG:/home/box/.cache/xdg-xmenu/icons/org.xfce.png	Thunar File Manager (File Manager)	thunar
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	To Do	gnome-todo
	IMG:/home/box/.cache/xdg-xmenu/icons/gvim.png	Vim (Text Editor)	xterm -e vim
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Weather	gapplication launch org.gnome.Weather
	IMG:/home/box/.cache/xdg-xmenu/icons/xarchiver.png	Xarchiver (Archive manager)	xarchiver
	IMG:/home/box/.cache/xdg-xmenu/icons/stock_xfburn.png	Xfburn (Disk Burning)	xfburn
IMG:/home/box/.cache/xdg-xmenu/icons/applications-development.png	Development
	IMG:/home/box/.cache/xdg-xmenu/icons/accerciser.png	Accerciser	accerciser
	IMG:/home/box/.cache/xdg-xmenu/icons/akonadiconsole.png	Akonadi Console	akonadiconsole
	IMG:/home/box/.cache/xdg-xmenu/icons/atom.png	Atom (Text Editor)	env ATOM_DISABLE_SHELLING_OUT_FOR_ENVIRONMENT=false /usr/bin/atom
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Boxes (Virtual machine viewer/manager)	gnome-boxes
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Builder	gnome-builder
	IMG:/home/box/.cache/xdg-xmenu/icons/cervisia.png	Cervisia (CVS Frontend)	cervisia -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/clion.png	CLion	"/home/box/ide/clion-2021.1.3/bin/clion.sh"
	IMG:/home/box/.cache/xdg-xmenu/icons/CMakeSetup.png	CMake	cmake-gui
	IMG:/home/box/.cache/xdg-xmenu/icons/cppcheck-gui.png	Cppcheck	cppcheck-gui
	IMG:/home/box/.cache/xdg-xmenu/icons/cuttlefish.png	Cuttlefish (Icon Viewer)	cuttlefish
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Devhelp (API Documentation Browser)	devhelp
	IMG:/home/box/.cache/xdg-xmenu/icons/electron9.png	Electron 9	electron9
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	GHex (Hex Editor)	ghex
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	gitg	gitg --no-wd
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Glade (Interface Designer)	glade
	IMG:/home/box/.cache/xdg-xmenu/icons/idea.png	IntelliJ IDEA Ultimate Edition	"/home/box/ide/idea-IU-211.6693.111/bin/idea.sh"
	IMG:/home/box/.cache/xdg-xmenu/icons/ipython.png	ipython (IPython)	xterm -e ipython
	IMG:/home/box/.cache/xdg-xmenu/icons/kapptemplate.png	KAppTemplate (App Code Template Generator)	kapptemplate
	IMG:/home/box/.cache/xdg-xmenu/icons/kcachegrind.png	KCachegrind (Profiler Frontend)	kcachegrind -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/kdevelop.png	KDevelop (Integrated Development Environment)	kdevelop
	IMG:/home/box/.cache/xdg-xmenu/icons/kdevelop.png	KDevelop (Pick Session) (Integrated Development Environment (Pick Session to start with))	kdevelop --ps
	IMG:/home/box/.cache/xdg-xmenu/icons/kimagemapeditor.png	KImageMapEditor (HTML Image Map Editor)	kimagemapeditor -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/preferences-desktop-theme.png	Kirigami Gallery	kirigami2gallery
	IMG:/home/box/.cache/xdg-xmenu/icons/kompare.png	Kompare (Diff/Patch Frontend)	kompare -o
	IMG:/home/box/.cache/xdg-xmenu/icons/kuiviewer.png	KUIViewer (Qt Designer UI File Viewer)	kuiviewer -qwindowtitle
	IMG:/home/box/.cache/xdg-xmenu/icons/lokalize.png	Lokalize (Computer-Aided Translation System)	lokalize
	IMG:/home/box/.cache/xdg-xmenu/icons/org.gnome.png	Meld (Diff Viewer)	meld
	IMG:/home/box/.cache/xdg-xmenu/icons/pgAdmin4.png	pgAdmin 4	/usr/lib/pgadmin4/runtime/pgAdmin4
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
	IMG:/home/box/.cache/xdg-xmenu/icons/webstorm.png	WebStorm	"/home/box/ide/WebStorm-203.7717.59/bin/webstorm.sh"
	IMG:/home/box/.cache/xdg-xmenu/icons/wxlualogo.png	wxLua Editor	wxLua
	IMG:/home/box/.cache/xdg-xmenu/icons/zbstudio.png	ZeroBrane Studio (Integrated Development Environment)	zbstudio
IMG:/home/box/.cache/xdg-xmenu/icons/applications-education.png	Education
	IMG:/home/box/.cache/xdg-xmenu/icons/artikulate.png	Artikulate (Artikulate Pronunciation Trainer)	artikulate -qwindowtitle "
EOF
