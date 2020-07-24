import React, { useState } from "react";
import {
  Header,
  Logo,
  TopMenu,
  Button,
  SafeAnchor,
} from "@gotitinc/design-system";

const MyHeader = () => {
  const [topMenuExcelchat, setTopMenuExcelchat] = useState(
    "products.excelchat"
  );
  return (
    <Header fullWidth>
      <Header.Brand>
        <Logo as={SafeAnchor} name="excelchat" variant="original" height={40} />
      </Header.Brand>
      <Header.Main>
        <Header.Left>
          <TopMenu current={topMenuExcelchat} onSelect={setTopMenuExcelchat}>
            <TopMenu.SubMenu eventKey="products" title="Products">
              <TopMenu.Item eventKey="excelchat">Excelchat</TopMenu.Item>
              <TopMenu.Item eventKey="excelchat_learning">
                Excelchat Learning
              </TopMenu.Item>
              <TopMenu.Item eventKey="excelchat_slack">
                Excelchat for Slack
              </TopMenu.Item>
            </TopMenu.SubMenu>
            <TopMenu.Item eventKey="my_sessions">My sessions</TopMenu.Item>
            <TopMenu.Item eventKey="pricing">Pricing</TopMenu.Item>
          </TopMenu>
        </Header.Left>
        <Header.Right>
          <Button variant="secondary">Login</Button>
          <Button variant="primary" className="u-marginLeftSmall">
            Sign up
          </Button>
        </Header.Right>
      </Header.Main>
    </Header>
  );
};

export { MyHeader as Header };
