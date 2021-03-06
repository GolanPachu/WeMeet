const _ = require('lodash');

const meetingsService = require('./meeting.service');

const logger = require('../../../utils/logger');

const MEETING_RESPONSE = {
    ACCPET_MEETING: 'accept',
    REJECT_MEETING: 'reject'
};

const getUserMeetings = (req, res) => {
    logger.debug(`get all user with id: ${req.params.id} meetings from db`);
    return meetingsService.getUserMeetings(req.params.id)
        .then((meetings) => {
            res.json(_.map(meetings, addDurationToMeeting));
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
}
const creatNewMeeting = (req, res) => {
    logger.debug(`create new meeting`);
    return meetingsService.creatNewMeeting(req.body)
        .then((meeting) => {
            res.json(meeting);
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
}
const updateMeeting = (req, res) => {
    logger.debug(`update meeting`)
    return meetingsService.updateMeeting(req.body)
        .then((meeting) => {
            res.json(meeting);
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
}

const getUserWaitingMeetings = (req, res) => {
    let id = req.params.id;
    logger.debug(`get all user with id: ${id} waiting meeting from db`);
    logger.debug('validate params');
    if (_.isNil(id)) {
        logger.warn('id param is not valid');
        return res.status(400).send('id parameter must exist');
    }
    logger.debug('get all waiting meetings');
    return meetingsService.getUserWaitingMeetings(id, true)
        .then((meetings) => {
            return res.json(_.map(meetings, addDurationToMeeting));
        })
        .catch((err) => {
            logger.error(err);
            return res.status(500).send(err);
        });
}

const getUserFutureMeetings = (req, res) => {
    let id = req.params.id;
    logger.debug(`get all user with id ${id} future meetings from db`);
    logger.debug('validate params');
    if (_.isNil(id)) {
        logger.warn('id param is not valid');
        return res.status(400).send('id parameter must exist');
    }
    logger.debug('get all waiting meetings');
    return meetingsService.getUserWaitingMeetings(id, false)
        .then((meetings) => {
            return res.json(_.map(meetings, addDurationToMeeting));
        })
        .catch((err) => {
            logger.error(err);
            return res.status(500).send(err);
        });
}

/** should get in req.body:
 * {
 *  userId: mongoId,
 *  meetingId: mongoId,
 *  response: should be 'accept' or 'reject'
 * } 
 */
const acceptOrRejectMeeting = (req, res) => {
    let {
        userId,
        meetingId,
        response
    } = req.body;
    logger.debug('validate params');
    // validations
    if (_.isNil(userId)) {
        logger.warn('userId param is not valid');
        return res.status(400).send('userId should exist and be mongoId');
    }
    if (_.isNil(meetingId)) {
        logger.warn('meetingId param is not valid');
        return res.status(400).send('meetingId should exist and be mongoId');
    }
    if (_.isNil(response) ||
        !_.isString(response) ||
        (response.toLowerCase() !== MEETING_RESPONSE.ACCPET_MEETING &&
            response.toLocaleLowerCase() !== MEETING_RESPONSE.REJECT_MEETING)) {
        logger.warn('response param is not valid');
        return res.status(400).send('response should exist and be string with values of "accept" or "reject"');
    }
    // lowercase response parameter
    response = response.toLowerCase();
    return Promise.resolve()
        .then(() => {
            logger.debug('check if the response param is "accept" or "reject"');
            if (response === MEETING_RESPONSE.ACCPET_MEETING) {
                logger.debug('accept meeting');
                return meetingsService.acceptMeeting(userId, meetingId);
            }
            if (response === MEETING_RESPONSE.REJECT_MEETING) {
                logger.debug('reject meeting');
                return meetingsService.rejectMeeting(userId, meetingId);
            }
            return Promise.resolve();
        })
        .then(() => {
            return res.json(true);
        })
        .catch((err) => {
            logger.error(err);
            return res.status(500).send(err);
        });
}

const deleteMeeting = (req, res) => {
    return meetingsService.deleteMeeting(req.body.meetingId)
        .then((meeting) => {
            res.json(meeting);
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
}

function addDurationToMeeting(meeting) {
    meeting.duration = meeting.meetLengthInSeconds / 60 / 60;
    return meeting;
}

module.exports = {
    getUserMeetings,
    creatNewMeeting,
    updateMeeting,
    getUserWaitingMeetings,
    getUserFutureMeetings,
    acceptOrRejectMeeting,
    deleteMeeting
}