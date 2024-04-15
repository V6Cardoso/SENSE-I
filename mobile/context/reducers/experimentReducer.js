const initialState = {
    experiments: [],
  };
  
const experimentReducer = (state = initialState, action) => {
    switch (action.type) {
      
      case "SET_EXPERIMENTS_LIST":
        return {
          ...state,
          experiments: action.payload,
        };

      case "REMOVE_EXPERIMENT":
        return {
          ...state,
          experiments: state.experiments.filter((experiment) => experiment.id !== action.payload),
        };

       case "ADD_EXPERIMENT":
        return {
          ...state,
          experiments: state.experiments.concat(action.payload),
        };

      default:
        return state;
    }
  };
  
  
  export default experimentReducer