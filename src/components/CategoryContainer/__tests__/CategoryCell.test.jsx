import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";

import CategoryCell from "../CategoryCell";

describe("CategoryCell", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <CategoryCell
          id={1}
          name={"Something"}
          imageUrl="http://somewhere.com"
          description="random text"
        />
      </BrowserRouter>
    );
  });

  it("should render a span which shows the category's name", () => {
    expect(document.querySelector("span")).not.toBeNull();
    expect(document.querySelector("span").textContent).toBe("Something");
  });

  it("should render a <a> and a <img> inside it", () => {
    expect(document.querySelector("a")).not.toBeNull();

    expect(document.querySelector("a").getAttribute("href")).toBe(
      "/categories/1/photos"
    );

    expect(document.querySelector("a > img")).not.toBeNull();

    expect(document.querySelector("a > img").getAttribute("src")).toBe(
      "http://somewhere.com"
    );
  });
});
