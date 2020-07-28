import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Button, Card, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
    }

    render() {
        const { title, location, noOfSuggestions, summary } = this.props;
        return (
            <Card>
                <Card.Content>
                    <Card.Header>{title}</Card.Header>
                    <Label ribbon="right" color="black"><Icon name="user" />{noOfSuggestions}</Label>
                    
                    <Card.Meta>{location.city}, {location.country}</Card.Meta>
                    <Card.Description>{summary}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button color='red'>
                        Expired
                    </Button>
                    <Button basic color='blue'>
                        <Icon name="ban" />
                        Close
                    </Button>
                    <Button basic color='blue'>
                        <Icon name="edit"/>
                        Edit
                    </Button>
                    <Button basic color='blue'>
                        <Icon name="copy outline" />
                        Copy
                    </Button>
                </Card.Content>
            </Card>
        )
    }
}