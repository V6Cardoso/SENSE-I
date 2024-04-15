import {combineReducers} from 'redux';
import experimentReducer from './experimentReducer';

const myReducer = combineReducers({
    experiments: experimentReducer,
});

export default myReducer;