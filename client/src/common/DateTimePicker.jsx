import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

function DateAndTimePickers(props) {
    const {
        classes,
        label,
        input,
        meta: { touched, invalid, error },
        ...custom } = props;

    return (
        <form className={classes.container} noValidate>
            <TextField
                id="datetime-local"
                label={label}
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                placeholder={label}
                error={touched && invalid}
                helperText={touched && error}
                {...input}
                {...custom}
            />
        </form>
    );
}

DateAndTimePickers.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DateAndTimePickers);