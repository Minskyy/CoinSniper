import React, { Component, useState } from 'react';
import TopBar from '../../Components/TopBar';
import axios from 'axios';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';

import ApeTools from '../Tabs/ApeTools';
import TelegramTab from '../Tabs/TelegramTab';
import Wallet from '../Tabs/Wallet';
import {
  connectwallet,
  disconnectWallet,
  getBalances,
} from '../../redux/App/Main/actions';

export default function App() {
  const [chosenTab, setTab] = useState('apeTools');
  const [balanceTableIsloading, setBalanceTableIsloading] = useState(false);
  const [userBalances, serUserBalances] = useState(undefined);
  const dispatch = useDispatch();
  const mainSel = useSelector((state) => state.main);

  async function handleOnClickConnect() {
    if (mainSel.address) {
      await dispatch(disconnectWallet());
    } else {
      await dispatch(connectwallet());
    }
  }

  const appTabs = [
    {
      id: 'apeTools',
      name: 'Ape Tools',
      component: (
        <ApeTools balances={userBalances} isLoading={balanceTableIsloading} />
      ),
    },
    {
      id: 'tgBot',
      name: 'Telegram tools',
      component: <TelegramTab />,
    },
    {
      id: 'wallet',
      name: 'Wallet',
      component: (
        <Wallet balances={userBalances} isLoading={balanceTableIsloading} />
      ),
    },
  ];

  return (
    <div className={styles.App}>
      <TopBar
        tabs={appTabs}
        userInfo={mainSel.address}
        onClickConnectButton={handleOnClickConnect}
        handleClickChangeTab={setTab}
      ></TopBar>
      {appTabs.find((elem) => elem.id === chosenTab).component}
    </div>
  );
}
