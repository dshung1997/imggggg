import React, { useState } from "react";
import { Button, Modal, Form } from "@gotitinc/design-system";
import { useDispatch, useSelector } from "react-redux";

import { useAuthContext } from "utils/hooks";
import { signin } from "utils/apis/auth";
import { selectors } from "reducers";
import { Modals } from "constants/action.types";
import { showModal, hideModal } from "actions/app";

const getFeedbackFromResponse = (response) => {
  if (typeof response.data.data === "string") {
    return response.data.data;
  } else if (typeof response.data.data === "object") {
    let feedback = "";
    feedback += response.data.data.email ? response.data.data.email : "";
    feedback += response.data.data.password ? response.data.data.email : "";

    return feedback;
  }
};

export const useSigninModal = () => {
  const dispatch = useDispatch();

  const currentOpenModal = useSelector(selectors.getOpenModal);
  const isOpen = currentOpenModal === Modals.SIGNIN;

  const show = () => {
    dispatch(showModal(Modals.SIGNIN));
  };

  const hide = () => {
    dispatch(hideModal(Modals.SIGNIN));
  };

  return [isOpen, show, hide];
};

const SigninModal = ({ isOpen, show, hide }) => {
  const { signIn: setTokens } = useAuthContext();

  const [disabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }

    if (value === "") {
      setFeedback("Cannot leave any input empty !");
      setDisabled(true);
    } else {
      setFeedback("");
      setDisabled(false);
    }
  };

  const onClick = () => {
    if (email === "" || password === "") {
      setFeedback("Cannot leave any input empty !");
      setDisabled(true);
      return;
    }

    setDisabled(true);

    signin({ email, password }).then((response) => {
      if (response.status === 200) {
        setTokens(response.data["access_token"]);
        hide();
      } else {
        setFeedback(getFeedbackFromResponse(response));
      }
    });
  };

  return (
    <Modal show={isOpen} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>
          Welcome back to Imggggg{" "}
          <span role="img" aria-label="">
            😛
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="loginform.email">
          <Form.Label>Email</Form.Label>
          <Form.Input
            name="email"
            type="email"
            placeholder="Enter your email here"
            onChange={onInputChange}
            value={email}
          />
        </Form.Group>

        <Form.Group controlId="loginform.password">
          <Form.Label>Password</Form.Label>

          <Form.Input
            name="password"
            type="password"
            placeholder="Enter your password here"
            onChange={onInputChange}
            value={password}
          />
        </Form.Group>

        {feedback !== "" && (
          <div className="u-marginTopTiny u-widthFull u-text100 invalid-feedback is-visible">
            {feedback}
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
            LOG IN
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SigninModal;
