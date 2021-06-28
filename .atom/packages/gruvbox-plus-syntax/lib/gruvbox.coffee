## Adapted from https://github.com/Alchiadus/base16-syntax

fs = require 'fs'
path = require 'path'
{CompositeDisposable} = require 'atom'

class Gruvbox

  config: require('./gruvbox-settings').config

  activate: ->

    @disposables = new CompositeDisposable
    @packageName = require('../package.json').name
    @disposables.add atom.config.observe "#{@packageName}.brightness", => @enableConfigTheme()
    @disposables.add atom.config.observe "#{@packageName}.contrast", => @enableConfigTheme()
    @disposables.add atom.config.observe "#{@packageName}.variant", => @enableConfigTheme()

  deactivate: ->
    @disposables.dispose()

  enableConfigTheme: ->
    brightness = atom.config.get "#{@packageName}.brightness"
    contrast = atom.config.get "#{@packageName}.contrast"
    variant = atom.config.get "#{@packageName}.variant"
    @enableTheme brightness, contrast, variant

  enableTheme: (brightness, contrast, variant) ->
    # No need to enable the theme if it is already active.
    return if @isActiveTheme brightness, contrast, variant unless @isPreviewConfirmed
    try
      # Write the requested theme to the `syntax-variables` file.
      fs.writeFileSync @getSyntaxVariablesPath(), @getSyntaxVariablesContent(brightness, contrast, variant)
      activePackages = atom.packages.getActivePackages()
      if activePackages.length is 0 or @isPreview
        # Reload own stylesheets to apply the requested theme.
        atom.packages.getLoadedPackage("#{@packageName}").reloadStylesheets()
      else
        # Reload the stylesheets of all packages to apply the requested theme.
        activePackage.reloadStylesheets() for activePackage in activePackages
      @activeBrightness = brightness
      @activeContrast = contrast
      @activeVariant = variant
    catch
      # If unsuccessfull enable the default theme.
      @enableDefaultTheme()

  isActiveTheme: (brightness, contrast, variant) ->
    brightness is @activeBrightness and contrast is @activeContrast and variant is @activeVariant

  getSyntaxVariablesPath: ->
    path.join __dirname, "..", "styles", "syntax-variables.less"

  getSyntaxVariablesContent: (brightness, contrast, variant) ->
    """
    @import 'schemes/#{brightness.toLowerCase()}-#{contrast.toLowerCase()}';
    @import 'schemes/#{brightness.toLowerCase()}';
    @import 'colors';
    @import 'variants/#{@getNormalizedName(variant)}';
    """

  getNormalizedName: (name) ->
    "#{name}"
      .replace /\ /g, '-'
      .toLowerCase()

  enableDefaultTheme: ->
    brightness = atom.config.get "#{@packageName}.brightness"
    contrast = atom.config.get "#{@packageName}.contrast"
    variant = atom.config.get "#{@packageName}.variant"
    @setThemeConfig brightness, contrast, variant

  setThemeConfig: (brightness, contrast, variant) ->
    atom.config.set "#{@packageName}.brightness", brightness
    atom.config.set "#{@packageName}.contrast", contrast
    atom.config.set "#{@packageName}.variant", variant

  isConfigTheme: (brightness, contrast, variant) ->
    configBrightness = atom.config.get "#{@packageName}.brightness"
    configContrast = atom.config.get "#{@packageName}.contrast"
    configVariant = atom.config.get "#{@packageName}.variant"
    brightness is configBrightness and contrast is configContrast and variant is configVariant

module.exports = new Gruvbox
