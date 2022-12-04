// import { BeaconWallet } from '@taquito/beacon-wallet';
// import { NetworkType, BeaconEvent, defaultEventCallbacks } from '@airgap/beacon-dapp';
import { useState } from 'react';
// import { TezosToolkit } from '@taquito/taquito';
// import { b58cencode, prefix, Prefix } from '@taquito/utils';
import { useWalletContext } from 'contexts/WalltetContext';
import { Button } from 'components';
import {
  db,
  addDataWithCustomId,
  getCollectionSize,
  getDocumentById,
  updateDocumentData,
} from 'utils';
import useFirebaseConversation from 'hooks/useFirebaseConversation';
import { async } from '@firebase/util';
import { midnightTheme } from '@rainbow-me/rainbowkit';
import { cteateSessionSigner } from 'tezos';
import { Parser, packDataBytes, MichelsonData, MichelsonType } from '@taquito/michel-codec';
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';






// import { useWalletContext } from 'contexts/WalltetContext';
import { sign } from 'crypto';
import { getSessionWallet } from 'helpers/session_signatures';
const contractAddress: string = 'KT1QMGSLynvwwSfGbaiJ8gzWHibTCweCGcu8';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
// const contractAddress2: string = 'KT1UZzu4ar6STUj2Mxde2hKH8LncCmY2vfjt';

// import { generateKeyPair } from '@stablelib/x25519';
// import { InMemorySigner } from '@taquito/signer';

// let signer = InMemorySigner.fromSecretKey(key);
const arbiterContractAddress = 'KT1DXd41KEesjfzMLM4tFMCRbdUUgMBPxmsP';

