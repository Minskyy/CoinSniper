import React from "react";
import BasicTable from "../../../Components/Table";
import styles from "./styles.module.scss";

const rows = [{ token: "bla", lpBurnt: "10", launchDate: "30/05/21" }];

const columns = [
  { id: "token", label: "Token", minWidth: 100, align: "center" },
  { id: "lpBurnt", label: "LP Burnt (BNB)", minWidth: 100, align: "center" },
  { id: "launchDate", label: "Launch date", minWidth: 100, align: "center" },
];

function ApeTools({ balances }) {
  return (
    <div className={styles.tableDiv}>
      {<BasicTable rows={rows} columns={columns} />}
    </div>
  );
}

export default ApeTools;
