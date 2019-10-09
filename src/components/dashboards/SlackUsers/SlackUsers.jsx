import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'library/Table';
import { connect } from 'react-redux';
import { getSlackUsers } from 'store/slackUsers';
import './SlackUsers.css';

const columnHeaders = [
    {
        field: 'profile.image_32',
        label: '',
        mobileLabel: 'Image',
        type: 'image'
    },
    {
        field: 'real_name',
        label: 'Name'
    },
    {
        field: 'name',
        label: 'Handle',
    },
    {
        field: 'profile.status_text',
        label: 'Status'
    },
    {
        field: 'tz',
        label: 'Timezone'
    },
    {
        field: 'channels',
        label: 'Channels',
        type: 'array'
    }
]

class SlackUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    static propTypes = {
        slackUsers: PropTypes.object.isRequired,
        getSlackUsers: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.props.getSlackUsers();
    }

    render() {
        return (
            <div>
                <Table
                    rows={this.props.slackUsers.users}
                    columnHeaders={columnHeaders} />
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        slackUsers: state.slackUsers
    }
}

function mapDispatchToProps() {
    return {
        getSlackUsers
    }
}

export default connect(mapStateToProps, mapDispatchToProps())(SlackUsers);