const TezTest = () => {
  // const [Tezos, setTezos] = useState<TezosToolkit>(
  //   new TezosToolkit('https://ghostnet.ecadinfra.com'),
  // );
  // const [publicToken, setPublicToken] = useState<string | null>(null);
  const [wallet1, setWallet] = useState<any>(null);
  const [storageCount, setStorageCount] = useState<number>(0);

  const { wallet, tezos, isConnected, activeAccount, userAddress, publicToken } =
    useWalletContext();

  const clickHandler = async () => {
    const signer = await cteateSessionSigner(userAddress!);
    // console.log(await signer());
    console.log(await await signer.publicKey());
    console.log(await await signer.publicKeyHash());
    console.log(await await signer.secretKey());

    const contract = await tezos.wallet.at(arbiterContractAddress);

    console.log(await contract.storage());
    // console.log(await (await signer()).sign());
    // // const wallet2 = new BeaconWallet({
    // //   name: 'Taquito React template',
    // //   preferredNetwork: NetworkType.GHOSTNET,
    // //   disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
    // //   eventHandlers: {
    // //     // To keep the pairing alert, we have to add the following default event handlers back
    // //     [BeaconEvent.PAIR_INIT]: {
    // //       handler: defaultEventCallbacks.PAIR_INIT,
    // //     },
    // //     [BeaconEvent.PAIR_SUCCESS]: {
    // //       handler: (data) => setPublicToken(data.publicKey),
    // //     },
    // //   },
    // // });
    // console.log('wallet', wallet);
    // // console.log('wallet2', wallet2);
    // // Tezos.setWalletProvider(wallet!);
    // // const InMemorySigner.fromSecretKey(key).then((theSigner) => {
    // //   Tezos.setProvider({ signer: theSigner });
    // //   //We can access the public key hash
    // //   // return Tezos.signer.publicKeyHash();
    // // });
    // // const pair = generateKeyPair();
    // // let key = b58cencode(pair.secretKey, prefix.edsk2);
    // // const b58encodedSecret = b58cencode(pair.secretKey, prefix[Prefix.P2SK]);
    // // console.log('key', key);
    // // const signer = await InMemorySigner.fromSecretKey(key);
    // // console.log('signer', signer);
    // // Tezos.setProvider({ signer });
    // setWallet(wallet);
    // // checks if wallet was connected before
    // // const activeAccount = await wallet.client.getActiveAccount();
    // // console.log('activeAccount', activeAccount);
    // const contract = await tezos.wallet.at(contractAddress);
    // // console.log(contract);
    // // console.log(contract.methods);
    // const op = await contract.methods.increment(1).send();
    // // const op = await contract.methods
    // //   .proposeGame('tz1eqJtX6Gyv9ZVmcTFo4pB34TTLcCkmnxPi')
    // //   .send();
    // console.log(op);
    // const storage: any = await contract.storage();
    // console.log(storage);
    // // setStorageCount(storage.toNumber());
  };

  const [newGameId, setNewGameId] = useState<number | null>(null);

  const proposeGameHandler = async () => {
    try {
      setNewGameId(null);
      if (!userAddress) throw new Error('no user address');
      const contract = await tezos.wallet.at(arbiterContractAddress);

      const op = await contract.methods.proposeGame(contractAddress, await cteateSessionSigner(userAddress)).send();

      // console.log(op);
      const confirmation = await op.confirmation(1);

      console.log('cofirmation', confirmation);

      const gamesCollectionSize = await getCollectionSize(db, 'testgames');
      const newGameId = gamesCollectionSize + 1;
      await addDataWithCustomId(
        db,
        'testgames',
        {
          proposer: userAddress,
          acceptor: ZERO_ADDRESS,
          gameId: newGameId,
          tameRules: 'tic-tac-toe',
          txHash: op.opHash,
        },
        newGameId,
      );
      setNewGameId(newGameId);
    } catch (error) {
      console.error(error);
    }
  };

  const [gameIdToAccept, setGameIdToAccpet] = useState<string | null>(null);
  const [gameAccepted, setGameAccepted] = useState<boolean | null>(null);

  const acceptGameHandler = async () => {
    setGameAccepted(null);
    try {
      if (!userAddress) throw new Error('no user address');
      if (!gameIdToAccept || Number.isNaN(Number(gameIdToAccept)))
        throw new Error('game id not a number');
      const game = await getDocumentById(db, 'testgames', gameIdToAccept);
      // console.log(game);
      if (!game) throw new Error(`game with id=${gameIdToAccept} doesn't exist`);
      if (game.acceptor !== ZERO_ADDRESS) throw new Error('Cant accept game');

      const contract = await tezos.wallet.at(arbiterContractAddress);

      const op = await contract.methods.acceptGame(gameIdToAccept, await cteateSessionSigner(userAddress)).send();
      console.log(op);
      const confirmation = await op.confirmation(1);
      console.log(confirmation);
      const gameUpdateData = { ...game, acceptor: userAddress, txAcceptHash: op.opHash };

      await updateDocumentData(db, 'testgames', gameUpdateData, gameIdToAccept);
      setGameAccepted(true);
    } catch (error) {
      console.error(error);
      setGameAccepted(false);
    }
  };

  const disputeMoveHandler = async () => {

    const contract = await tezos.wallet.at(arbiterContractAddress);


//     const data = `(Pair 
// (Pair
//   { Elt 1 
//    (Pair
//       (Pair "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")
//             0x0501000000026869) }
// 10000000)
// (Pair 2 333))`;

    //const type = `(pair (pair (map int (pair (pair address address) bytes)) int) (pair int int))`;

    const move = 5; 

    const moveData2 = `${move}`;

    const moveTypes2 = `int`

    {
      const p = new Parser();
      const typeJSON = p.parseMichelineExpression(moveTypes2);
      console.log("typeJSON", typeJSON)
      const dataJSON = p.parseMichelineExpression(moveData2);
      console.log("dataJSON", dataJSON)
      

      const packed = packDataBytes(
        dataJSON  as MichelsonData,
        typeJSON  as MichelsonType
      );
      console.log("packed move", packed)
    }


    const board = [0,0,0,
      0,0,0,
      0,0,0,]

    const xwins = false;
    const owins = false;

    function toBBBString(value: boolean) {
      return value? "True": "False";
    }

    const stateData2 = `(Pair (Pair {
      Elt 0 ${board[0]} ;
      Elt 1 ${board[1]} ;
      Elt 2 ${board[2]} ;
      Elt 3 ${board[3]} ;
      Elt 4 ${board[4]} ;
      Elt 5 ${board[5]} ;
      Elt 6 ${board[6]} ;
      Elt 7 ${board[7]} ;
      Elt 8 ${board[8]} }
      ${toBBBString(xwins)})
      ${toBBBString(owins)})`

    const stateTypes2 = `(pair (pair (map int int)
    bool)
    bool)`

    {
      const p = new Parser();
      const typeJSON = p.parseMichelineExpression(stateTypes2);
      console.log("typeJSON", typeJSON)
      const dataJSON = p.parseMichelineExpression(stateData2);
      console.log("dataJSON", dataJSON)
      

      const packed = packDataBytes(
        dataJSON  as MichelsonData,
        typeJSON  as MichelsonType
      );
      console.log("packed state", packed)
    }

    

    const data = {
      game_id: 1,
      move: '0x050000',
      new_state:
        '0x0507070707020000003607040000000007040001000007040002000007040003000007040004000007040005000007040006000007040007000007040008000003030303',
      nonce: 0,
      old_state:
        '0x0507070707020000003607040000000007040001000007040002000007040003000007040004000007040005000007040006000007040007000007040008000003030303',
      player: 'edpkvDAatRUADfmmkXvTVDydxTupAd3z8e8ngpzp8vKMRjaQtRxbY5',
    };

    const newMapfromLiteral = MichelsonMap.fromLiteral(data);
    console.log("newMapfromLiteral", newMapfromLiteral)
    
    const type1 = `(pair %game_move
      (pair (pair (nat %game_id) (bytes %move)) (bytes %new_state) (nat %nonce))
      (bytes %old_state)
      (key %player))`;

    const type2 = `(pair (pair (nat %game_id) (bytes %move)) (bytes %new_state) (nat %nonce))
      (bytes %old_state)
      (key %player)`;

    const data1 =  `(Pair
      (Pair (Pair Elt ${data.game_id} ${data.move}) ${data.new_state} ${data.nonce})
      ${data.old_state}
      "${data.player}"
      )`
    
    const data2 = `(Pair (Pair Elt ${data.game_id} ${data.move}) ${data.new_state} ${data.nonce})
      ${data.old_state}
      "${data.player}"` 

    console.log(data1);
    console.log(data2);
    

    // We first use the `Parser` class and its `parseMichelineExpression` method to transform the Michelson data and type into their JSON representation
    {
      const p = new Parser();
      const typeJSON = p.parseMichelineExpression(type1);
      console.log("typeJSON", typeJSON)
      const dataJSON = p.parseMichelineExpression(data1);
      console.log("dataJSON", dataJSON)
      

      const packed = packDataBytes(
        dataJSON  as MichelsonData,
        typeJSON  as MichelsonType
      );
      console.log("packed", packed)
    }
    // We first use the `Parser` class and its `parseMichelineExpression` method to transform the Michelson data and type into their JSON representation
    {
      const p = new Parser();
      const typeJSON = p.parseMichelineExpression(type2);
      console.log("typeJSON", typeJSON)
      const dataJSON = p.parseMichelineExpression(data2);
      console.log("dataJSON", dataJSON)
      

      const packed = packDataBytes(
        dataJSON  as MichelsonData,
        typeJSON  as MichelsonType
      );
      console.log("packed", packed)
    }

    const gameId = [1];

    

    const signatures = {
      tz1eqJtX6Gyv9ZVmcTFo4pB34TTLcCkmnxPi:
        'edsigtcAHRJed7rp7jE2ikhUnr5pjvkRnhAvWwVHGxyckozizyB3ADowdVr5b1BBBynvj5ynZoGAyzzxrV3JRLswUuBp32yxQVY',
    };
    const op = await contract.methodsObject
      .disputeMove({ game_move: data, signatures })
      .send();
    console.log(op);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '4rem',
        flexDirection: 'column',
      }}
    >
      <div>
        <h3>Wallet info:</h3>
        <p style={{ fontSize: '2rem' }}>
          <strong>isConnected:</strong>
          {String(isConnected)}
        </p>
        <p style={{ fontSize: '2rem' }}>
          <strong>Active account:</strong>
          <br />
          accountIdentifier: {String(activeAccount?.accountIdentifier)}
          <br></br>
          address: {String(activeAccount?.address)}
          <br />
          publickKey: {String(activeAccount?.publicKey)}
          <br />
        </p>
        <p style={{ fontSize: '2rem' }}>
          <strong>isConnected:</strong>
          {String(isConnected)}
        </p>
        <p style={{ fontSize: '2rem' }}>
          <strong>userAddress:</strong>
          {String(userAddress)}
        </p>
        <p style={{ fontSize: '2rem' }}>
          <strong>public token:</strong>
          {String(publicToken)}
        </p>
        <p style={{ fontSize: '2rem' }}>
          <strong>Wallet: </strong>
          {String(wallet?.client.name)}
        </p>
      </div>
      {/* <button onClick={clickHandlerInc} style={{ fontSize: '4rem' }}>
        TEST TRANSACTION BUTTON
      </button>
      <div style={{ fontSize: '4rem' }}>contract storage: {storageCount}</div> */}
      <div>
        <h3>Contract interactions:</h3>
        <div>
          <h6>Propose game:</h6>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button value="propose new game" onClick={proposeGameHandler} />

            {newGameId && (
              <p style={{ fontSize: '2rem', marginLeft: '2rem' }}>
                Created new game: {newGameId}
              </p>
            )}
          </div>
        </div>
        <div>
          <h6>Accept game:</h6>
          <input
            style={{ border: '1px solid black' }}
            type="number"
            value={!!gameIdToAccept ? gameIdToAccept : ''}
            onChange={(event) => setGameIdToAccpet(event.target.value)}
          ></input>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button value="accept game" onClick={acceptGameHandler} />
            {gameAccepted !== null && (
              <p style={{ fontSize: '2rem', marginLeft: '2rem' }}>
                {`Game ${gameAccepted ? 'accepted' : 'not accepted'}`}
              </p>
            )}
          </div>
        </div>
        <div>
          <h6>Dispute move:</h6>
          <Button value="dispute move" onClick={disputeMoveHandler} />
        </div>
        <div>
          <h6>signer</h6>
          <Button value="get signer" onClick={clickHandler} />
        </div>
      </div>
    </div>
  );
};

export default TezTest;
