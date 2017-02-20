// TODO write generic resource reducers
import _ from 'lodash';
import { combineReducers } from 'redux'

// The middleware to call the API for quotes
import { CALL_API } from '../middleware/api'
import Schemas from '../schemas'
import {initEntities} from './initialState'
import {idsToFilteredDict, filterDictByDict} from '../../helpers/params'
import {isLoading} from './loading'

export const CATEGORIES_REQUEST = 'CATEGORIES_REQUEST'
export const CATEGORIES_SUCCESS = 'CATEGORIES_SUCCESS'
export const CATEGORIES_FAILURE = 'CATEGORIES_FAILURE'
export const CATEGORY_REQUEST = 'CATEGORY_REQUEST'
export const CATEGORY_SUCCESS = 'CATEGORY_SUCCESS'
export const CATEGORY_FAILURE = 'CATEGORY_FAILURE'

export const BLOGS_REQUEST = 'BLOGS_REQUEST'
export const BLOGS_SUCCESS = 'BLOGS_SUCCESS'
export const BLOGS_FAILURE = 'BLOGS_FAILURE'
export const BLOG_REQUEST = 'BLOG_REQUEST'
export const BLOG_SUCCESS = 'BLOG_SUCCESS'
export const BLOG_FAILURE = 'BLOG_FAILURE'

export const EVENTS_REQUEST = 'EVENTS_REQUEST'
export const EVENTS_SUCCESS = 'EVENTS_SUCCESS'
export const EVENTS_FAILURE = 'EVENTS_FAILURE'
export const EVENT_REQUEST = 'EVENT_REQUEST'
export const EVENT_SUCCESS = 'EVENT_SUCCESS'
export const EVENT_FAILURE = 'EVENT_FAILURE'

export const NEW_EVENT = 'NEW_EVENT'
export const NEW_EVENT_DATA_CHANGE = 'NEW_EVENT_DATA_CHANGE'
export const NEW_EVENT_SAVE_REQUEST = 'NEW_EVENT_SAVE_REQUEST'
export const NEW_EVENT_SAVE_SUCCESS = 'NEW_EVENT_SAVE_SUCCESS'
export const NEW_EVENT_SAVE_FAILURE = 'NEW_EVENT_SAVE_FAILURE'



export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'


// Uses the API middlware to get a categories
export const fetchCategories = () => {
  return {
    [CALL_API]: {
      endpoint: 'categories',
      types: [CATEGORIES_REQUEST, CATEGORIES_SUCCESS, CATEGORIES_FAILURE],
      schema: Schemas.CATEGORY_ARRAY,
      params: {
        method: 'GET',
        authenticated: false,
        pagging: {
          offset: 50,
          limit: 20
        },
        query: {
          keyword: 'takazaki',
        }
      }
    }
  }
}

export const fetchCategoryDetail = (id) => {
  return {
    [CALL_API]: {
      endpoint: `categories/${id}`,
      types: [CATEGORY_REQUEST, CATEGORY_SUCCESS, CATEGORY_FAILURE],
      schema: Schemas.CATEGORY,
      params: {
        method: 'GET',
      }
    }
  }
}

export const fetchBlogs = () => {
  return {
    [CALL_API]: {
      endpoint: 'blogs',
      types: [BLOGS_REQUEST, BLOGS_SUCCESS, BLOGS_FAILURE],
      schema: Schemas.BLOG_ARRAY,
      params: {
        method: 'GET',
        authenticated: false,
        pagging: {
          offset: 50,
          limit: 20
        },
        query: {
          keyword: 'takazaki',
        }
      }
    }
  }
}

export const fetchBlogDetail = (id) => {
  return {
    [CALL_API]: {
      endpoint: `blogs/${id}`,
      types: [BLOG_REQUEST, BLOG_SUCCESS, BLOG_FAILURE],
      schema: Schemas.BLOG,
      params: {
        method: 'GET',
      }
    }
  }
}

export const fetchUserDetail = (id) => {
  return {
    [CALL_API]: {
      endpoint: `userdetails/${id}`,
      types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
      schema: Schemas.USER,
      params: {
        method: 'GET',
      }
    }
  }
}

export const fetchUserDetailIfNeed = (id) => {
  return (dispatch, getState) => {
    const {loadedUserDetails} = getState()
    if (_.includes(loadedUserDetails, id)) {
      return Promise.resolve()
    } else {
      return dispatch(fetchUserDetail(id))
    }
  }
}

