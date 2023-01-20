export default async function calculateCalories(){
    const currentAge = sessionStorage.getItem('age');
    const currentWeight = sessionStorage.getItem('weightLb');
    const currentHeight = sessionStorage.getItem('heightF');
    const sex = sessionStorage.getItem('sex');
    const currentActiveDays = sessionStorage.getItem('activeDaysPerWeek'); 
    var maintenceCalories = sessionStorage.getItem('maintenceTarget');
    var userBMR = 0;

    console.log('calualting calories');
    switch (sex) {
        case 'Male':
            userBMR = ((13.397 * currentWeight) + (4.799 * currentHeight) - (5.677 * currentAge) + 88.362)
            break;
        case 'Female':
            userBMR = ((9.247 * currentWeight) + (3.098 * currentHeight) - (4.330 * currentAge) + 447.593)
            break;
        case 'Other':
            userBMR = ((13.397 * currentWeight) + (4.799 * currentHeight) - (5.677 * currentAge) + 88.362)
            break;
        default:
            userBMR = ((13.397 * currentWeight) + (4.799 * currentHeight) - (5.677 * currentAge) + 88.362)
            break;
    }

    console.log('BMR:', userBMR);
    const activeCalorieAvg = (400 * (currentActiveDays / 7));
    maintenceCalories = userBMR + activeCalorieAvg;

    console.log('Maintence:', maintenceCalories);

    sessionStorage.setItem('maintenceTarget', maintenceCalories);
}