import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

function Button({ children, onClick }) {
  return (
    <button className={styles.Button} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

Button.propTypes = {};

export default Button;
