export default async function planCRUD(){
    console.log('after read and store');
}

export function dateDiffInDays(start, end){
    const _MS_PER_DAY = 1000 * 60 * 60 * 24
    
    var startDate = new Date(start)
    var endDate = new Date(end)

    const diffTime = Math.abs(endDate - startDate)
    console.log('time difference: ', diffTime)
    const diffDays = Math.ceil( diffTime/ _MS_PER_DAY)

    return diffDays
}