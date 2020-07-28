import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData }, () => {
                console.log(this.state);
            })
        )
        
        console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        let queryString = `activePage=${this.state.activePage}&`;
        queryString += Object.keys(this.state.filter)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(this.state.filter[k]))
            .join('&');

        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs?';
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: link + queryString,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                this.setState({ loadJobs: res.myJobs });
                callback();
            }.bind(this)
        })
       // your ajax call and other logic goes here
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        const { activePage, totalPages } = this.state;
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of Jobs</h1>
                    <Icon name="filter" /> <p>Filter:</p>
                    <Dropdown
                        inline
                        floating
                        options={[]}
                        search
                        text='Choose filter'
                    />
                    <Icon name="calendar" /> <p>Sort by date:</p>
                    <Dropdown
                        inline
                        floating
                        options={[]}
                        search
                        text='Newest first'
                    />
                    <Card.Group>
                        {this.state.loadJobs.length > 0 ? this.state.loadJobs.map(job => (<JobSummaryCard key={job.id} {...job} />)) : <p>No Jobs Found</p>}
                    </Card.Group>

                    <Pagination defaultActivePage={activePage} totalPages={totalPages} />
                </div>
            </BodyWrapper>
        )
    }
}