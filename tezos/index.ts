import { InMemorySigner } from '@taquito/signer';
import { b58cencode, prefix, Prefix } from '@taquito/utils';
import { generateKeyPair } from '@stablelib/x25519';
// import { sign } from 'crypto';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@airgap/beacon-dapp';

// const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
export const cteateSessionSigner = async (address: string) => {
  const localStorage = window.localStorage;
  let privateStore = `${address}_tprivate`;
  let privateKey = localStorage.getItem(privateStore);

  if (privateKey) {
    return await InMemorySigner.fromSecretKey(privateKey);
  }

  const pair = generateKeyPair();
  const key = b58cencode(pair.secretKey, prefix.edsk2);
  const signer = await InMemorySigner.fromSecretKey(key);
  localStorage.setItem(privateStore, await signer.secretKey());
  return signer;
};
