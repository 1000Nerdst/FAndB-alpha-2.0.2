export default async function calculateTargetCalories(){
    const goal = sessionStorage.getItem('goal');
    const maintenceCalories = sessionStorage.getItem('maintenceTarget');
    const carbRatio = sessionStorage.getItem('carbsRatio');
    const fatRatio = sessionStorage.getItem('fatRatio');
    const proteinRatio = sessionStorage.getItem('proteinRatio');
    const currentWeight = parseInt(sessionStorage.getItem('weightLb'));
    var proteinWeight
    var goalMeetingCals = 0;

    console.log('adjusting calories');
    console.log(goal);

    switch (goal) {
        case 'Gain 1 lb Per Week':
            goalMeetingCals = 500;
            proteinWeight = currentWeight + 1
            break;
        case 'Gain 1/2 lb Per Week':
            goalMeetingCals = 250;
            proteinWeight = currentWeight + 1
            break;
        case 'Maintence':
            goalMeetingCals = 0;
            proteinWeight = currentWeight + 1
            break;
        case 'Lose 1/2 lb Per Week':
            goalMeetingCals = -250;
            proteinWeight = currentWeight + 2
            break;
        case 'Lose 1 lb Per Week':
            goalMeetingCals = -500;
            proteinWeight = currentWeight + 3
            break;
        default:
            goalMeetingCals = 0;
            proteinWeight = currentWeight + 1
            break;
    }

    console.log(goalMeetingCals);
    var targetCalories = (maintenceCalories * 1) + (goalMeetingCals * 1);

    console.log('target:', targetCalories);
    sessionStorage.setItem('calorieTarget', targetCalories);

    const carbsGrams = ((targetCalories * ( carbRatio / 100 )) / 4);
    const fatGrams = (targetCalories * ( fatRatio / 100 ) / 9);
    const protienGrams = proteinWeight;

    console.log('carbs ratio', carbRatio)
    console.log('fat ratio', fatRatio)
    console.log('protien ratio', proteinRatio)

    console.log('carbsGrams', carbsGrams)
    console.log('fatGrams', fatGrams)
    console.log('protienGrams', protienGrams)


    sessionStorage.setItem('carbsGrams', carbsGrams);
    sessionStorage.setItem('fatGrams', fatGrams);
    sessionStorage.setItem('protienGrams', protienGrams);
}