/**
 * fetch list of event with pagging parameter and query options
 * example -1 : fetch latest top 10 event from page 2
 * pagging={offset: 2, limit: 10}, query:{latest: 1}
 * example -2: fetch top 25 special event
 * pagging={limit: 25}, query: {special: 1}
 *
 * when result of this API received, event ids will be filtered
 * to event.classifiedEvents object with specifict query params
 * for example:
 * classifiedEvents={trend: [1, 2, 3], latest: [5, 4, 1],...}
 * [caller]: is object use for specifict which service called that function
 * some values can be is: service=list, ref=top, service=search, ref=search,
 *                        service=mypage, ref=mypage, etc...
 * some reducer can use caller info to split data list to multiple groups.
 */

export const fetchEvents = ({ caller={service:'list',
                                        ref:'top'
                              },
                              pagging={ offset:0,
                                         limit:25
                              },
                              query={},
                            }) => {

  return {
    [CALL_API]: {
      endpoint: 'api_events',
      types: [EVENTS_REQUEST, EVENTS_SUCCESS, EVENTS_FAILURE],
      schema: Schemas.EVENT_ARRAY,
      params: {
        method: 'GET',
        authenticated: false,
        caller: caller,
        pagging: pagging,
        query: query,
      }
    }
  }
}



export const fetchEventDetail = (id) => {
  return {
    [CALL_API]: {
      endpoint: `details/${id}`,
      types: [EVENT_REQUEST, EVENT_SUCCESS, EVENT_FAILURE],
      schema: Schemas.EVENT,
      params: {
        method: 'GET',
      }
    }
  }
}

export const fetchEventDetailIfNeed = (id) => {
  return (dispatch, getState) => {
    const {loadedEventDetails} = getState()
    if (_.includes(loadedEventDetails, id)) {
      return Promise.resolve()
    } else {
      return dispatch(fetchEventDetail(id))
    }
  }
}


// - new event create & save
export const startCreateEvent = () => {
  return {
    type: NEW_EVENT,
    payload: {} 
  }
}

export const changeNewEventData = (data) => {
  return {
    type: NEW_EVENT_DATA_CHANGE,
    payload: {
      data
    } 
  }
}

export const saveNewEvent = (userId, data) => {
  return {
    [CALL_API]: {
      endpoint: `events`,
      types: [NEW_EVENT_SAVE_REQUEST, 
              NEW_EVENT_SAVE_SUCCESS, 
              NEW_EVENT_SAVE_FAILURE],
      schema: Schemas.EVENT,
      params: {
        method: 'POST',
        query: {userId, data}
      }
    }
  }
}

// listening all actions and if has entities in payload
// merge to app's entities database
export const entitiesReducer = (state=initEntities, action) => {
  const {payload} = action
  if (payload && payload.entities) {
    return _.merge({}, state, payload.entities)
  }
  return state;
}

// categories reducer will be storing only categories ids.
export const categoriesReducer = (state=[], action) => {
  switch(action.type) {
    case CATEGORIES_SUCCESS:
      return [...state, action.payload.result]
    default:
      return state
  }
}

// category reducer will store current category id.
export const categoryReducer = (state={isFetching: false, id: null}, action) => {
  switch(action.type) {
    case CATEGORY_REQUEST:
      return _.merge({}, state, {
        isFetching: true
      })
    case CATEGORY_SUCCESS:
      return _.merge({}, state, {
        isFetching: false,
        id: action.payload.result
      })
    case CATEGORIES_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        id: null
      })
    default: return state
  }
}

// blogs reducer will be storing only blogs ids.
export const blogsReducer = (state=[], action) => {
  switch(action.type) {
    case BLOGS_SUCCESS:
      return [...state, action.payload.result]
    default:
      return state
  }
}

// blog reducer will store current blog id.
export const blogReducer = (state={isFetching: false, id: null}, action) => {
  switch(action.type) {
    case BLOG_REQUEST:
      return _.merge({}, state, {
        isFetching: true
      })
    case BLOG_SUCCESS:
      return _.merge({}, state, {
        isFetching: false,
        id: action.payload.result
      })
    case BLOG_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        id: null
      })
    default: return state
  }
}

// events reducer will be storing only events ids.
export const allEventsReducer = (state=[], action) => {
  switch(action.type) {
    case EVENTS_SUCCESS:
      return [...state, ...action.payload.result]
    default:
      return state
  }
}

