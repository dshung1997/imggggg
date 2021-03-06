import React, { useState } from "react";
import { Button, Modal, Form } from "@gotitinc/design-system";
import produce from "immer";
import { useDispatch, useSelector } from "react-redux";

import { useAuthContext } from "utils/hooks";
import { signup, signin } from "utils/apis/auth";
import { useSafeSetState } from "utils/hooks";
import { userInfoValidator } from "utils/validators";
import { useDebounce } from "utils/hooks";
import { selectors } from "reducers";
import { Modals } from "constants/action.types";
import { showModal, hideModal } from "actions/app";

export const useSignupModal = () => {
  const dispatch = useDispatch();

  const currentOpenModal = useSelector(selectors.getOpenModal);
  const isOpen = currentOpenModal === Modals.SIGNUP;

  const show = () => {
    dispatch(showModal(Modals.SIGNUP));
  };

  const hide = () => {
    dispatch(hideModal(Modals.SIGNUP));
  };

  return [isOpen, show, hide];
};

const initialState = {
  name: {
    value: "",
    feedback: "",
  },
  email: {
    value: "",
    feedback: "",
  },
  password: {
    value: "",
    feedback: "",
  },
  feedback: "",
};

const SignupModal = ({ isOpen, show, hide }) => {
  const { signIn: storeTokens } = useAuthContext();
  const [state, setState] = useSafeSetState(initialState);

  const [disabled, setDisabled] = useState(false);
  const checkDisabled = useDebounce(() => {
    const shouldBeDisabled =
      state.name.feedback !== "" ||
      state.email.feedback !== "" ||
      state.password.feedback !== "";
    setDisabled(shouldBeDisabled);
  }, 800);
  checkDisabled();

  const setValue = (which, value) => {
    setState(
      produce(state, (draft) => {
        const check = userInfoValidator[which](value);

        draft.feedback = "";
        draft[which].value = value;
        draft[which].feedback = check.passed ? "" : check.message;
      })
    );
  };

  const onInputChange = (e) => {
    const { name: which, value } = e.target;

    setValue(which, value);
  };

  const showError = () => {
    setState(
      (state) =>
        (state.feedback = "Something happened, please reload and log in...")
    );
  };

  const showFeedbackFromResponse = (response) => {
    setState(
      produce(state, (draftState) => {
        if (typeof response.data.data === "string") {
          draftState.feedback = response.data.data;
        } else if (typeof response.data.data === "object") {
          ["email", "name", "password"].forEach((which) => {
            if (response.data.data[which]) {
              draftState[which].feedback = response.data.data[which].join(" ");
            }
          });
        }
      })
    );
  };

  const onClick = () => {
    if (
      state.name.value === "" ||
      state.email.value === "" ||
      state.password.value === ""
    ) {
      setState(
        produce(state, (draftState) => {
          draftState.feedback = "Cannot leave any input empty !";
        })
      );

      setDisabled(true);
      return;
    }

    const info = {
      name: state.name.value,
      email: state.email.value,
      password: state.password.value,
    };

    setDisabled(true);

    signup(info).then((response) => {
      if (response.status === 201) {
        signin(info).then((response) => {
          if (response.status === 200) {
            storeTokens(response.data["access_token"]);
            hide();
          } else {
            showError();
          }
        });
      } else {
        showFeedbackFromResponse(response);
      }
    });
  };

  return (
    <Modal show={isOpen} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>
          Welcome to Imggggg{" "}
          <span role="img" aria-label="">
            🥳
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="loginform.name">
          <Form.Label>Name</Form.Label>
          <Form.Input
            type="text"
            name="name"
            placeholder="What's your name?"
            value={state.name.value}
            onChange={onInputChange}
            isInvalid={state.name.feedback !== ""}
          />
          <Form.Feedback type="invalid">{state.name.feedback}</Form.Feedback>
        </Form.Group>

        <Form.Group controlId="loginform.email">
          <Form.Label>Email</Form.Label>
          <Form.Input
            type="email"
            name="email"
            placeholder="Your email so we contact you"
            value={state.email.value}
            onChange={onInputChange}
            isInvalid={state.email.feedback !== ""}
          />
          <Form.Feedback type="invalid">{state.email.feedback}</Form.Feedback>
        </Form.Group>

        <Form.Group controlId="loginform.password">
          <Form.Label>Password</Form.Label>
          <Form.Input
            type="password"
            name="password"
            placeholder="To secure your account"
            value={state.password.value}
            onChange={onInputChange}
            isInvalid={state.password.feedback !== ""}
          />
          <Form.Feedback type="invalid">
            {state.password.feedback}
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
            className="submit-button u-fontBold"
            onClick={onClick}
            disabled={disabled}
          >
            SIGN UP
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SignupModal;
