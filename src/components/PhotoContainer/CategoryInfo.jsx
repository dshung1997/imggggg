import React from "react";
import styled from "styled-components";
import { isNumber } from "lodash";

const CategoryInfoView = ({ className, name, description, totalPhotos }) => {
  return (
    <div className={className}>
      <div className="category-name">
        <p className="u-text1150 u-textDark">{name}</p>
      </div>

      <div className="category-description">
        <p className="u-textGray u-text300">{description}</p>
      </div>

      {isNumber(totalPhotos) && totalPhotos > 0 && (
        <div className="category-stats">
          <p className="u-textGray u-text300">
            A total of <b>{totalPhotos}</b> contribution
            {totalPhotos > 1 ? "s by awesome people !" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

const CategoryInfo = styled(CategoryInfoView)`
  display: flex;
  flex-direction: column;

  svg {
    width: 100%;
    height: 100%;
  }

  > div.category-name {
  }

  > div.category-description {
    display: flex;
    flex-direction: row;

    margin-top: 30px;
  }

  > div.category-stats {
    display: flex;
    flex-direction: row;

    margin-top: 10px;
  }
`;

export default CategoryInfo;
