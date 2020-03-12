var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var taskQ = require('../models/severity');
var taskT = require('../models/symptom');
var taskE = require('../models/userSpecific');
var data = require('../utility/data');
var symptomModel = mongoose.model('symptomModel');
var severityModel = mongoose.model('severityModel');
var userModel = mongoose.model('user');

const twilio = require('twilio');

const accountSid = 'AC4ee792bbffd3bbfea171694663a786d0';
const authToken = 'ce7b7045f97c85a70a4ab37381fcba96';
const client = new twilio(accountSid, authToken);




/*router.post('/sendSms', function (req, res) {

    client.messages
        .create({
            body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
            from: '+12564488665',
            to: '+17047136548'
        })
        .then(message => {
            console.log(message.sid);
            res.send("successfull");
        });


});*/




router.post('/sms', function (req, res) {
    let From = req.body.From;
    let To = req.body.To;
    let Body = req.body.Body

    console.log("in run app", req.body.Body);
    console.log("in run app", req.body.From);
    console.log("in run app", req.body.To);

    userModel.find({
            _id: From
        },
        function (err, users) {
            if (err)
                console.log(err);
            console.log("users", users);
            if (typeof users != "undefined" &&
                users != null &&
                users.length != null &&
                users.length > 0) {
                console.log("already enrolled");
                console.log("find user", users);

                var count;
                var sysArray;
                var severityArray;
                var status;
                Object.keys(users).forEach(function (key) {
                    count = users[key]['count'];
                    sysArray = users[key]['symptomNo'];
                    severityArray = users[key]['severNo'];
                    status = users[key]['status'];

                });

                if (count <= 3 && status != "complete") {
                    if (severityArray.length != count) {

                        //severity question

                        var severityNo = Body;
                        console.log("severity number", severityNo);
                        var severity = data.severitytext(severityNo);
                        console.log("severity", severity);
                        var severityText;

                        Object.keys(severity).forEach(function (key) {
                            severityText = severity[key]['severText'];
                        });

                        console.log("severityText text", severityText);



                        if (severityNo >= 0 && severityNo <= 4) {



                            userModel.findOneAndUpdate({
                                _id: From
                            }, {
                                $push: {
                                    severNo: severityNo
                                }
                            }, {
                                new: true
                            }, function (err, users) {
                                if (err)
                                    console.log(err);
                                console.log("users in push", users);
                                //if (users.length > 0) {
                                var symptoms = users.symptomNo;

                                console.log("symptoms", symptoms);
                                var symptomtext = symptoms[symptoms.length - 1];

                                console.log("symptom text", symptomtext);
                                console.log("severity number", severityNo);

                                switch (severityNo) {
                                    case "0":
                                        message = "You do not have a " + symptomtext;
                                        // code block
                                        break;
                                    case "1":
                                        message = "You have a mild " + symptomtext;
                                        // code block
                                        break;
                                    case "2":
                                        message = "You have a mild " + symptomtext;
                                        // code block
                                        break;
                                    case "3":
                                        message = "You have a moderate " + symptomtext;
                                        // code block
                                        break;
                                    case "4":
                                        // code block
                                        message = "You have a severe " + symptomtext;
                                        break;
                                    default:
                                        message = "Please enter a number from 0 to 4";
                                }
                                console.log("message after switch case", message);

                                client.messages
                                    .create({
                                        body: message,
                                        from: `${To}`,
                                        to: `${From}`
                                    }).then(message => {
                                        if (count < 3) {
                                            console.log("symptom array", sysArray);
                                            var symptomShow = getSymptomArray(sysArray);
                                            var messagesymptom = "Please indicate your symptom \n";
                                            for (var i = 0; i < symptomShow.length; i++) {
                                                messagesymptom += "(" + i + ")" + symptomShow[i] + ", ";
                                                /*  if (symptomShow.length - 1) {
                                                      messagesymptom += "(" + i + ")" + symptomShow[i];
                                                  }*/
                                            }
                                            client.messages
                                                .create({
                                                    body: messagesymptom,
                                                    from: `${To}`,
                                                    to: `${From}`
                                                });
                                        } else {
                                            userModel.update({
                                                _id: From
                                            }, {
                                                $set: {
                                                    status: "complete",
                                                }
                                            }, {
                                                new: true
                                            }, function (err, item) {

                                                client.messages
                                                    .create({
                                                        body: "Thank You and See You Soon",
                                                        from: `${To}`,
                                                        to: `${From}`
                                                    });



                                            });

                                        }
                                    });

                                res.end();

                                //  res.send(message);
                                // }
                            });

                        } else {
                            // res.send("Please enter number from 0-4");
                            client.messages
                                .create({
                                    body: "Please enter number from 0-4",
                                    from: `${To}`,
                                    to: `${From}`
                                })
                            res.end();
                        }

                    } else {
                        //symptom question
                        var symptomNo = Body;
                        console.log("symptom No", Body);

                        var symptoms = getSymptomArray(sysArray);
                        console.log("symptoms", symptoms);
                        var symptomText = symptoms[symptomNo];


                        console.log("symptom text", symptomText);

                        if (symptomNo >= 0 && symptomNo <= 5) {
                            var message;
                            if (symptomNo == 0) {
                                message = "Thank you and we will check with you later.";
                                      userModel.update({
                                    _id: From
                                }, {
                                    $set: {
                                        status:"complete",
                                    }
                                }, {
                                    new: true
                                }, function (err, item) {

                                    client.messages
                                        .create({
                                            body: message,
                                            from: `${To}`,
                                            to: `${From}`
                                        })
                                    res.end();


                                });
                                
                            } else {
                                message = "On a scale from 0 (none) to 4 (severe), how would you rate your " + symptomText + " in the last 24 hours?";
                                   userModel.update({
                                _id: From
                            }, {
                                $push: {
                                    "symptomNo": symptomText
                                }
                            }, {
                                new: true
                            }, function (err, users) {
                                if (err)
                                    console.log(err);
                                console.log("users in update", users);
                                console.log("message in update", message);

                                console.log("message in 2 update", message);
                                console.log("count in 2 update", parseInt(count) + 1);
                                userModel.update({
                                    _id: From
                                }, {
                                    $set: {
                                        count: parseInt(count) + 1,
                                    }
                                }, {
                                    new: true
                                }, function (err, item) {

                                    client.messages
                                        .create({
                                            body: message,
                                            from: `${To}`,
                                            to: `${From}`
                                        })
                                    res.end();


                                });


                            });
                            }

                         
                        } else {
                            client.messages
                                .create({
                                    body: "Please enter number from 0-5",
                                    from: `${To}`,
                                    to: `${From}`
                                })
                            res.end();
                        }
                    }

                } else {
                    //do nothing
                }
                //not first time
            } else {
                if (req.body.Body == "START") {
                    //first time
                    console.log("enroll user in study");
                    var message = "Welcome to the study \n Please indicate your symptom \n (1)Headache, (2)Dizziness, (3)Nausea, (4)Fatigue, (5)Sadness, (0)None";
                    new userModel({
                        _id: req.body.From,
                        count: 0
                    }).save(function () {
                        console.log("to from, message", To, From, message);
                        client.messages
                            .create({
                                body: message,
                                from: `${To}`,
                                to: `${From}`
                            }).then(message => {

                                console.log("inside message", message.sid);
                            });

                        res.end();
                    });

                } else {
                    client.messages
                        .create({
                            body: "Please enter START to enroll",
                            from: `${To}`,
                            to: `${From}`
                        })
                    res.end();
                }

            }
        });
});

