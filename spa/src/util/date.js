const dayjs = require("dayjs");
dayjs.locale("pt-br");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export const dateMixin = {
    methods: {
        converterData(data){
            try{
                data = parseInt(data)
                data = new Date(data)
                if(data == "Invalid Date") return ''
                return data.toLocaleString()
            }catch(e){
                return ''
            }
        },

        dataRelativa(data){
            return dayjs(dayjs(new Date(parseInt(data)))).fromNow()
        }
    }
}
export default dateMixin;