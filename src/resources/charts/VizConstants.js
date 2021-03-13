export default {};

let CONSTANTS;

// IMPORTANT NOTE: You can't call this until a chart is being rendered. Otherwise it will not give the body time to get the properties.
export function getConstants() {
	if (CONSTANTS) {
		return CONSTANTS;
	}
	let preferredFonts;

	CONSTANTS = {
		fontFamilies: `adobe-clean, Helvetica, Arial, sans-serif`,
		axisLabelColor: '#b2b2b2',
		axisGridColor: '#ebebeb',
		vizBackgroundColor: '#ffffff',
	};

	if (
		typeof window !== 'undefined' &&
		typeof window.document !== 'undefined' &&
		typeof window.document.body !== 'undefined' &&
		typeof getComputedStyle !== 'undefined'
	) {
		// returns a string similar to: " adobe-clean, "Noto Sans JP", "Noto Sans SC", "Noto Sans TC", "Noto Sans KR"
		CONSTANTS.fontFamilies = `${getComputedStylePropertyValue('--aa-fonts')}, ${CONSTANTS.fontFamilies}`;
		CONSTANTS.axisLabelColor = getComputedStylePropertyValue('--aa-axis-label-color');
		CONSTANTS.axisGridColor = getComputedStylePropertyValue('--aa-axis-grid-color');
		CONSTANTS.vizBackgroundColor = getComputedStylePropertyValue('--aa-viz-bg');
	}

	return CONSTANTS;
}

function getComputedStylePropertyValue(property) {
	return getComputedStyle(document.body)
		.getPropertyValue(property)
		?.trim();
}
