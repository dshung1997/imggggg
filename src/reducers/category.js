const {
  FETCH_CATEGORIES_SUCCESS,
  CREATE_CATEGORY_SUCCESS,
} = require("../constants/action.types");

const initialState = {
  totalCategories: 0,
  categories: [],
  categoriesCreatedByThisUser: [],
};

const category = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_SUCCESS: {
      const nextState = JSON.parse(JSON.stringify(state));

      nextState.categories = action.data["categories"];
      nextState.totalCategories = action.data["total_categories"];

      return nextState;
    }

    case CREATE_CATEGORY_SUCCESS: {
      const nextState = JSON.parse(JSON.stringify(state));

      nextState.categoriesCreatedByThisUser.push(action.data);
      nextState.totalCategories += 1;

      return nextState;
    }

    // TODO: POST_CATEGORY_SUCCESS

    default: {
      return state;
    }
  }
};

const getCategories = (state) => {
  return state.categoriesCreatedByThisUser.concat(state.categories);
};

export { category, getCategories };
