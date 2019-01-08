const meetingsService = require('./meeting.service');

const getUserMeetings = (req, res) => {
    return meetingsService.getUserMeetings(req.params.id)
        .then((meetings) => {
            res.json(meetings);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}
const creatNewMeeting = (req, res) => {
    return meetingsService.creatNewMeeting(req.body)
        .then((meeting) => {
            res.json(meeting);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}
const updateMeeting = (req, res) => {
    return meetingsService.updateMeeting(req.body)
        .then((meeting) => {
            res.json(meeting);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}


module.exports = {
    getUserMeetings,
    creatNewMeeting,
    updateMeeting
}