export const eventIdsByQueryReducer = (state={}, action) => {
  switch(action.type) {
    case EVENTS_SUCCESS:
      const {params} = action
      const {query} = params
      const {pagging} = params
      const {caller} = params
      const {currentPage} = pagging
      const mergedPaggingQuery = Object.assign({}, query, {
        page: currentPage
      })

     return idsToFilteredDict(mergedPaggingQuery, action.payload.result, state)
     
    default:
    return state;
  }
}


// store event ids that data already loaded
export const loadedEventDetailsReducer = (state=[], action) => {
  switch(action.type) {
    case EVENT_SUCCESS:
      return [...state, action.payload.result]
    default:
      return state
  }
}

// user reducer will store current user id.
export const viewingEventDetailReducer = (state={isFetching: true, eventId: null}, action) => {
  switch(action.type) {
    case EVENT_REQUEST:
      return _.merge({}, state, {
        isFetching: true
      })
    case EVENT_SUCCESS:
      return _.merge({}, state, {
        isFetching: false,
        eventId: action.payload.result
      })
    case EVENT_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        eventId: null,
        errorMessage: action.error
      })
    default: return state
  }
}

// save state new event
export const creatingEventReducer = (state={isChanged: false, isSaving: false, data: {}}, action) => {
  switch(action.type) {
    case NEW_EVENT:
      return _.merge({}, state, {
        isSaving: false,
        isChanged: false,
        data: {}
      })
    case NEW_EVENT_DATA_CHANGE:
      return _.merge({}, state, {
        isSaving: false,
        isChanged: true,
        data: _.merge({}, state.data, action.payload.data)
      })
    case NEW_EVENT_SAVE_REQUEST:
      return _.merge({}, state, {
        isSaving: true,
      }) 
    case NEW_EVENT_SAVE_SUCCESS:       
      return _.merge({}, state, {
        isSaving: false,
        isChanged: false
      }) 
    case NEW_EVENT_SAVE_FAILURE:
      return _.merge({}, state, {
        isSaving: false,
        errorMessage: action.error
      })
    default: return state
  }
}

// store users ids that data already loaded
export const loadedUserDetailsReducer = (state=[], action) => {
  switch(action.type) {
    case USER_SUCCESS:
      return [...state, action.payload.result]
    default:
      return state
  }
}

// user reducer will store current user id.
export const viewingUserDetailReducer = (state={isFetching: true, userId: null}, action) => {
  switch(action.type) {
    case USER_REQUEST:
      return _.merge({}, state, {
        isFetching: true
      })
    case USER_SUCCESS:
      return _.merge({}, state, {
        isFetching: false,
        userId: action.payload.result
      })
    case USER_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        userId: null,
        errorMessage: action.error
      })
    default: return state
  }
}


export const getTargetItems = (globalState) => {
  return globalState.entities.targets;
}

export const getGenreItems = (globalState) => {
  return globalState.entities.genres;
}


export const getPlaceTypeItems = (globalState) => {
  return globalState.entities.placeTypes;
}

export const getDressCodeItems = (globalState) => {
  return globalState.entities.dressCodes;
}

export const getSupplementItems = (globalState) => {
  return globalState.entities.supplements;
}

export const getPrefectureItems = (globalState) => {
  return globalState.entities.prefectures;
}

export const getEventByQueryDict = (globalState, queryDict) => {
  const {eventIds} = globalState

  const {entities} = globalState
  const {events} = entities

  const filteredIds = filterDictByDict(queryDict, eventIds)
  return {
    isFetching: isLoading(globalState),
    events: filteredIds.map(eventId => {
      const data = events[eventId]
      return data;
    })
  }
}

export const getEventData = (globalState) => {
  const {entities} = globalState
  const {events} = entities
  const {users} = entities

  const {viewingEventDetail} = globalState
  const {isFetching, errorMessage, eventId} = viewingEventDetail

  let data = eventId ? events[eventId]: null
  if (data) {
    data = _.merge({}, data, {
      owner: users[data.owner],
      members: data.members.map(userId => users[userId])
    })
  }

  return {
    isFetching,
    errorMessage,
    data
  }
}

export const getCreatingEventData = (globalState) => {
  const {creatingEventData} = globalState
  return creatingEventData
}

export const getUserData = (globalState) => {
  const {entities} = globalState
  const {users} = entities

  const {viewingUserDetail} = globalState
  const {isFetching, errorMessage, userId} = viewingUserDetail
  const data = users ? users[userId]: null

  return {
    isFetching,
    isSaving: false, // TODO: save that state in editingUser reducer
    errorMessage,
    data
  }
}