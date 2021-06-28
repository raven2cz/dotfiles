#### 1.1.5

- Remove cache introduced in v1.1.3

#### 1.1.4

- Fix a regression from last release

#### 1.1.3

- Cache results until editor text is changed
- Fix a bug where clicking on the list would not fire the callback
- Fix another instance where mixing clicks + keyboard would break the list (Fixes #26)

#### 1.1.2

- Handle double activations gracefully (Fixes #26)
- Add specs for fixes in current and last release

#### 1.1.1

- Fix movement with navigation keys

#### 1.1.0

- Do not overwrite to `.class` on list intentions
- Any other unmentioned commands related bugs previously present
- Use the core movement commands (eg. `core:move-up` `core:move-to-top`, `core:page-up`) to control the intentions list
- Fix a bug where you would have a highlights jam if you clicked on a highlight and it opened a new editor and the keyup event was on that instead of the source

#### 1.0.5

* Change OSX keybinding from `cmd` to `alt` again to match IntelliJ IDEs

#### 1.0.4

* Change OSX keybinding from `alt` to `cmd`

#### 1.0.3

* Automatically update higlight decoration lengths instead of making API consumers do that

#### 1.0.2

* Fix compatibility with fonts using ligas

#### 1.0.1

* Minor UI tweak in menu
* Dismiss menu on mouse click

#### 1.0.0

* Improved package stability and performance
* Rewrote intentions:list providers implementation
* Implemented intentions:highlight service

#### Pre 1.0.0

* Initial API implemented
