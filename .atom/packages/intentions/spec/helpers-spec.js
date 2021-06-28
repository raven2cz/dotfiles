/* @flow */

import * as Helpers from '../lib/helpers'

describe('Helpers', function() {
  describe('processListItems', function() {
    it('works', function() {
      let suggestions: Array<Object> = [
        {
          priority: 100,
          title: 'title 1',
          class: 'class1',
          selected() {},
          icon: 'icon1',
        },
        {
          priority: 200,
          title: 'title 2',
          class: 'class2',
          selected() {},
        },
      ]
      suggestions = Helpers.processListItems(suggestions)
      expect(suggestions[0].priority).toBe(200)
      expect(suggestions[0][Helpers.$class]).toBe('class2')
      expect(suggestions[1].priority).toBe(100)
      expect(suggestions[1][Helpers.$class]).toBe('class1 icon icon-icon1')
    })
  })
  describe('showError', function() {
    it('works well with error objects', function() {
      const error = new Error('Something')
      Helpers.showError(error)
      const notification = atom.notifications.getNotifications()[0]
      expect(notification).toBeDefined()
      expect(notification.message).toBe('[Intentions] Something')
      expect(notification.options.detail).toBe(error.stack)
    })
    it('works well with strings', function() {
      const title = 'Some Title'
      const detail = 'Some Detail'

      Helpers.showError(title, detail)
      const notification = atom.notifications.getNotifications()[0]
      expect(notification).toBeDefined()
      expect(notification.message).toBe('[Intentions] ' + title)
      expect(notification.options.detail).toBe(detail)
    })
  })
})
