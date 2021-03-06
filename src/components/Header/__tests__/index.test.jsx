import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Header from "..";

const FromAuth = require("utils/hooks");
FromAuth.useAuthContext = jest.fn().mockImplementation(() => {
  return { authTokens: "", signOut: () => {} };
});

const FromSigninModal = require("../SigninModal");
FromSigninModal.useSigninModal = jest
  .fn()
  .mockReturnValue([false, jest.fn(), jest.fn()]);

const FromSignupModal = require("../SignupModal");
FromSignupModal.useSignupModal = jest
  .fn()
  .mockReturnValue([false, jest.fn(), jest.fn()]);

const FromTabBar = require("../TabBar");
FromTabBar.default = jest.fn().mockImplementation(() => {
  return <p id="tab-bar">TabBar</p>;
});

describe("Header", () => {
  let getByText;

  beforeEach(() => {
    ({ getByText } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    ));
  });

  it("should render a logo", () => {
    expect(document.querySelector("img").getAttribute("alt")).toBe("Got It");
  });

  it("should render a tab bar", () => {
    expect(getByText("TabBar")).toBeInTheDocument();
  });

  it("should render a login button", () => {
    expect(getByText("Login", { selector: "button" })).toBeInTheDocument();
  });

  it("should render a sign up button", () => {
    expect(getByText("Sign up", { selector: "button" })).toBeInTheDocument();
  });
});
