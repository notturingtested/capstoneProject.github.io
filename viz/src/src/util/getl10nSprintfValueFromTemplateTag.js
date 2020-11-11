module.exports = function getl10nSprintfValueFromTemplateTag(values, ...replaceValues) {
	// Someone is using the l10n method as a template tag. For example:
	// l10n`Hello ${variable} World`.
	return values
		.map((value, index) => {
			const sprintfPlaceholder = `%${index + 1}$s`;
			return value + (replaceValues[index] ? sprintfPlaceholder : '');
		})
		.join('');
};
