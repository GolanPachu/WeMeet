const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    moment = require('moment'),
    _ = require('lodash');

const meeting = require('../../../data').schemas.meetings;

const logger = require('../../../utils/logger');

const getUserMeetings = (userId) => {
    return meeting.find({
        $or: [{
            "creator": userId
        }, {
            "accepted": {
                $in: userId
            }
        }]
    });
};

const creatNewMeeting = (currentMeeting) => {

    let newMeeting = new meeting(currentMeeting);
    return newMeeting.save();
};
const updateMeeting = (currentMeeting) => {
    return meeting.findOneAndUpdate({
        '_id': new mongoose.Types.ObjectId(currentMeeting._id)
    }, currentMeeting);
};

const getUserWaitingMeetings = (userId, isDetermined) => {
    const query = {
        $and: [{
                // not relevat if the meeting already started
                fromDate: {
                    $gt: moment().toDate()
                }
            },
            {
                // get only meetings that the algorithm offer
                isDetermined: isDetermined
            },
            {
                // the user need to be creator or one of the participants
                $or: [{
                    creator: userId,
                }, {
                    invited: userId
                }],
            },
            {
                // the user should not be in the accepted list
                accepted: {
                    $ne: userId
                }
            },
            {
                // the user should not be in the rejected list
                rejected: {
                    $ne: userId
                }
            }
        ]
    };
    return meeting.find(query).lean();
};

const acceptMeeting = (userId, meetingId) => {
    logger.debug(`find meeting with id ${meetingId}`);
    return meeting.findById(meetingId).lean()
        .then((meet) => {
            return Promise.resolve()
                .then(() => {
                    // in case the user exist in the rejected list
                    logger.debug('check if the user exist in the rejected list');
                    if (_.findIndex(meet.rejected, new ObjectId(userId)) !== -1) {
                        logger.debug('remove user from rejected list');
                        return meeting.updateOne({
                            _id: meetingId
                        }, {
                            $pull: {
                                rejected: userId
                            }
                        });
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    // in case the user not exist in the accepted list
                    logger.debug('check if the user already exist in the accepted list');
                    if (_.findIndex(meet.accepted, new ObjectId(userId)) !== -1) {
                        return Promise.resolve();
                    }
                    logger.debug('put the user in the accepted list');
                    return meeting.updateOne({
                        _id: meetingId
                    }, {
                        $push: {
                            accepted: userId
                        }
                    });
                });
        });
}

const rejectMeeting = (userId, meetingId) => {
    logger.debug(`find meeting with id ${meetingId}`);
    return meeting.findById(meetingId).lean()
        .then((meet) => {
            return Promise.resolve()
                .then(() => {
                    // in case the user exist in the accepted list
                    logger.debug('check if the user exist in the accepted list');
                    if (_.findIndex(meet.accepted, new ObjectId(userId)) !== -1) {
                        logger.debug('remove user from accepted list');
                        return meeting.updateOne({
                            _id: meetingId
                        }, {
                            $pull: {
                                accepted: userId
                            }
                        });
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    // in case the user not exist in the rejected list
                    logger.debug('check if the user already exist in the rejected list');
                    if (_.findIndex(meet.rejected, new ObjectId(userId)) !== -1) {
                        return Promise.resolve();
                    }
                    logger.debug('put the user in the accepted list');
                    return meeting.updateOne({
                        _id: meetingId
                    }, {
                        $push: {
                            rejected: userId
                        }
                    });
                });
        });
}

const deleteMeeting = (meetingId) => {
    return meeting.delete({ '_id': new mongoose.Types.ObjectId(meetingId) });
};

module.exports = {
    getUserMeetings,
    creatNewMeeting,
    updateMeeting,
    getUserWaitingMeetings,
    acceptMeeting,
    rejectMeeting,
    deleteMeeting
};