import _ from 'lodash';
import React, {Component, PropTypes} from 'react'

import {connect} from 'react-redux';
import classNames from 'classnames';
import '../css/CreatedEventListMyPage.css';

import {parsePaggingParams} from '../helpers/params'

import EventListItem from '../components/EventListItem'
import Pagination from '../components/Pagination'

// TODO impl created event fetch func
import {fetchTopNEventsIfNeed} from '../flux/modules/top_event'


// TODO: move const to consts file
const DEFAULT_MAX_EVENT_PER_PAGE = 25


class CreatedEventListMyPage extends Component {
    constructor(props) {
      super(props)

      this.state = {
        filterTag: 'all'
      }
    }

    static propTypes = {

    }

    parsePrams() {
      const {location} = this.props
      return parsePaggingParams(location, DEFAULT_MAX_EVENT_PER_PAGE)
    }

    componentDidMount(){
      const params = this.parsePrams()
      const {from, limit} = params
      this.props.fetchEvents(limit, from, 'all')
    }

    componentDidUpdate() {

    }

    renderEventList() {
      const {eventItems} = this.props
      const keys= _.keys(eventItems)

      return (
        <div>
          {this.renderStatusFilters()}

          <div className="ui section divider"></div>

          <div className="ui items">
            {
              keys.map((key, index) => (
                <EventListItem key={key} {...eventItems[key]}/>
              ))
            }
          </div>

          {this.renderPagination()}
        </div>
      )
    }

    // TODO: impl next, prev, select pagging
    onNextPage() {
      console.log("next page")
    }

    onPrevPage() {
       console.log("prev page")
    }

    onChangePage(index) {
      console.log("select page", index)
    }

    renderPagination() {
      const {total, current} = this.props
      return (
          <Pagination
             total={total}
             current={current}
             onNextClick={()=> this.onNextPage()}
             onPrevClick={()=> this.onPrevPage()}
             onChangePage={(index)=> this.onChangePage(index)}/>
        )
    }

    renderPageTitle() {
      return (
        <div className='event-list-title'>
           登録したテーブル
        </div>
      )
    }

    renderStatusFilters() {
      const filters = ["all", "opening", "stopped"]
      const filterNames = ["すべて", "公開中", "停止中"]

      const menuItems = filters.map((filter, index)=>(
        <a className={classNames({
          "item": true,
          "active": this.state.filterTag === filter
        })}
          onClick={()=> this.execFilter(filter)}
        >
        {filterNames[index]}
        </a>
      ))

      return (
        <div className="ui secondary menu status-filter-menu">
          {menuItems}

          <div className="right menu">
             <button className="ui orange icon button">
               <i className="plus icon"></i>
                新規登録
             </button>
            </div>
        </div>
      )
    }

    execFilter(filter) {

      console.log("dispatch filter event list")
      this.setState({
        filterTag: filter
      })
      const params = this.parsePrams()
      const {from, limit} = params
      this.props.fetchEvents(limit, from, filter)
    }

    render() {
      const {isFetching, errorMessage} = this.props
      let content

      if (isFetching) {
        content = (
          <div> Loading... </div>
        )
      }
      else if (!isFetching && errorMessage) {
        content = (
          <div> System Error: {errorMessage} </div>
        )
      }
      else {
        content = this.renderEventList()
      }

      return (
        <div className='created-event-list-mypage'>
          <div className='ui text container'>
            {this.renderPageTitle()}
            {content}
          </div>

          <div>
            <button onClick={
                ()=> {this.props.fetchEvents()}}>
                refresh
            </button>
          </div>
        </div>
      )
    }
}


const mapStateToProps = (state, ownProps) => {
  // TODO: mapping state (current using top event)
  // TODO: fix state for relatied event too!
  const block = state.topEvent["special"]
  const eventId = "test-event-1"

  const eventItems = []

  return {
    isFetching: false,
    errorMessage: "",
    eventItems: block.events,
    total: 10,
    current: 1
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchEvents: (limit, from, filter)=> {
    dispatch(fetchTopNEventsIfNeed("special", 10))
  }
})

export default connect(mapStateToProps,
                       mapDispatchToProps)(CreatedEventListMyPage)
