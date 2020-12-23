const moment = require('moment'); //package for parsing,validating,manipulating and formatting dates



function formatMessage(username,text){
    return{
        username,
        text,
        time: moment().format('h:mm a')  //format will be hour:minutes am/pm

    }
}

module.exports = formatMessage;