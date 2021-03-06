import React from "react";
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { useHashParams } from "utils/hooks";
import { selectors } from "reducers";
import { CATEGORIES_PER_PAGE } from "constants/settings";

import CategoryGrid from "./CategoryGrid";
import Container from "../common/Container";

export const CategoryContainer = () => {
  const hashParams = useHashParams();
  const totalCategories = useSelector(selectors.getTotalNumberOfCategories);

  const page = hashParams.getPage();

  // check the params
  if (
    isNaN(page) ||
    (page > 1 && page > Math.ceil(totalCategories / CATEGORIES_PER_PAGE))
  ) {
    return <Redirect to="/categories" />;
  }

  return (
    <Container>
      <div>
        <p className="u-text1150 u-textDark">Categories</p>
        <p className="u-textGray u-text300">
          There are a total of <b>{totalCategories}</b> categories
        </p>
      </div>
      <CategoryGrid currentPage={page} />
    </Container>
  );
};

export default withRouter(CategoryContainer);
