import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Grid, Header, Card, Divider } from 'semantic-ui-react';

const PAGE_SIZE = 6;
const SORT_BY_DATE = [
    {key: 'asc', text: 'Oldest First', value: 'asc'},
    {key: 'desc', text: 'Newest First', value: 'desc'},
];
const FILTERS = [
    { key: 'showActive', text: 'Show Active', value: 'showActive' },
    { key: 'showClosed', text: 'Show Closed', value: 'showClosed' },
    { key: 'showDraft', text: 'Show Draft', value: 'showDraft' },
    { key: 'showExpired', text: 'Show Expired', value: 'showExpired' },
    { key: 'showUnexpired', text: 'Show Unexpired', value: 'showUnexpired' },
];

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
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
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.handleChangeSort = this.handleChangeSort.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        console.log(this.state.activePage);
        let queryString = `activePage=${this.state.activePage}&sortbyDate=${this.state.sortBy.date}&`;
        queryString += Object.keys(this.state.filter)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(this.state.filter[k]))
            .join('&');

        var link = 'http://talenttservice.azurewebsites.net/listing/listing/getSortedEmployerJobs?';
        var cookies = Cookies.get('talentAuthToken');

        console.log(this.state.filter);

        $.ajax({
            url: link + queryString,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                console.log(res);
                this.setState({
                    loadJobs: res.myJobs,
                    totalPages: Math.ceil(res.totalCount / PAGE_SIZE)
                });
                callback && callback()
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

    handlePaginationChange(e, { activePage }) {
        this.setState({ activePage }, () => { this.loadData() })
    }

    handleChangeFilter(e, { value }) {
        if (value && value.length >= 0) {
            const filter = TalentUtil.deepCopy(this.state.filter);
            Object.keys(this.state.filter).forEach(f => filter[f] = false);//reset all filter
            value.forEach(v => filter[v] = true)
            this.setState({ filter }, () => { this.loadData() });
        }
    }

    handleChangeSort(e, { value }) {
        console.log(value);
        const sortBy = TalentUtil.deepCopy(this.state.sortBy);
        sortBy.date = value;
        this.setState({ sortBy }, () => { this.loadData() });
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
                                className="dropdown center"
                                inline
                                onChange={this.handleChangeFilter}
                                floating
                                defaultValue={['showActive', 'showDraft', 'showExpired', 'showUnexpired']}
                                multiple
                                options={FILTERS}
                                text='Choose filter'
                            />
                            <Icon name="calendar" />Sort by date:
                            <Dropdown
                                inline
                                floating
                                onChange={this.handleChangeSort}
                                options={SORT_BY_DATE}
                                search
                                value={this.state.sortBy.date}
                            />
                        </Grid>
                        {(!loadJobs.length || loadJobs.length === 0) && <Grid><p>No Jobs Found</p></Grid>}
                        <Card.Group className="jobs-list" itemsPerRow={3}>
                            {loadJobs && loadJobs.length > 0 && loadJobs.map(job => (<JobSummaryCard updateWithoutSave={this.updateWithoutSave} key={job.id} {...job} />))}
                        </Card.Group>
                        <Pagination floated="right" defaultActivePage={activePage} onPageChange={this.handlePaginationChange} totalPages={totalPages} />
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}