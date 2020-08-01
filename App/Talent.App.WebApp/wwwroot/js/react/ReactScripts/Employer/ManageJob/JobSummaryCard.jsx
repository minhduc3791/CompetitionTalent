import React from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom'
import { Popup, Button, Card, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
        this.selectJob = this.selectJob.bind(this);
        this.closeJob = this.closeJob.bind(this);
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
    }

    closeJob(jobId) {
        this.setState({ isLoading: true });
        var link = 'http://localhost:51689/listing/listing/closeJob';
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(jobId),
            success: function (res) {
                console.log(res);
                this.props.updateWithoutSave(jobId);
            }.bind(this),
            error: function (res) {
                this.setState({ isLoading: false });
                TalentUtil.notification.show("Error while closing job", "error", null, null);
            }.bind(this)
        })
    }

    render() {
        const { title, location, noOfSuggestions, summary, id } = this.props;
        const { isLoading } = this.state;
        const expiryDate = new Date(this.props.expiryDate);
        const today = new Date();
        return (
            <Card className="job-summary-card">
                <Card.Content>
                    <Card.Header>{title}</Card.Header>
                    <Label ribbon="right" color="black"><Icon name="user" />{noOfSuggestions}</Label>
                    <Card.Meta>{location.city} {location.city && location.city.length > 0 && ' ,'} {location.country}</Card.Meta>
                    <Card.Description className="job-summary">{summary}</Card.Description>
                </Card.Content>
                <Card.Content extra className="center">
                    {(today - expiryDate > 0) &&
                        <Button color='red' size='mini' floated="left">
                            Expired
                        </Button>
                    }
                    <Button.Group size="mini" floated="right">
                        <Button basic color='blue' disabled={isLoading} onClick={() => this.closeJob(id)}>
                            <Icon name="ban" />
                            Close
                        </Button>
                        <Button basic color='blue' as={Link} to={`PostJob/0/${id}`}>
                            <Icon name="edit" />
                            Edit
                        </Button>
                        <Button basic color='blue' as={Link} to={`PostJob/${id}/0`} >
                            <Icon name="copy outline" />
                            Copy
                        </Button>
                    </Button.Group>
                </Card.Content>
            </Card>
        )
    }
}