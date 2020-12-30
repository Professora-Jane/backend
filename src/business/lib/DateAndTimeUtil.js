const { tz } = require("moment-timezone");
const moment = require("moment-timezone");
const { api } = require("../../config/config")

class DateAndTimeUtils {
    static getDateWithTz() {
        return moment().utc(api.timezone).toDate()
    }
    

    /**
     * @description Função que compara duas horas informadas. O retorno é a diferença, em minutos, da hora inicial até a final.
     * Se igual a 0, as horas são iguais. Se menor que 0, a hora de início é superior à hora de fim, e se maior que 0 a hora de início
     * é inferior à hora de fim.
     * @param { string } startHour String representando hora no formato 'HH:mm' 
     * @param { string } endHour String representando hora no formato 'HH:mm'
     * @returns { number }
     */
    static compareHours(startHour, endHour) {
        const init = moment(startHour, 'HH:mm');
        const end = moment(endHour, 'HH:mm');
        
        return end.diff(init) / 60000
    }
    
    /**
     * @description Função que converte uma string de horas na representação em minutos a contar a partir das 00:00.
     * @param { string } hour String representando hora no formato 'HH:mm'
     * @returns { number }
     */
    static convertHourToMinutes(hour) {
        const [hh, mm] = hour.split(":").map(item => +item);
        
        return ((hh * 60) + mm)
    }
    
    /**
     * @description Função que converte um número inteiro representando a contagem de minutos a partir da 00:00 em uma string de hora
     * @param { number } hour String representando hora no formato 'HH:mm'
     * @returns { string }
     */
    static convertMinutesToHours(hour) {

        const hh = parseInt(hour / 60);
        const mm = parseInt(hour % 60);

        const formattedHour = `${hh > 9? hh : '0' + hh}:${mm > 9? mm : '0' + mm}`
        
        return formattedHour
    }

    /**
     * @description Função auxiliar para montar um timestamp a partir dos minutos totais e um índice representando o dia da semana
     * @param { number } time String representando hora no formato 'HH:mm'
     * @param { number } dayOfWeekIndex String representando hora no formato 'HH:mm'
     * @returns { number }
     */
    static getTimestampFromMinutesAndDayIndex(time, dayOfWeekIndex) {
        const correctDay = tz().startOf('isoWeek').toDate();
        correctDay.setHours(parseInt(time / 60), parseInt(time % 60))
        correctDay.setDate(correctDay.getDate() + dayOfWeekIndex)
                            
        return +correctDay
    }
}

module.exports = DateAndTimeUtils
