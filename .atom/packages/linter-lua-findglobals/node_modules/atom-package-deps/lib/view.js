'use babel'
export default class PackageDepsView {
  constructor(packageName, packageNames){
    this.packageName = packageName
    this.packageNames = packageNames

    this.progress = document.createElement('progress')
    this.progress.max = packageNames.length
    this.progress.value = 0
    this.progress.classList.add('display-inline')
    this.progress.style.width = '100%'

  }
  createNotification() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.notification = atom.notifications.addInfo(`Installing ${this.packageName} dependencies`, {
          detail: 'Installing ' + this.packageNames.join(', '),
          dismissable: true
        })
        this.notificationEl = atom.views.getView(this.notification)
        this.notificationContentEl = this.notificationEl.querySelector('.detail-content')
        if (this.notificationContentEl) { // Future-proof
          this.notificationContentEl.appendChild(this.progress)
        }
        resolve()
      }, 20)
    })
  }
  markFinished() {
    this.progress.value++
    if (this.progress.value === this.progress.max) {
      const titleEl = this.notificationEl.querySelector('.message p')
      if (titleEl) {
        titleEl.textContent = `Installed ${this.packageName} dependencies`
      }
      this.notificationContentEl.textContent = 'Installed ' + this.packageNames.join(', ')
      this.notificationEl.classList.remove('info')
      this.notificationEl.classList.remove('icon-info')
      this.notificationEl.classList.add('success')
      this.notificationEl.classList.add('icon-check')
    }
  }
}
