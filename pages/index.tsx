import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import { char2Bytes, verifySignature } from '@taquito/utils';
import {
  BeaconEvent,
  defaultEventCallbacks,
  NetworkType,
  RequestSignPayloadInput,
  SigningType,
} from '@airgap/beacon-sdk';
import { useState } from 'react';

import { TempleWallet } from '@temple-wallet/dapp';
import { useWalletContext } from 'contexts';
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { b58cencode, prefix, Prefix } from '@taquito/utils';
import { generateKeyPair } from '@stablelib/x25519';
import { BeaconWallet } from '@taquito/beacon-wallet';
const contractAddress: string = 'KT1QMGSLynvwwSfGbaiJ8gzWHibTCweCGcu8';

export default function Home() {
  const [messageToSignTitle, setMessageToSignTitle] =
    useState<string>('Tezos Signed Message:');
  const [messageToSignTimestamp, setMessageToSignTimestamp] =
    useState<string>('2022-11-25T17:2059Z');
  const [messageToSignDappUrl, setMessageToSignDappUrl] = useState<string>('tezos-test-d.app');
  const [messageToSignInput, setMessageToSignInput] = useState<string>('');
  const [signature, setSignature] = useState<string>('n/a');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [signatureToVerify, setSignatureToVerify] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { wallet, activeAccount, userAddress, tezos } = useWalletContext();
  const [publickey, setPublicKey] = useState<string>('');

  const submitSignFormHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    console.log('submit sign');
    const formattedInput: string = [
      messageToSignTitle,
      messageToSignDappUrl,
      messageToSignTimestamp,
      messageToSignInput,
    ].join(' ');

    // const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

    const pair = generateKeyPair();
    let key = b58cencode(pair.secretKey, prefix.edsk2);
    const signer = await InMemorySigner.fromSecretKey(key);
    setPublicKey(await signer.publicKey());
    const bytes: string = char2Bytes(formattedInput);
    
    const signature = await signer.sign(bytes);
    console.log(signature);

    setSignature(signature.sig);
    setSignatureToVerify(signature.sig);
  };

  const verifySignedMessageSignature = async () => {
    console.log('called verify');
    try {
      const formattedInput: string = [
        messageToSignTitle,
        messageToSignDappUrl,
        messageToSignTimestamp,
        messageToSignInput,
      ].join(' ');
      const bytes: string = char2Bytes(formattedInput);
      const payloadBytes = '05' + '0100' + char2Bytes(String(bytes.length)) + bytes;
      console.log(activeAccount);
      if (!!activeAccount) {
        console.log('veryfying');
        const isVerified = verifySignature(bytes, publickey, signatureToVerify);
        setIsVerified(isVerified);
      }
    } catch (e) {
      console.error(e);
      setIsVerified(null);
      setError(String(e) + '. ' + 'Check console');
    }
  };

  const clickHandlerInc = async () => {
    const contract = await tezos.wallet.at(contractAddress);
    const op = await contract.methods.increment(1).send();
    console.log(op);
    const storage: any = await contract.storage();
    console.log(storage);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Anti-cheat tool by ChainHackers Gamejutsu</title>
        <meta name="description" content="Anti-cheat tool by Gamejutsu ChainHackers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {error && (
        <div className={styles.error}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}

      <main className={styles.main}>
        <h1>Welcome to Gamejutsu Anticheat</h1>

        <div className={styles.message}>
          <h2>Data to sign:</h2>
          <p>
            <strong>Message title: </strong>
            {messageToSignTitle}
          </p>
          <p>
            <strong>ISO8601formatedTimestamp: </strong>
            {messageToSignTimestamp}
          </p>
          <p>
            <strong>Dapp url: </strong>
            {messageToSignDappUrl}
          </p>
          <form className={styles.form} onSubmit={submitSignFormHandler}>
            <input
              value={messageToSignInput}
              onChange={(event) => {
                setMessageToSignInput(event.target.value);
                setIsVerified(null);
              }}
            ></input>
            <button type="submit">Sign</button>
          </form>
        </div>

        <div className={styles.signedInformtaion}>
          <h2>Signature info</h2>
          <p className={styles.signature}>
            <strong>Signature: </strong>
            {signature}
          </p>
          <input
            value={signatureToVerify}
            onChange={(event) => setSignatureToVerify(event.target.value)}
          ></input>
          <button onClick={verifySignedMessageSignature}>Verify</button>
          <p>
            <strong>Is Verified: </strong>
            {isVerified === null ? "Hasn't verifyed" : String(isVerified)}
          </p>
        </div>
        <button onClick={clickHandlerInc} style={{ fontSize: '4rem' }}>
          TEST TRANSACTION BUTTON
        </button>
      </main>
    </div>
  );
}
