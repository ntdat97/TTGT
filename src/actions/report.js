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
} from './types'
export const updatePic = (data) => ({
    type: UPDATE_PIC,
    data: data
})
export const del_state = () => ({
    type: DEL_STATE_REPORT
})
export const updateType = (check) => ({
    type: UPDATE_TYPE,
    check: check
})
export const setMarker = (marker) => ({
    type: MARKER,
    marker: marker
})
export const setFinalPosition = (finalPosition) => ({
    type: FINAL_POSITION,
    finalPosition: finalPosition
})
export const updateContent = (content) => ({
    type: UPDATE_CONTENT,
    content: content
})
export const updateTitle = (title) => ({
    type: UPDATE_TITLE,
    title: title
})
export const updateUserInfo = (info) => ({
    type: USER_INFO,
    info: info
})
export const submitReport = () => ({
    type: SUBMIT
})
export const getSubmitTime = (submitTime) => ({
    type: SUBMIT_TIME,
    submitTime: submitTime
})
export const isLogged = (logged) => ({
    type: IS_LOGGED,
    logged: logged
})
export const setAdminAccount = (adminAccount) => ({
    type: ADMIN_ACCOUNT,
    adminAccount: adminAccount
})
export const setResponsePic = (picListResponse) => ({
    type: UPDATE_PIC_RESPONSE,
    picListResponse: picListResponse
})
export const setResponseContent = (responseContent) => ({
    type: RESPONSE_CONTENT,
    responseContent: responseContent
})
export const setSegmentData = (segmentData) => ({
    type: SET_SEGMENT_DATA,
    segmentData: segmentData
})
export const addNewSegment = (newItem) => ({
    type: PUSH_NEW_SEGMENT,
    newItem: newItem
})
export const removeSegment = (index) => ({
    type: REMOVE_SEGMENT,
    index: index
})
export const setSegment = (data) => ({
    type: SET_SEGMENT,
    data: data
})
export const delSegmentState = () => ({
    type: DEL_SEGMENT_STATE,
})
export const setLengthStatusBeforeEdit = (length) => ({
    type: SET_LENGTH_STATUS_BEFORE_EDIT,
    length:length
})
export const setFilter = (filter) => ({
    type: FILTER,
    filter:filter
})