// import { PensionLineGraph } from '../components/PensionLineGraph';
import { PensionTrackerForm } from '../components/PensionTrackerForm';

const PensionTrackerPage = () => {
	// const [state, dispatch] = useReducer();

	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold text-teal-300">Pension Tracker</h1>
			<PensionTrackerForm />
			{/* <PensionLineGraph /> */}
		</div>
	);
};

export default PensionTrackerPage;
