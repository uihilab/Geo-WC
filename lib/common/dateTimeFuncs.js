import { add, parseISO, format } from 'https://cdn.jsdelivr.net/npm/date-fns/+esm'

export function calculateEndDate(startDate, interval) {
    const intervals = {
        d: 'days',
        w: 'weeks',
        M: 'months',
        y: 'years',
    };

    const [amount, unit] = interval.match(/(\d+)(\w+)/).slice(1);
    var inter = { [intervals[unit]]: parseInt(amount) };
    var start = parseISO(startDate);
    const endDate = add(start,inter);

    //yyyy-MM-dd HH:mm:ss
    return format(endDate, 'yyyy-MM-dd');
}
