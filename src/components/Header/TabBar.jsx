import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";

import { selectors } from "reducers";
import { useAuthContext } from "utils/hooks";
import { fetchCategoriesForTabBar } from "actions/category";

import CreateCategoryModal, { useCreateModal } from "./CreateCategoryModal";
import { showModal } from "actions/app";
import { Modals } from "constants/action.types";

const SeparatorView = ({ className }) => {
  return <div className={className}></div>;
};

const Separator = styled(SeparatorView)`
  background-color: #d1d1d1;
  width: 1px;
  margin-top: 8px;
  margin-bottom: 8px;
  flex-shrink: 0;

  margin-right: 15px;
  margin-left: 15px;
`;

const TabBarView = ({ className }) => {
  const dispatch = useDispatch();

  const { hasSignedIn } = useAuthContext();
  const categories = useSelector(selectors.getCategoriesForTabBar);

  const [
    isCreateModalOpen,
    showCreateModal,
    hideCreateModal,
  ] = useCreateModal();

  const tabs = categories.map((c, i) => {
    return (
      <li key={c.id}>
        <NavLink to={`/categories/${c.id}/photos`} activeClassName="active">
          <span className="centered u-text200 u-textGray">{c.name}</span>
        </NavLink>
      </li>
    );
  });

  const onClickCreateCategory = () => {
    if (hasSignedIn) {
      showCreateModal();
    } else {
      dispatch(showModal(Modals.SIGNIN));
    }
  };

  useEffect(() => {
    dispatch(fetchCategoriesForTabBar());
  }, [dispatch]);

  return (
    <div className={"Container Container--fluid " + className}>
      <div className="u-paddingVerticalExtraSmall create-box">
        <button
          className="u-fontMedium u-border u-borderPrimary u-roundedMedium u-cursorPointer u-text200 u-textPrimary"
          onClick={onClickCreateCategory}
        >
          Create
        </button>
      </div>
      <Separator />
      <div className="tabs-container">
        <ul className="tabs">
          {tabs}
          <li></li>
        </ul>
      </div>
      <Separator />
      <div
        className={`
          u-paddingVerticalExtraSmall u-textGray hover:u-textPrimary 
          u-fontMedium u-text200 u-textUnderline view-all
        `}
      >
        <Link to="/categories">
          <span>View all</span>
        </Link>
      </div>

      {isCreateModalOpen && (
        <CreateCategoryModal
          isOpen={isCreateModalOpen}
          show={showCreateModal}
          hide={hideCreateModal}
        />
      )}
    </div>
  );
};

const TabBar = styled(TabBarView)`
  display: flex;
  height: 50px;

  > div {
    overflow-x: hidden;

    &.create-box {
      flex-shrink: 0;
      cursor: pointer;

      > button {
        padding: calc(0.375rem - 1px) 0.7rem;

        transition: all 0.15s ease-in-out;

        user-select: none;
        cursor: pointer;

        border-radius: 4px;

        background-color: transparent;
      }
    }

    &.tabs-container {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      justify-content: center;

      overflow-x: hidden;

      position: relative;

      &::after {
        position: absolute;
        top: 0;
        bottom: 1px;
        right: 0;
        display: block;
        width: 100px;
        pointer-events: none;
        content: "";
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.2) 0,
          #fff 85%,
          #fff
        );
      }

      ul.tabs {
        display: flex;
        flex-direction: row;

        height: 100%;
        min-width: 100%;

        margin: 0;
        padding: 0;

        overflow-x: scroll;

        list-style: none;

        /* Hide the scroll bar */
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }

        > li {
          margin-left: 6px;
          margin-right: 6px;

          &:first-child {
            margin-left: 0;
          }

          &:last-child {
            margin-right: 0;

            padding-left: 15px;
            padding-right: 15px;
          }

          > a {
            display: flex;
            justify-content: center;
            align-items: center;

            box-sizing: border-box;

            height: 100%;

            transition: color 0.1s linear;

            &.active {
              border-bottom: 3px solid #375de7;
              padding-top: 3px;

              > span {
                color: #375de7;
              }
            }

            &:hover {
              text-decoration: none;

              > span {
                color: #375de7;
              }
            }

            > span {
              line-height: 50px;
            }
          }
        }
      }
    }

    &.view-all {
      flex-shrink: 0;

      display: flex;
      flex-direction: column;
      justify-content: center;

      > a {
        cursor: pointer;
        text-underline-position: under;
        color: inherit;
        text-decoration-color: currentColor;
      }
    }
  }
`;

export default TabBar;
