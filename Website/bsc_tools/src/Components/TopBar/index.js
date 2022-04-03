import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import AccountInfo from "../AccountInfo";
// import Button from '../Button/index';

function TopBar(props) {
  const history = useHistory();

  return (
    <div className={styles.TopBar}>
      <p style={{ cursor: "pointer" }} onClick={() => history.push("/")}>
        BSC tools
      </p>
      <div className={styles.FeaturesDiv}>
        {props.tabs.map((tab) => (
          <p onClick={() => props.handleClickChangeTab(tab.id)}>{tab.name}</p>
        ))}
      </div>
      <AccountInfo
        userInfo={props.userInfo}
        onClickConnectButton={props.onClickConnectButton}
      />
      {/* <p>
        By holding 100$ worth of Rasteirinho/BNB LP you'll be able to access all
        the features in this website, or generate an API key to interact with
        our telegram bot
      </p> */}
    </div>
  );
}

TopBar.propTypes = {};

export default TopBar;
