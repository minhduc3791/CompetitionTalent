import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Grid, Header, Card, Divider } from 'semantic-ui-react';

const PAGE_SIZE = 6;

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
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        let queryString = `activePage=${this.state.activePage}&sortbyDate=${this.state.sortBy.date}&`;
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
                this.setState({
                    loadJobs: res.myJobs,
                    totalPages: res.totalCount / PAGE_SIZE
                });
                callback();
            }.bind(this)
        })
       // your ajax call and other logic goes here
    }

    updateWithoutSave(jobId) {
        this.setState(prevState => ({
            loadJobs: prevState.loadJobs.filter(job => job.id !== jobId),
            isLoading: false,
        }))
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
        const { activePage, totalPages, loadJobs } = this.state;
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container manage-jobs">
                    <Header size="large">List of Jobs</Header>
                    <div className="jobs-content">
                        <Grid column={2}>
                            <Icon name="filter" />Filter:
                            <Dropdown
                                inline
                                floating
                                options={[]}
                                search
                                text='Choose filter'
                            />
                            <Icon name="calendar" />Sort by date:
                            <Dropdown
                                inline
                                floating
                                options={[]}
                                search
                                text='Newest first'
                            />
                        </Grid>
                        {(!loadJobs.length || loadJobs.length === 0) && <Grid><p>No Jobs Found</p></Grid>}
                        <Card.Group className="jobs-list" itemsPerRow={3}>
                            {loadJobs && loadJobs.length > 0 && loadJobs.map(job => (<JobSummaryCard updateWithoutSave={this.updateWithoutSave} key={job.id} {...job} />))}
                        </Card.Group>
                        <Pagination floated="right" defaultActivePage={activePage} totalPages={totalPages} />
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}