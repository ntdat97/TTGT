import {
    UPDATE_PIC,
    DEL_STATE_REPORT,
    UPDATE_TYPE,
    MARKER,
    FINAL_POSITION,
    UPDATE_CONTENT,
    SUBMIT,
    USER_INFO,
    SUBMIT_TIME,
    UPDATE_TITLE,
    IS_LOGGED,
    ADMIN_ACCOUNT,
    UPDATE_PIC_RESPONSE,
    RESPONSE_CONTENT,
    SET_SEGMENT_DATA,
    PUSH_NEW_SEGMENT,
    REMOVE_SEGMENT,
    SET_SEGMENT,
    DEL_SEGMENT_STATE,
    SET_LENGTH_STATUS_BEFORE_EDIT,
    FILTER
} from '../actions/types'
const initialState = {
    picList: [],
    check: 1,
    marker: [],
    finalPosition: null,
    content: null,
    title: null,
    userInfo: { name: '', phone: '', email: '', anonymous: false },
    submitTime: null,
    logged: false,
    adminAccount: [],
    picListResponse: [],
    responseContent: '',
    statusLengthBeforeEdit: 0,
    status: [
        {
            selectedIndex: 0,
            status: '',
            responseContent: '',
            picListResponse: [],
            addedTime: ''
        }
    ],
    filter: [],
}
const reportReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PIC:
            return {
                ...state,
                picList: action.data
            }
        case DEL_STATE_REPORT:
            return {
                ...state,
                picList: [],
                check: 1,
                marker: [],
                finalPosition: null,
                content: null,
                title: null,
                userInfo: { name: '', phone: '', email: '', anonymous: false },
            }
        case UPDATE_TYPE:
            return {
                ...state,
                check: action.check
            }
        case MARKER:
            return {
                ...state,
                marker: action.marker
            }
        case FINAL_POSITION:
            return {
                ...state,
                finalPosition: action.finalPosition
            }
        case UPDATE_CONTENT:
            return {
                ...state,
                content: action.content
            }
        case UPDATE_TITLE:
            return {
                ...state,
                title: action.title
            }
        case SUBMIT:
            return {
                ...state,
                userSubmit: state
            }
        case SUBMIT_TIME:
            return {
                ...state,
                submitTime: action.submitTime
            }
        case USER_INFO:
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    name: action.info.name,
                    phone: action.info.phone,
                    email: action.info.email,
                    anonymous: action.info.anonymous
                }
            }
        case IS_LOGGED:
            return {
                ...state,
                logged: action.logged
            }
        case ADMIN_ACCOUNT:
            return {
                ...state,
                adminAccount: action.adminAccount
            }
        case UPDATE_PIC_RESPONSE:
            return {
                ...state,
                status: state.status.map(
                    (picList, i) => i === action.picListResponse.selectedIndex ? { ...picList, picListResponse: action.picListResponse.picListResponse } : picList
                )
            }
        case RESPONSE_CONTENT:
            return {
                ...state,
                responseContent: action.responseContent
            }
        case SET_SEGMENT_DATA:
            return {
                ...state,
                status: state.status.map(
                    (content, i) => i === action.segmentData.selectedIndex ? { ...content, responseContent: action.segmentData.content } : content
                )
            }
        case PUSH_NEW_SEGMENT:
            return {
                ...state,
                status: [...state.status, action.newItem]
            }
        case REMOVE_SEGMENT:

            return {
                ...state,
                status: [...state.status.slice(0, action.index), ...state.status.slice(action.index + 1)]
            }
        case SET_SEGMENT:
            return {
                ...state,
                status: action.data
            }
        case DEL_SEGMENT_STATE:

            return {
                ...state,
                status: [{
                    selectedIndex: 0,
                    status: '',
                    responseContent: '',
                    picListResponse: [],
                    addedTime: ''
                }]
            }
        case SET_LENGTH_STATUS_BEFORE_EDIT:
            return {
                ...state,
                statusLengthBeforeEdit: action.length
            }
        case FILTER:
            return {
                ...state,
                filter: action.filter
            } 
        default: return state
    }

}
export default reportReducer