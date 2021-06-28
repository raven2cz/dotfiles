'use babel'
const FS = require('fs')
const Path = require('path')
const View = require('./view')
import {installPackages} from './helper'

window.__sb_package_deps = window.__sb_package_deps || []

export function install(packageName, enablePackages = false) {
  if (!packageName) throw new Error('packageName is required')

  const packageDeps = atom.packages.getLoadedPackage(packageName).metadata['package-deps'] || []
  const packagesToInstall = []
  packageDeps.forEach(function(name) {
    if (__sb_package_deps.indexOf(name) === -1) {
      __sb_package_deps.push(name)
      if (!atom.packages.resolvePackagePath(name)) {
        packagesToInstall.push(name)
      } else if(!atom.packages.getActivePackage(name) && enablePackages) {
        atom.packages.enablePackage(name)
        atom.packages.activatePackage(name)
      }
    }
  })
  if (packagesToInstall.length) {
    return installPackage(packageName, packagesToInstall)
  } else return Promise.resolve()
}

export function installPackage(packageName, packageNames) {
  const view = new View(packageName, packageNames)
  return view.createNotification().then(() =>
    installPackages(packageNames, function(name) {
      view.markFinished()
      atom.packages.enablePackage(name)
      atom.packages.activatePackage(name)
    }, function(detail) {
      view.notification.dismiss()
      atom.notifications.addError(`Error installing ${packageName} dependencies`, {detail})
    })
  )
}
