import { IGignTestComponentProps } from './GignTestComponentProps';
import styles from './GignTestComponent.module.scss';
import { useWalletContext } from 'contexts';
import { char2Bytes, verifySignature } from '@taquito/utils';
import { RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk';
import { useState } from 'react';
export const GignTestComponent: React.FC<IGignTestComponentProps> = () => {
  const [messageToSignTitle, setMessageToSignTitle] =
    useState<string>('Tezos Signed Message:');
  const [messageToSignTimestamp, setMessageToSignTimestamp] =
    useState<string>('2022-11-25T17:2059Z');
  const [messageToSignDappUrl, setMessageToSignDappUrl] = useState<string>('tezos-test-d.app');
  const [messageToSignInput, setMessageToSignInput] = useState<string>('');
  const [signature, setSignature] = useState<string>('n/a');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [signatureToVerify, setSignatureToVerify] = useState<string>('');
  const { wallet, activeAccount, userAddress } = useWalletContext();
  const submitSignFormHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    console.log('submit sign');
    const formattedInput: string = [
      messageToSignTitle,
      messageToSignDappUrl,
      messageToSignTimestamp,
      messageToSignInput,
    ].join(' ');

    const bytes: string = char2Bytes(formattedInput);
    const payloadBytes = '05' + '0100' + char2Bytes(String(bytes.length)) + bytes;
    const payload: RequestSignPayloadInput = {
      signingType: SigningType.MICHELINE,
      payload: payloadBytes,
      sourceAddress: userAddress!,
    };

    const signedPayload = await wallet?.client.requestSignPayload(payload)!;
    const { signature } = signedPayload;
    setSignature(signature);
    setSignatureToVerify(signature);
  };

  const verifySignedMessageSignature = async () => {
    try {
      const formattedInput: string = [
        messageToSignTitle,
        messageToSignDappUrl,
        messageToSignTimestamp,
        messageToSignInput,
      ].join(' ');

      const bytes: string = char2Bytes(formattedInput);
      const payloadBytes = '05' + '0100' + char2Bytes(String(bytes.length)) + bytes;
      if (!!activeAccount) {
        console.log('veryfying');
        const isVerified = verifySignature(
          payloadBytes,
          activeAccount.publicKey,
          signatureToVerify,
        );
        setIsVerified(isVerified);
      }
    } catch (e) {
      console.error(e);
      setIsVerified(null);
      
    }
  };
  return (
    <div className={styles.container}>
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
            onChange={(event) => setMessageToSignInput(event.target.value)}
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
    </div>
  );
};
