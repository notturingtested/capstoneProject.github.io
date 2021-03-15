/* @flow */
import getl10nSprintfValueFromTemplateTag from './util/getl10nSprintfValueFromTemplateTag';
import getKeyFromValue from './util/getKeyFromValue';
import sprintf from './util/sprintf';

const l10nifyGlobal = typeof window !== 'undefined' && typeof window.l10nify !== 'undefined' ? window.l10nify : {};
const defaultConfig = {};
defaultConfig.validLocales = l10nifyGlobal.validLocales || ['en_US'];
defaultConfig.translations = l10nifyGlobal.translations || {};
defaultConfig.currentLocale = l10nifyGlobal.currentLocale || 'en_US';
defaultConfig.showL10nTokens = typeof l10nifyGlobal.showL10nTokens === 'boolean' ? l10nifyGlobal.showL10nTokens : false;

if (
	typeof window !== 'undefined' &&
	window.location &&
	window.location.href &&
	window.location.href.includes &&
	window.location.href.includes('showL10nTokens=true')
) {
	defaultConfig.showL10nTokens = true;
}

const documentationCodes = {
	de_DE: 'de-DE',
	en_US: 'en',
	es_ES: 'es-ES',
	fr_FR: 'fr-FR',
	ja_JP: 'ja-JP',
	ko_KR: 'ko-KR',
	pt_BR: 'pt-BR',
	zh_CN: 'zh-Hans',
	zh_TW: 'zh-Hant',
};

// We need separate documentation codes for helpx.adobe.com since they use different locale codes.
const documentationCodesHelpx = {
	de_DE: 'de',
	en_US: 'en',
	es_ES: 'es',
	fr_FR: 'fr',
	ja_JP: 'jp',
	ko_KR: 'kr',
	pt_BR: 'br',
	zh_CN: 'cn',
	zh_TW: 'tw',
};

class L10nConfig {
	constructor({
		validLocales = defaultConfig.validLocales,
		translations = defaultConfig.translations,
		currentLocale = defaultConfig.currentLocale,
		showL10nTokens = defaultConfig.showL10nTokens,
	} = {}) {
		this.validLocales = validLocales;
		this.translations = translations;
		this._currentLocale = currentLocale;
		this.showL10nTokens = showL10nTokens;

		// The translate method is what will be externally available. It needs access to config
		// and thus we will bind it to this. Furthermore, we want to be able to copy the l10n
		// instance at any time and will therefore also assign a "newInstance" method to it.
		// This is particularly important for a node server where we could have multiple instances
		// of l10n with different locales.
		this.translate = this.translate.bind(this);
		this.translate.config = this;

		this.translate.newInstance = (params = {}) => {
			let a = new L10nConfig({
				...{
					validLocales: [...this.validLocales],
					translations: { ...this.translations },
					currentLocale: this.currentLocale,
					showL10nTokens: this.showL10nTokens,
				},
				...params,
			});
			return a.translate;
		};
	}

	get currentLocale() {
		return this._currentLocale;
	}

	set currentLocale(value) {
		if (!this.validLocales.includes(value)) {
			throw new Error(
				`${value} is not a valid locale. Valid locales include ${JSON.stringify(this.validLocales)}`,
			);
		}
		this._currentLocale = value;
	}

	get currentLocaleForDocs() {
		return documentationCodes[this._currentLocale];
	}

	get currentLocaleForHelpx() {
		return documentationCodesHelpx[this._currentLocale];
	}

	//use this as the second parameter for string.localeCompare
	//if you try to use currentLocale for string.localeCompare, it will not work
	get currentIETFLocaleCode() {
		const l10nToLocale = {
			de_DE: 'de',
			en_US: 'en',
			es_ES: 'es',
			fr_FR: 'fr',
			ja_JP: 'ja',
			ko_KR: 'ko',
			pt_BR: 'pt-br',
			zh_CN: 'zh-cn',
			zh_TW: 'zh-tw',
		};
		return l10nToLocale[this._currentLocale];
	}

	update(params) {
		if (!params) {
			return;
		}
		this.validLocales = params.validLocales || this.validLocales;
		this.translations = params.translations || this.translations;
		this._currentLocale = params.currentLocale || this._currentLocale;
		this.showL10nTokens = params.showL10nTokens || this.showL10nTokens;
	}

	translate(value /*: string */, ...replace /*: ?Array<any> */) /*: string */ {
		let key = null;
		if (Array.isArray(value)) {
			value = getl10nSprintfValueFromTemplateTag.apply(null, [value, ...replace]);
		} else {
			// The key is the first value followed by the replace values.
			// This assumes someone called this function like this:
			// l10n('Hello %s World', 'customKey_2342930AAAABBBB', ['Sweet']);
			if (typeof replace[0] === 'string') {
				key = replace[0];
				replace.splice(0, 1);
			}
			// Flatten the array.
			replace = replace.reduce((a, b) => a.concat(b), []);

			// Some functions always pass in a replace value, such as l10n-filter. If they pass in undefined, we want to remove it.
			if (replace.length === 1 && replace[0] === undefined) {
				replace = [];
			}
		}

		key = key || getKeyFromValue(value);

		let translatedValue;
		const translationsByLocale = this.translations[this.currentLocale] || {};
		if (Array.isArray(replace) && replace.length) {
			translatedValue = sprintf(translationsByLocale[key] || value, replace);
		} else {
			translatedValue = translationsByLocale[key] || value;
		}

		if (this.showL10nTokens) {
			const hasKey = Object.prototype.hasOwnProperty.call(translationsByLocale, key);
			return `{Key: ${key} HasKey: ${hasKey} Value: ${translatedValue}}`;
		}

		return translatedValue;
	}
}

let l10nConfig = new L10nConfig();
const l10n = l10nConfig.translate;

// export { l10n as default, L10nConfig };
