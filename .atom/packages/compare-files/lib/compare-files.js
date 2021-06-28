//
// * compare-files
// * https://github.com/floydpink/atom-compare-files
// *
// * Copyright (c) 2014 floydpink
// * Licensed under the MIT license.
//
'use strict';

var plugin = module.exports;
var _ = require('lodash');
var url = require('url');
var util = require('util');
var CompareFilesView = require('./compare-files-view');

var resetStatusBar = function (statusTile) {
  statusTile.destroy();
};

var createStatusMessage = function (message, type) {
  var statusEl = document.createElement('span');
  statusEl.setAttribute('id', 'compare-files-status-bar');
  statusEl.setAttribute('class', 'inline-block');

  statusEl.textContent = message;
  statusEl.type = type;

  return statusEl;
};

var setStatusMessage = function (message, type) {
  var statusBar = atom.packages.getActivePackage('status-bar').mainModule.statusBar,
      statusTileConfig = {
          item: createStatusMessage(message, type),
          priority: 100
      },
      statusTile;

  statusTile = statusBar.addLeftTile(statusTileConfig);
  _.delay(resetStatusBar, 5000, statusTile); // Clear the status bar after 5 seconds
};

var registerOpener = function () {
  atom.workspace.addOpener(function (uriToOpen) {
    var parsedUrl = url.parse(uriToOpen);
    var protocol = parsedUrl.protocol;
    var host = parsedUrl.host;
    var pathname = parsedUrl.pathname;

    if (pathname) {
      //HACK Check if pathname contains '%' character
      if (pathname.indexOf('%') != -1) {
        // Replace the '%' character with encoded value
        pathname = pathname.replace('%', encodeURIComponent('%'));
      }
      pathname = decodeURI(pathname);
    }
    if (protocol !== 'compare-files:') {
      return;
    }
    if (host === 'editor') {
      return new CompareFilesView({
        filesName : pathname.substring(1)
      });
    }
  });
};

var compare = function () {
  var treeViewPackage = atom.packages.getActivePackage('tree-view'),
      selectedFilePaths;

  // Do nothing if the treeview does not exist
  if (treeViewPackage) {
      selectedFilePaths = treeViewPackage.mainModule.treeView.selectedPaths();

      if (selectedFilePaths.length !== 2) {
        setStatusMessage('Compare Files: Select the two files to compare in the tree view.', 'warn');
        return;
      }

      var uri = util.format('compare-files://editor/%s...%s', selectedFilePaths[0], selectedFilePaths[1]);

      atom.workspace.
          open(uri, { searchAllPanes : true }).
          then(function (compareFilesView) {
            if (compareFilesView instanceof CompareFilesView) {
              _.delay(function () {
                compareFilesView.renderDiffContent();
                setStatusMessage(util.format('Compare Files: Diff between %s and %s',
                    compareFilesView.filename1, compareFilesView.filename2), 'info');
              }, 100);
            }
          });
  }
};

plugin.activate = function () {
  registerOpener();
  atom.commands.add('atom-workspace','compare-files:compare', compare);
};
