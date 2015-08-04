// loading dependencies
var mandrill = require("mandrill-api/mandrill");

// init mandrill client
var mandrill_client = new mandrill.Mandrill('0vOuvuBYFAzrHB7iVwWL-Q');

var sendMail = function(toEmail, subject, contentHtml, callback) {
    // create message
    var message = {
        "html": contentHtml,
        "subject": subject,
        "from_email": "info@playland.com",
        "from_name": "PlayLand Armenia",
        "to": [{
                "email": toEmail,
                "name": "",
                "type": "to"
            }]
    };
    
    mandrill_client.messages.send({"message": message, "async": false}, function(result) {
        console.log(result);
        
        callback(result);
    }, function(err) {
        console.log('A mandrill error occurred: ' + err.name + ' - ' + err.message);
    });
};

module.exports.sendMail = sendMail;