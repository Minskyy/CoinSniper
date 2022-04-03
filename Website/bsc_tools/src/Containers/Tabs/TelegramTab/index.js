import React, { Component } from 'react';
import styles from './styles.module.scss';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { requestToken } from '../../../redux/App/TgBot/actions';

export default function TelegramTab() {
  const dispatch = useDispatch();
  const tgBot = useSelector((state) => state.tgBot);
  const mainSel = useSelector((state) => state.main);
  return (
    <div className={styles.telegramTab}>
      <p>
        If you hold more than 0.01 RAST/BNB LP in your wallet, you're able to
        use our telegram bot, which will send you an instantaneous update
        anytime a new gem has been found
      </p>
      <Button
        className={styles.myButton}
        onClick={() => dispatch(requestToken(mainSel.address))}
      >
        Request Token
      </Button>
      <p>{tgBot.data}</p>
    </div>
  );
}
