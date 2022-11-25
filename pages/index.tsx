import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import { TezosToolkit } from '@taquito/taquito';
import { char2Bytes, verifySignature } from '@taquito/utils';
import { RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import {
  NetworkType,
  AccountInfo
} from "@airgap/beacon-dapp";
import { useEffect, useState } from 'react';

export default function Home() {

  const [messageToSignTitle, setMessageToSignTitle] = useState<string>('Tezos Signed Message:')
  const [messageToSignTimestamp, setMessageToSignTimestamp] = useState<string>('2022-11-25T17:24:39.059Z')
  const [messageToSignDappUrl, setMessageToSignDappUrl] = useState<string>('tezos-test-d.app')
  const [messageToSignInput, setMessageToSignInput] = useState<string>('');
  const [signature, setSignature] = useState<string>('n/a');
  const [activeAccount, setActiveAccount] = useState<AccountInfo>();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [signatureToVerify, setSignatureToVerify] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const wallet = new BeaconWallet({
        name: "Taquito React template",
        preferredNetwork: NetworkType.GHOSTNET,
        disableDefaultEvents: true,
        eventHandlers: {}
  });
  
  console.log('wallet', wallet);


  useEffect(() => {

    const connectWallet = async() => {
    const activeAccount = await wallet.client.getActiveAccount();
    console.log('activeAccount', activeAccount);
    setActiveAccount(activeAccount);

    if (!activeAccount) {
      await wallet.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
          rpcUrl: "https://ghostnet.ecadinfra.com"
        }
      });
    }

    
  }
    connectWallet();
  },[])

  const submitSignFormHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    console.log('submit sign');
    const formattedInput: string = [
    messageToSignTitle,
    messageToSignDappUrl,
    messageToSignTimestamp,
    messageToSignInput,
    ].join(' ');

    console.log('singfomr formatted input', formattedInput);
    const bytes: string = char2Bytes(formattedInput);
    const payloadBytes = '05' + '0100' + char2Bytes(String(bytes.length)) + bytes;
    const userAddress = 'tz1eqJtX6Gyv9ZVmcTFo4pB34TTLcCkmnxPi'
    const payload: RequestSignPayloadInput = {
    signingType: SigningType.MICHELINE,
    payload: payloadBytes,
    sourceAddress: activeAccount?.address,
    };
    
    const signedPayload = await wallet.client.requestSignPayload(payload);
    const { signature } = signedPayload;
    setSignature(signature);
  }

  const verifySignedMessageSignature = async () => {
    console.log('start verifying')
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
        const isVerified = verifySignature(payloadBytes, activeAccount.publicKey, signatureToVerify);
        setIsVerified(isVerified);
      }
    } catch (e) {
      console.error(e);
      setError(String(e) + '. ' + 'Check console');
      
    }  
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Anti-cheat tool by ChainHackers Gamejutsu</title>
        <meta name="description" content="Anti-cheat tool by Gamejutsu ChainHackers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {error && <div className={styles.error}>
        <h2>Error:</h2>
        <p>{error}</p>
      </div>}

      <main className={styles.main}>
        
        <h1>Welcome to Gamejutsu Anticheat</h1>

        <div className={styles.message}>
          <h2>Data to sign:</h2>
          <p><strong>Message title: </strong>{messageToSignTitle}</p>
          <p><strong>ISO8601formatedTimestamp: </strong>{messageToSignTimestamp}</p>
          <p><strong>Dapp url: </strong>{messageToSignDappUrl}</p>
        <form className={styles.form} onSubmit={submitSignFormHandler}>
          
            <input value={messageToSignInput} onChange={(event) => setMessageToSignInput(event.target.value)} ></input>
          <button type='submit'>Sign</button>
        </form>       

        </div>

        <div className={styles.signedInformtaion}>
          <h2>Signature info</h2>
          <p className={styles.signature}><strong>Signature: </strong>{signature}</p>
          <input value={signatureToVerify} onChange={(event) => setSignatureToVerify(event.target.value)} ></input>
          <button onClick={verifySignedMessageSignature}>Verify</button>
          <p><strong>Is Verified: </strong>{isVerified === null ? 'Hasn\'t verifyed' : String(isVerified)}</p>
        </div>
      </main>
    </div>
  )
}
