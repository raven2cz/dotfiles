'use babel';

import { Disposable } from 'atom';
import colors from '../data/colors';

export default class Provider extends Disposable {
	constructor() {
		super();
		this.selector =
			'.text.html.basic, .source.js, .source.css, .source.css.less, .source.css.scss, .source.sass, .source.stylus, .source.jsx';
		this.suggestionPriority = 0;
	}

	getSuggestions({ prefix, bufferPosition, editor }) {
		const line = editor.getTextInRange([
			[bufferPosition.row, 0],
			bufferPosition
		]);

		if (line.includes('#mc')) {
			let suggestions = [];
			for (let color in colors) {
				suggestions.push({
					replacementPrefix: '#mc',
					text: colors[color],
					leftLabelHTML: `<div style="background-color:${
						colors[color]
					}" class="color-preview"></div>`,
					rightLabelHTML: `<div class="color-name">${color}</div>`
				});
			}
			return suggestions;
		}
		return [];
	}
}
