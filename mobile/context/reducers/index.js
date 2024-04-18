import {combineReducers} from 'redux';
import experimentReducer from './experimentReducer';
import deviceReducer from './deviceReducer';

const myReducer = combineReducers({
    experiments: experimentReducer,
    devices: deviceReducer
});

export default myReducer;