export type formatCurrencyProps = {
	value: number;
	locale?: string;
	currency?: string;
};

export const formatCurrency = ({
	value,
	locale = 'en-GB',
	currency = 'GBP'
}: formatCurrencyProps): string => {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(value);
};