function getSymptomArray(dataSymptom) {
    var dumyarr = data.symptoms();
    var arr = [];
    if (dataSymptom.length > 0) {
        arr = dumyarr.filter(item => !dataSymptom.includes(item))
        /* data.symptoms().forEach(function (items) {
             dataSymptom.forEach(function (item) {
                 console.log("item",item);
                 console.log("items",items);
                 if (items == item) {
                     console.log("inside if");
                     
                   // arr.push(items);
                 }
             });
         });*/
    } else {
        arr = dumyarr;
    }
    console.log("array in get symptom array", arr);
    return arr;
}




router.post('/symptom', function (req, res) {
    const twiml = new MessagingResponse();
    console.log("in symptom", req.body.Body);
    var sysArray = [];
    userModel.find({
        _id: req.body.Number
    }, function (err, user) {
        if (err)
            console.log(err);
        if (user.length > 0) {
            console.log("find user", user);
            var count;
            Object.keys(user).forEach(function (key) {
                count = user[key]['count'];
                sysArray = user[key]['symptomNo'];

            });


            console.log("count in symptom", count);
            if (parseInt(count) <= 3) {
                var symptomNo = req.body.symptomNo;
                console.log("symptom No", req.body.symptomNo);
                var symptoms = getSymptomArray(sysArray);
                console.log("symptoms", symptoms);
                var symptomText = symptoms[symptomNo];


                console.log("symptom text", symptomText);

                if (symptomNo >= 0 && symptomNo <= 5) {
                    var message;
                    if (symptomNo == 0) {
                        message = "Thank you and we will check with you later.";
                    } else {
                        message = "On a scale from 0 (none) to 4 (severe), how would you rate your " + symptomText + " in the last 24 hours?";
                    }

                    userModel.update({
                        _id: req.body.Number
                    }, {
                        $push: {
                            "symptomNo": symptomText
                        }
                    }, {
                        new: true
                    }, function (err, users) {
                        if (err)
                            console.log(err);
                        console.log("users in update", users);
                        console.log("message in update", message);

                        console.log("message in 2 update", message);
                        console.log("count in 2 update", parseInt(count) + 1);
                        userModel.update({
                            _id: req.body.Number
                        }, {
                            $set: {
                                count: parseInt(count) + 1,
                            }
                        }, {
                            new: true
                        }, function (err, item) {

                            console.log("in response item", item);
                            res.send(message);


                        });


                    });
                } else {
                    res.send("Please enter number from 0-5");
                }


            } else {
                res.send("Thank You and see you soon.");
            }

        }
    });

});


