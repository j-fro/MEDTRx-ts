var express = require('express');
var pg = require('pg');
var schedule = require('node-schedule');
var db = require('../../utils/dbUtils');
var auth = require('../../utils/auth');
var router = express.Router();

router.put('/', auth.checkIfAuthenticated, function(req, res) {
    console.log('Updating reminder for', req.user);
    var timeIn = new Date(req.body.reminderTime);
    var reminderTime = timeIn.getHours() + ':' + timeIn.getMinutes() + ':' + timeIn.getSeconds();

    db.findTimeByUserId(req.user.id, function(err, result) {
        if (err) {
            console.log(err);
        } else if (result) {
            console.log(result);
            db.updateReminderTime(result.id, reminderTime, function(err) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            db.addNewReminderTime(req.user.id, reminderTime, function(err) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

module.exports = router;
