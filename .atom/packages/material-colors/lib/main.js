'use babel';

import { CompositeDisposable } from 'atom';
import Provider from './provider';

class MaterialColorAutocomplete {
	constructor() {
		this.provider = null;
		this.subscriptions = null;
	}

	activate() {
		this.subscriptions = new CompositeDisposable();
	}

	deactivate() {
		if (this.subscriptions) {
			this.subscriptions.dispose();
		}
		this.provider = null;
		this.subscriptions = null;
	}

	getProvider() {
		if (this.provider) {
			return this.provider;
		}
		this.provider = new Provider();

		return this.provider;
	}
}

export default new MaterialColorAutocomplete();
