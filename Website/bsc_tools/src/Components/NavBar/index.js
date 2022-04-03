import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

// import Button from '@material-ui/core/Button';
import Button from '../Button/index';

const NavBarLinks = ['About', 'Team', 'Tokenomics'];

function NavBar(props) {
  const history = useHistory();

  return (
    <div className={styles.NavBar}>
      <div className={styles.LinkButtonGroup}>
        {NavBarLinks.map((elem) => {
          return <Button onClick={props.onClickConnectButton}>{elem}</Button>;
        })}
      </div>
      <div className={styles.LaunchAppButton}>
        <Button onClick={() => history.push('/app')}>Launch App</Button>
      </div>
    </div>
  );
}

NavBar.propTypes = {};

export default NavBar;
