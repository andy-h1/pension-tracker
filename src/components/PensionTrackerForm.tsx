import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	Tooltip,
	XAxis,
	YAxis,
	ReferenceLine,
	ResponsiveContainer
} from 'recharts';
import { PensionSummary } from './PensionSummary';

type Inputs = {
	retirementIncome: number;
	employerContribution: number;
	personalContribution: number;
	age: number;
	pensionContribution: number;
};

type CalculatePensionArgs = {
	pensionPot: number;
	contributions: number;
	retirementIncome: number;
	retirementAge: number;
	currentAge: number;
	lifeExpectancy: number;
	data?: PensionDataPoint[];
	totalContributions?: number;
	totalInterest?: number;
}

type PensionDataPoint = {
	age: number;
	pensionPot: number;
	cumulativeContributions: number;
	cumulativeInterest: number;
}

const annualInterestRate = 0.049;
const lifeExpectancy = 81;
const startingAge = 25;

const calculatePensionDataPoints = ({
	pensionPot,
	contributions,
	retirementIncome,
	retirementAge,
	currentAge,
	lifeExpectancy,
	totalContributions = 0,
	totalInterest = 0,
	data = []
}: CalculatePensionArgs): PensionDataPoint[] => {
	if (currentAge > lifeExpectancy) {
		return data;
	}

	const isPreRetirement = currentAge <= retirementAge;
	const effectiveAnnualContributions = isPreRetirement ? contributions : 0;

	// remove math.round
	// if(isPreRetirement)

	let thisYearInterest;
	let newTotalContributions;
	let newTotalInterest;

if (isPreRetirement) {
    // If it's pre-retirement
    thisYearInterest = pensionPot * annualInterestRate;
    pensionPot += effectiveAnnualContributions + thisYearInterest;

    newTotalContributions = totalContributions + effectiveAnnualContributions;
    newTotalInterest = totalInterest + thisYearInterest;
} else {
    // If it's post-retirement
    thisYearInterest = 0;
    pensionPot -= retirementIncome;

    // newTotalContributions and newTotalInterest remain unchanged in post-retirement
    newTotalContributions = totalContributions;
    newTotalInterest = totalInterest;
}

	const newDataPoint = {
		age: currentAge,
		pensionPot: Math.max(0, pensionPot),
		cumulativeContributions: newTotalContributions,
		cumulativeInterest: newTotalInterest
	};

	const newData = [...data, newDataPoint];

	return calculatePensionDataPoints({
		pensionPot,
		contributions,
		retirementIncome,
		retirementAge,
		currentAge: currentAge + 1,
		lifeExpectancy,
		totalContributions: newTotalContributions,
		totalInterest: newTotalInterest,
		data: newData
	});
};

export const PensionTrackerForm = () => {
	const [pensionData, setPensionData] = useState<PensionDataPoint[]>([]);
	// no need to put in types if you initialise it as a number already
	const [targetPensionPot, setTargetPensionPot] = useState(0);
	const [retirementAge, setRetirementAge] = useState(0);
	const [depletionYear, setDepletionYear] = useState<number | undefined>();
	const [retirementDataPoint, setRetirementDataPoint] = useState<
		PensionDataPoint
	>();
	const { register, handleSubmit } = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = data => {
		const annualContributions =
		// double check if Number is required
			(Number(data.personalContribution) + Number(data.employerContribution)) *
			12;

			// do you need these variables?
		const initialPensionPot = Number(data.pensionContribution);
		const annualRetirementIncome = Number(data.retirementIncome);

		// Calculate desiredPensionPot based on the retirement income
		const retirementYears = lifeExpectancy - Number(data.age);
		const desiredPensionPot = annualRetirementIncome * retirementYears;

		const pensionDataPoints = calculatePensionDataPoints({
			pensionPot: initialPensionPot,
			contributions: annualContributions,
			retirementIncome: annualRetirementIncome,
			retirementAge: data.age,
			currentAge: startingAge,
			lifeExpectancy
		});

		// any time you have 3x set states => useReducer
		// pensionData = []
		setPensionData(pensionDataPoints);
		console.log({pensionDataPoints});
		// pensionData = []
		setRetirementAge(Number(data.age));
		// pensionData = []
		setTargetPensionPot(desiredPensionPot);
		// pensionData = []
		const retirementDataPoint = pensionDataPoints.find(point => point.age === retirementAge);
		setRetirementDataPoint(retirementDataPoint);
		// pensionData = []
		const finalYearOfPension = pensionDataPoints.find(point => point.pensionPot <= 0)?.age;
		setDepletionYear(finalYearOfPension);
		// pensionData = []
	};

	console.log({retirementDataPoint});

	// useEffect(() => {
	// 	// comment
	// 	if (pensionData) {
	// 		const retirementDataPoint = pensionData.find(point => point.age === retirementAge);
	// 		setRetirementDataPoint(retirementDataPoint);
	// 		const finalYearOfPension = pensionData.find(point => point.pensionPot <= 0)?.age;
	// 		setDepletionYear(finalYearOfPension);
	// 	}
	// }, [pensionData])



	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<label>What age do you want to retire?</label>
				<input
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					type="number"
					min="25"
					max="81"
					{...register('age')}
				/>
				<label>Monthly Personal pension contribution</label>
				<input
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					type="number"
					{...register('personalContribution')}
				/>
				<label>Monthly Employee pension contribution</label>
				<input
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					type="number"
					{...register('employerContribution')}
				/>
				<label>Other pension pot contributions</label>
				<input
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					type="number"
					{...register('pensionContribution')}
				/>
				<label>Income per year after retirement</label>
				<input
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					type="number"
					{...register('retirementIncome')}
				/>
				<button
					className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
					type="submit"
				>
					Submit
				</button>
			</form>

			{pensionData.length > 0 && (
				<>
					<ResponsiveContainer width={'100%'} height={500}>
						<ComposedChart
							data={pensionData}
							margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="age" />
							<YAxis
								label={{
									value: 'Pension(£)',
									angle: -90,
									position: 'insideLeft'
								}}
								domain={[
									0,
									(dataMax: number) => Math.max(dataMax, targetPensionPot)
								]}
							/>
							<Tooltip />
							<Legend />
							<ReferenceLine
								y={targetPensionPot}
								label="Target Pension Pot"
								stroke="red"
								strokeDasharray="3 3"
							/>
							<ReferenceLine
								x={retirementAge}
								stroke="green"
								label="Retirement Age"
							/>
							<Line
								type="monotone"
								dataKey="pensionPot"
								stroke="#8884d8"
								name="Total Pension Pot"
							/>
						</ComposedChart>
					</ResponsiveContainer>

					{retirementDataPoint && (
						<PensionSummary retirementAge={retirementAge} totalInterest={retirementDataPoint.cumulativeInterest} totalContributions={retirementDataPoint.cumulativeContributions} targetPensionPot={targetPensionPot} actualPensionPot={retirementDataPoint.pensionPot} depletionAge={depletionYear} />
					)}
				</>
			)}
		</>
	);
};
