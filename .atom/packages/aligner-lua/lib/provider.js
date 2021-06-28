module.exports = {
  selector: ['.source.lua'],
  id: 'aligner-lua', // package name
  config: {
    '=-alignment': {
      title: 'Padding for =',
      description: 'Pad left or right of the character',
      type: 'string',
      enum: ['left', 'right'],
      default: 'left'
    },
    '=-leftSpace': {
      title: 'Left space for =',
      description: 'Add 1 whitespace to the left',
      type: 'boolean',
      default: true
    },
    '=-rightSpace': {
      title: 'Right space for =',
      description: 'Add 1 whitespace to the right',
      type: 'boolean',
      default: true
    }
  },
  privateConfig: {
    '=-scope': 'operator'
  }
};
