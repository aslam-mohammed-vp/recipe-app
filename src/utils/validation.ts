export const validateCoordinate = (
	field: string,
	mode: string,
	value: number | undefined,
): true | string => {
	// Only validate coordinates when in modes that require them
	if (mode === "Specific" || mode === "Section") {
		if (value == null || isNaN(value)) {
			return `${field} is required in ${mode} mode.`;
		}

		if (value < 0) {
			return `${field} cannot be negative.`;
		}
	}

	return true;
};
