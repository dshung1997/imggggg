import React, { useState } from "react";
import { Button, Modal, Form, toast, Icon } from "@gotitinc/design-system";
import produce from "immer";

import { createCategory } from "../../utils/apis/category";
import { useSafeSetState, useDebounce } from "../../utils/hooks";
import { useAuthContext } from "../../context/auth";
import { fetchCategories } from "../../actions/category";
import { useDispatch } from "react-redux";

// TODO: sanitize inputs

const validators = {
  name: (value) => {
    if (value.length < 1 || value.length > 30) {
      return {
        passed: false,
        message: "name should be between 1 and 30 characters",
      };
    }

    return {
      passed: true,
    };
  },

  description: (value) => {
    if (value.length < 1 || value.length > 200) {
      return {
        passed: false,
        message: "description should be between 1 and 200 characters",
      };
    }

    return {
      passed: true,
    };
  },

  imageUrl: (value) => {
    // TODO: find a good regex for this
    if (value.length < 1 || value.length > 200) {
      return {
        passed: false,
        message: "url should be maximum of 200 characters",
      };
    }

    return {
      passed: true,
    };
  },
};

export const useCreateModal = () => {
  const [isCreateModalOpen, setModalOpen] = useState(false);

  const showCreateModal = () => {
    setModalOpen(true);
  };

  const hideCreateModal = () => {
    setModalOpen(false);
  };

  return [isCreateModalOpen, showCreateModal, hideCreateModal];
};

export const CreateCategoryModal = ({ isOpen, show, hide }) => {
  const dispatch = useDispatch();
  const { authTokens } = useAuthContext();

  const [state, setState] = useSafeSetState({
    name: {
      value: "",
      feedback: "",
    },
    description: {
      value: "",
      feedback: "",
    },
    imageUrl: {
      value: "",
      feedback: "",
    },
    feedback: "",
  });

  const [disabled, setDisabled] = useState(false);
  const checkDisabled = useDebounce(() => {
    const shouldBeDisabled =
      state.name.feedback !== "" ||
      state.imageUrl.feedback !== "" ||
      state.description.feedback !== "";
    setDisabled(shouldBeDisabled);
  }, 800);
  checkDisabled();

  const setValue = (which, value) => {
    setState(
      produce(state, (draft) => {
        const check = validators[which](value);

        draft[which].value = value;
        draft[which].feedback = check.passed ? "" : check.message;
      })
    );
  };

  const onInputChange = (e) => {
    const { name: which, value } = e.target;

    setValue(which, value);
  };

  const onClick = () => {
    // TODO: check for error
    const info = {
      name: state.name.value,
      description: state.description.value,
      imageUrl: state.imageUrl.value,
    };

    createCategory(info, authTokens).then((response) => {
      console.log("response", response);

      switch (response.status) {
        case 401: {
          hide();

          toast.error(() => (
            <div className="u-flex u-flexGrow-1 u-cursorDefault">
              <div className="u-marginRightExtraSmall">
                <Icon name="alert" size="medium" />
              </div>
              <div className="u-flexGrow-1">
                <div className="u-fontMedium u-marginBottomExtraSmall">
                  Error
                </div>
                <div>Please reload and try again</div>
              </div>
            </div>
          ));
          break;
        }

        case 400: {
          setDisabled(true);
          setState(
            produce(state, (draftState) => {
              const { message } = response.data;

              if (message.name) {
                draftState.name.feedback = message.name[0];
              }

              if (message.image_url) {
                draftState.imageUrl.feedback = message.image_url[0];
              }

              if (message.description) {
                draftState.description.feedback = message.description[0];
              }
            })
          );

          break;
        }

        case 201: {
          hide();
          dispatch(fetchCategories());
          toast(() => (
            <div className="u-flex u-flexGrow-1 u-cursorDefault">
              <div className="u-marginRightExtraSmall">
                <Icon name="checkmarkCircle" size="medium" />
              </div>
              <div className="u-flexGrow-1">
                <div className="u-fontMedium u-marginBottomExtraSmall">
                  Yeahhhhh !
                </div>
                <div>
                  Category <b>{state.name.value}</b> has just been created
                </div>
              </div>
            </div>
          ));

          break;
        }

        default: {
          return;
        }
      }
    });
  };

  return (
    <>
      <Modal show={isOpen} onHide={hide}>
        <Modal.Header closeButton>
          <Modal.Title>
            Create a new category{" "}
            <span role="img" aria-label="">
              🥰
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="createform.name">
            <Form.Label>Name</Form.Label>
            <Form.Input
              type="text"
              placeholder="The category's name"
              value={state.name.value}
              onChange={onInputChange}
              name="name"
              isInvalid={state.name.feedback !== ""}
            />
            <Form.Feedback type="invalid">{state.name.feedback}</Form.Feedback>
          </Form.Group>

          <Form.Group controlId="createform.url">
            <Form.Label>Image URL</Form.Label>
            <Form.Input
              type="text"
              placeholder="Link to a featuring photo"
              value={state.imageUrl.value}
              onChange={onInputChange}
              name="imageUrl"
              isInvalid={state.imageUrl.feedback !== ""}
            />
            <Form.Feedback type="invalid">
              {state.imageUrl.feedback}
            </Form.Feedback>
          </Form.Group>

          <Form.Group controlId="createform.description">
            <Form.Label>Description</Form.Label>
            <Form.Input
              as="textarea"
              rows={3}
              placeholder="..."
              value={state.description.value}
              onChange={onInputChange}
              name="description"
              isInvalid={state.description.feedback !== ""}
            />
            <Form.Feedback type="invalid">
              {state.description.feedback}
            </Form.Feedback>
          </Form.Group>

          {state.feedback !== "" && (
            <div className="u-marginTopTiny u-widthFull u-text100 invalid-feedback is-visible">
              {state.feedback}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="u-flexGrow-1">
            <Button
              variant="primary"
              width="full"
              className="u-fontBold"
              onClick={onClick}
              disabled={disabled}
            >
              Create
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};