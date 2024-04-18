const initialState = {
    devices: [],
  };
  
const deviceReducer = (state = initialState, action) => {
    switch (action.type) {
      
      case "SET_DEVICES_LIST":
        return {
          ...state,
          devices: action.payload,
        };

      default:
        return state;
    }
  };
  
  
  export default deviceReducer