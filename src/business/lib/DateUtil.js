const tz = require("moment-timezone");
const { api } = require("../../config/config")

class DateUtil {
    static getDateWithTz() {
        return tz().utc(api.timezone).toDate()
    }
}

module.exports = DateUtil