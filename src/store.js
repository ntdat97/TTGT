import {createStore, combineReducers} from 'redux';
import reportReducer from './reducer/reportReducer'
const rootReducer = combineReducers({
    reportReducer:  reportReducer
})
const configureStore = () => createStore(rootReducer)
export default configureStore