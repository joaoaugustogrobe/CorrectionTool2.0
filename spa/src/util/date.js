const dayjs = require("dayjs");
require('dayjs/locale/pt-br')
dayjs.locale("pt-br");
const relativeTime = require("dayjs/plugin/relativeTime");
// const updateLocale = require('dayjs/plugin/updateLocale')
dayjs.extend(relativeTime);
// dayjs.extend(updateLocale);

// dayjs.updateLocale('en', {
//     months: [
//         "January", "February", "MMMM", "April", "May", "June", "July",
//         "August", "September", "October", "November", "December"
//     ]
// })

export const dateMixin = {
    methods: {
        converterData(data) {
            try {
                data = parseInt(data)
                data = new Date(data)
                if (data == "Invalid Date") return ''
                return data.toLocaleString()
            } catch (e) {
                return ''
            }
        },

        displayData(data) {
            return dayjs(new Date(parseInt(data))).format('MMM D, YYYY h:mm A	');
        },

        dataRelativa(data) {
            return dayjs(dayjs(new Date(parseInt(data)))).fromNow()
        },

        minutosAPartirDeHoje(data) {
            data = dayjs(new Date(parseInt(data)))
            const agora = new dayjs();
            if (data == "Invalid Date") return ''
            return agora.diff(data, 'minutes');

        }
    }
}
export default dateMixin;