import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { selectors } from "reducers";
import { fetchCategoriesByPageNumber } from "actions/category";

import Pagination from "../common/Pagination";
import CategoryCell from "./CategoryCell";

const CategoryGridView = ({ className, currentPage }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) =>
    selectors.getCategoriesByPageNumber(state, currentPage)
  );

  const totalPages = useSelector(selectors.getTotalNumberOfRemotePages);

  useEffect(() => {
    dispatch(fetchCategoriesByPageNumber(currentPage));
  }, [currentPage, dispatch]);

  const CategoryCells = categories.map((category) => (
    <div key={category.id}>
      <CategoryCell
        id={category.id}
        imageUrl={category.imageUrl}
        name={category.name}
        description={category.description}
      />
    </div>
  ));

  return (
    <div className={className}>
      <div>{CategoryCells}</div>

      <div className="paginator u-textCenter">
        <Pagination
          currentPage={currentPage}
          totalNumberOfPages={totalPages}
          baseUrl={`/categories#page=`}
        />
      </div>
    </div>
  );
};

export default styled(CategoryGridView)`
  margin-top: 50px;

  > div {
    margin: 0;
    padding: 0;

    margin-left: -6px;
    margin-right: -6px;

    display: flex;
    justify-content: center;

    > div {
      margin: 6px;
    }
  }

  > div.paginator {
    margin-top: 20px;
  }
`;
