import {
  FETCH_CATEGORIES,
  FETCH_CATEGORY_DETAIL,
  FETCH_CATEGORIES_FOR_TABBAR,
} from "constants/action.types";

import {
  fetchCategoriesByPageNumber,
  fetchCategoryDetail,
  fetchCategoriesForTabBar,
} from "../category";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe("Category action creators", () => {
  describe("fetchCategoriesByPageNumber", () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    it("should use the fallback value page = 1", () => {
      const action = fetchCategoriesByPageNumber();

      expect(action.extra.page).toBe(1);
    });

    it("should return action of type FETCH_CATEGORIES", () => {
      const action = fetchCategoriesByPageNumber();
      expect(action.type).toBe(FETCH_CATEGORIES);
    });

    it("should have promise property", () => {
      const action = fetchCategoriesByPageNumber();

      expect(typeof action.promise).not.toBe("undefined");
      expect(typeof action.promise.then).toBe("function");
    });
  });

  describe("fetchCategoryDetail", () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    it("should be called with a defined categoryId", () => {
      const action = fetchCategoryDetail(2);

      expect(action.extra.categoryId).toBe(2);
    });

    it("should return action of type FETCH_CATEGORY_DETAIL", () => {
      const action = fetchCategoryDetail();
      expect(action.type).toBe(FETCH_CATEGORY_DETAIL);
    });

    it("should have promise property", () => {
      const action = fetchCategoryDetail(2);

      expect(typeof action.promise).not.toBe("undefined");
      expect(typeof action.promise.then).toBe("function");
    });
  });

  describe("fetchCategoriesForTabBar", () => {
    it("should return action of type FETCH_CATEGORIES_FOR_TABBAR", () => {
      const action = fetchCategoriesForTabBar();
      expect(action.type).toBe(FETCH_CATEGORIES_FOR_TABBAR);
    });

    it("should have promise property", () => {
      const action = fetchCategoriesForTabBar();

      expect(action.promise).toBeDefined();
      expect(typeof action.promise.then).toBe("function");
    });
  });
});
