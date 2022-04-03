import React, { Component } from 'react';
import BasicTable from '../../../Components/Table';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './styles.module.scss';

export default class Wallet extends Component {
  render() {
    return (
      <>
        {this.props.isLoading ? (
          <CircularProgress className={styles.LoadingSpinner} />
        ) : (
          this.props.balances && (
            <BasicTable
              rows={this.props.balances.map((elem) => ({
                token: elem.currency.symbol,
                balance: elem.value,
              }))}
            />
          )
        )}
      </>
    );
  }
}
