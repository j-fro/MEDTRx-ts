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

    findTimeByUserId(req.user.id, function(err, result) {
        if (err) {
            console.log(err);
        } else if (result) {
            console.log(result);
            updateReminderTime(result.id, reminderTime, function(err) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            addNewReminderTime(req.user.id, reminderTime, function(err) {
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

function findTimeByUserId(userId, callback) {
    console.log('Finding a time for', userId);
    db.connect(function(client, end) {
        client.query('SELECT id, reminder_time FROM reminders WHERE user_id=$1', [userId], function(err, result) {
            end();
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log('Got a result:', result.rows);
                if (result.rows.length > 0) {
                    callback(null, result.rows[0]);
                } else {
                    callback(null, null);
                }
            }
        });
    });
}

function addNewReminderTime(userId, reminderTime, callback) {
    console.log('Adding a new time for', userId, 'at', reminderTime);
    db.connect(function(client, end) {
        client.query('INSERT INTO reminders (user_id, reminder_time) VALUES ($1, $2)', [userId, reminderTime], function(err) {
            end();
            callback(err);
        });
    });
}

function updateReminderTime(reminderId, newTime, callback) {
    console.log('Updating a reminder', reminderId, newTime);
    db.connect(function(client, end) {
        client.query('UPDATE reminders SET reminder_time=$1 WHERE id=$2', [newTime, reminderId], function(err) {
            end();
            callback(err);
        });
    });
}



function makeTimeObj(time) {
    console.log(time);
    time.reminder_time = time.reminder_time.split(':');
    time.reminder_time = {
        hours: time.reminder_time[0],
        minutes: time.reminder_time[1]
    };
}

module.exports = router;