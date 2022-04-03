import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
// import Button from '../Button/index';

function AccountInfo(props) {
  console.log('PROPS', props);
  return (
    <div className={styles.AccountInfo}>
      {props.userInfo && <p>Your RAST balance: 42</p>}

      <Button className={styles.myButton} onClick={props.onClickConnectButton}>
        {props.userInfo ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
}

AccountInfo.propTypes = {};

export default AccountInfo;
