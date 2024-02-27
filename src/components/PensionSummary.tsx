import { formatCurrency } from "../utils"

export const PensionSummary = ({retirementAge, totalInterest, totalContributions, targetPensionPot, actualPensionPot, depletionAge}) => {
    console.log(totalContributions);
    const formattedInterest = formatCurrency(totalInterest);
    const formattedContributions = formatCurrency(totalContributions);
    console.log(formattedContributions);
    const formattedTargetPensionPot = formatCurrency(targetPensionPot);
    const formattedActualPensionPot = formatCurrency(actualPensionPot);

    return (
        <div>
            <p>
                {formattedActualPensionPot}
            </p>
            <p>
                {formattedInterest}
            </p>
            <p>
                {formattedTargetPensionPot}
            </p>
            <p>
                {formattedContributions}
            </p>
            <p>
                {retirementAge}
            </p>
            <p>
                {depletionAge || 'Your pension pot will not decrease before the age of 81'}
            </p>
        </div>
    )

}