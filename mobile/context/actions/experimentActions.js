export const setExperimentsList = (experiment) => {
  return {
    type: "SET_EXPERIMENTS_LIST",
    payload: experiment,
  };
};

export const removeFromExperiments = (experiment) => {
  return {
    type: "REMOVE_EXPERIMENT",
    payload: experiment.id,
  };
};

export const addToExperiments = (experiment) => {
  return {
    type: "ADD_EXPERIMENT",
    payload: experiment,
  };
}
