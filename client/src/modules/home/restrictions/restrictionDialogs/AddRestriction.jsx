import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RestrictionDialog from './RestrictionDialog';
import { addRestriction } from '../../../../clientManager/userManager';
import { updateRefresh } from '../../../../redux/refresh/actionCreators';
import { home as homeKey } from '../../../../redux/refresh/refreshFields';
import { bindActionCreators } from 'redux';

const propTypes = {
    onClose: PropTypes.func.isRequired,
    userId: PropTypes.string, // from redux
    updateRefresh: PropTypes.func
};

class AddRestriction extends Component {
    handleSubmit = values => {
        addRestriction(this.props.userId, values)
            .then(() => {
                this.props.onClose();
                this.props.updateRefresh(homeKey)
            })
    }


    render() {
        const { onClose } = this.props;

        return <RestrictionDialog title='אילוץ חדש'
            form='add-restriction'
            onSubmit={this.handleSubmit}
            onClose={onClose} />
    }
}

AddRestriction.propTypes = propTypes;

const mapStateToProps = state => ({
    userId: state.user ? state.user.get('_id') : ''
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        updateRefresh
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRestriction);