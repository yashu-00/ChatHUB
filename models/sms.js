const accountSid = 'AC755d3ee5bce99a332d1e1375e4f58384';
const authToken = '68873522da370003e4404978f3a3258e';
const client = require('twilio')(accountSid, authToken);
function SMS(number,user) {
    client.messages
        .create({
            body: `Hey ${user.name}!\nYour account with user name ${user.user_name} just loged in.`,
            from: '+17727424108',
            to: '+91' + number
        });
}

module.exports = SMS