router.post('/severity', function (req, res) {
    var severityNo = req.body.severityNo;
    console.log("severity number", severityNo);
    var severity = data.severitytext(severityNo);
    console.log("severity", severity);
    var severityText;

    Object.keys(severity).forEach(function (key) {
        severityText = severity[key]['severText'];
    });

    console.log("severityText text", severityText);



    if (severityNo >= 0 && severityNo <= 4) {



        userModel.findOneAndUpdate({
            _id: req.body.Number
        }, {
            $push: {
                severNo: severityNo
            }
        }, {
            new: true
        }, function (err, users) {
            if (err)
                console.log(err);
            console.log("users in push", users);
            //if (users.length > 0) {
            var symptoms = users.symptomNo;

            console.log("symptoms", symptoms);
            var symptomtext = symptoms[symptoms.length - 1];

            console.log("symptom text", symptomtext);
            console.log("severity number", severityNo);

            switch (severityNo) {
                case "0":
                    message = "You do not have a " + symptomtext;
                    // code block
                    break;
                case "1":
                    message = "You have a mild " + symptomtext;
                    // code block
                    break;
                case "2":
                    message = "You have a mild " + symptomtext;
                    // code block
                    break;
                case "3":
                    message = "You have a moderate " + symptomtext;
                    // code block
                    break;
                case "4":
                    // code block
                    message = "You have a severe " + symptomtext;
                    break;
                default:
                    message = "Please enter a number from 0 to 4";
            }
            console.log("message after switch case", message);
            res.send(message);
            // }
        });

    } else {
        res.send("Please enter number from 0-4");
    }


});



module.exports = router