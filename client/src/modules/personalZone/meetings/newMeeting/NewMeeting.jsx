import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'immutable-prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '../../../../common/TextField';
import styles from './newMeeting.module.scss';
import DateTimePicker from '../../../../common/DateTimePicker';
import SelectBox from '../../../../common/SelectBox';

const propTypes = {
    // locations: ImmutablePropTypes.List.isRequired,
    // users: ImmutablePropTypes.List.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    meeting: ImmutablePropTypes.map,
    valid: PropTypes.bool // from redux-form
}

class NewMeeting extends Component {
    componentDidMount() {
        const { meeting } = this.props;
        if (meeting) {
            this.props.initialize({
                name: meeting.get('name'),
                fromDate: meeting.get('fromDate'),
                toDate: meeting.get('toDate'),
                participants: meeting.get('participants').map(x => x.get('name')).toJS(),
                locations: [meeting.get('location').get('name')]
            });
        }
    }

    render() {
        const { handleSubmit, valid, locations, users, onClose, onSubmit, title } = this.props;

        return <Dialog onClose={onClose}
            open={true}>
            <DialogTitle className={styles.dialogTitle}>{title}</DialogTitle>
            <DialogContent>
                <form className={styles.form}>
                    <Field name='name'
                        component={TextField}
                        type='text'
                        label='שם' />
                    <Field name='fromDate'
                        component={DateTimePicker}
                        label='מתאריך' />
                    <Field name='toDate'
                        component={DateTimePicker}
                        label='עד תאריך' />
                    <Field name='participants'
                        component={SelectBox}
                        items={users}
                        label='משתתפים'
                        multiple 
                         format={value => Array.isArray(value) ? value : []}
                        />
                    <Field name='locations'
                        component={SelectBox}
                        items={locations}
                        label='מיקומים'
                        multiple
                         format={value => Array.isArray(value) ? value : []} 
                        />
                </form>
            </DialogContent>
            <DialogActions className={styles.dialogActions}>
                <Button color='primary'
                    disabled={!valid}
                    type='submit'
                    onClick={handleSubmit(onSubmit)}>
                    אישור
            </Button>
                <Button onClick={onClose}>
                    ביטול
            </Button>
            </DialogActions>
        </Dialog>
    }
}

NewMeeting.propTypes = propTypes;
NewMeeting.defaultProps = {
    title: 'פגישה חדשה'
}

const validate = values => {
    const errors = {}
    if (!values.name) {
        errors.name = 'חובה להזין שם לפגישה'
    }

    if (!values.fromDate) {
        errors.fromDate = 'חובה להזין תאריך מינימום לפגישה'
    }

    if (!values.toDate) {
        errors.toDate = 'חובה להזין תאריך מקסימום לפגישה'
    }

    if (!values.participants || (values.participants && values.participants.length === 0)) {
        errors.participants = 'חובה להזמין משתתפים לפגישה'
    }

    if (!values.locations || (values.locations && values.locations.length === 0)) {
        errors.locations = 'חובה להזין מיקומים אפשריים לפגישה'
    }

    return errors
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const asyncValidate = (values /*, dispatch */) => {
    return sleep(1000).then(() => {
        // simulate server latency
        //throw {username: 'That username is taken'}
    })
}

export default reduxForm({
    form: 'newMeeting',
    validate,
    asyncValidate
})(NewMeeting);