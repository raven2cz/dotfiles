settings =
  config:
    brightness:
      type: 'string'
      default: 'Dark'
      enum: ["Dark", "Light"]
    contrast:
      type: 'string'
      default: 'Medium'
      enum: ["Hard", "Medium", "Soft"]
    variant:
      type: 'string'
      default: 'Default'
      enum: ["Default", "No Dimmed Colors"]
module.exports = settings
