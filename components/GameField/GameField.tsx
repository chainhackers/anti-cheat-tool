import { useTranslation } from 'react-i18next';
import { GameFieldPropsI } from './GameFieldProps';
// import { useQuery } from '@apollo/client';
// import { badgesQuery } from 'queries';
import styles from './GameField.module.scss';
import { Button } from 'components/shared';
// import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { FinishedGameState } from 'gameApi';
import { useWalletContext } from 'contexts';
export const GameField: React.FC<GameFieldPropsI> = ({
  children,
  gameId,
  rivalPlayerAddress,
  isConnected,
  isInDispute,
  finishedGameState,
  onConnect,
}) => {
  const [isShowShade, setShowShade] = useState<boolean>(true);
  const [isShowExplainMove, SetShowExplainMove] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isShowReport, setShowReport] = useState<boolean>(false);
  const [isShowDispute, setShowDispute] = useState<boolean>(false);

  type TMedal = 'bronze' | 'silver' | 'gold';
  type TBelt = 'white' | 'green' | 'black';
  type TAchievement = 'winner' | 'loser' | 'draw' | 'cheater';

  const { t } = useTranslation();

  function isOpponentAddress(address: string): boolean {
    return address === rivalPlayerAddress;
  }

  function isCurrentPlayerAddress(address: string | null): boolean {
    return !!address && !isOpponentAddress(address);
  }

  function makeFinishedGameReasonDescription(
    finishedGameState: FinishedGameState,
  ): string | undefined {
    if (finishedGameState.disqualified) {
      if (isOpponentAddress(finishedGameState.disqualified)) {
        return 'and opponent was disqualified';
      } else {
        return 'because you were disqualified';
      }
    }
    if (finishedGameState.resigned) {
      if (isOpponentAddress(finishedGameState.resigned)) {
        return 'by resignation';
      } else {
        return 'by resignation';
      }
    }
  }

  function makeFinishedGameDescription(
    finishedGameState: FinishedGameState,
  ): string | undefined {
    if (finishedGameState.isDraw) {
      return 'Game end in a draw';
    }
    if (finishedGameState.winner) {
      if (isOpponentAddress(finishedGameState.winner)) {
        return 'Your opponent wins';
      } else {
        return 'You win';
      }
    }
  }

  useEffect(() => {
    console.log('isConnected gameField', isConnected);
    if (!rivalPlayerAddress) {
      setShowShade(true);
      setIsWaiting(true);
    }
    if (!!rivalPlayerAddress) {
      setIsWaiting(false);
      setIsConnecting(true);
      // return;
    }
    if (isConnected) {
      console.log('isConnected gameField', isConnected);
      setIsConnecting(false);
      setIsWaiting(false);
      setShowShade(false);
      // return;
    }
  }, [rivalPlayerAddress, isConnected]);

  useEffect(() => {
    if (isInDispute) {
      setShowShade(true);
      setIsWaiting(false);
      setIsConnecting(false);
      setShowDispute(true);
    }
  }, [isInDispute]);

  useEffect(() => {
    if (!!finishedGameState) {
      setShowShade(true);
      setIsWaiting(false);
      setIsConnecting(false);
      setShowDispute(false);
    }
  }, [finishedGameState]);

  return (
    <div className={styles.container}>
      {isShowShade && (
        <div className={styles.shade}>
          {isWaiting && <div className={styles.wait}>{t('shade.wait')}</div>}
          {isConnecting && (
            <div className={styles.wait}>
              {t('shade.connecting')}
              <div className={styles.connectButton}>
                <Button
                  // borderless
                  // size="sm"
                  value={t('buttons.connect')!}
                  onClick={() => {
                    onConnect(rivalPlayerAddress!);
                  }}
                />
              </div>
            </div>
          )}
          {isShowExplainMove && (
            <div className={styles.wait}>
              {t('shade.connecting')}
              <div className={styles.moveButtonbb}>
                <Button
                  color="black"
                  value="No jump. I move"
                  onClick={() => {
                    onConnect(rivalPlayerAddress!);
                  }}
                />
              </div>
              <div className={styles.moveButtonbr}>
                <Button
                  color="black"
                  value="No jump. Let opponent move"
                  onClick={() => {
                    onConnect(rivalPlayerAddress!);
                  }}
                />
              </div>
              <div className={styles.moveButtonrb}>
                <Button
                  color="black"
                  value="Jump. I move"
                  onClick={() => {
                    onConnect(rivalPlayerAddress!);
                  }}
                />
              </div>
              <div className={styles.moveButtonrr}>
                <Button
                  color="black"
                  value="Jump. Let opponent move"
                  onClick={() => {
                    onConnect(rivalPlayerAddress!);
                  }}
                />
              </div>
            </div>
          )}
          {isShowReport && (
            <div className={styles.report}>
              <div className={styles.whatToReport}>{t('shade.whatToReport')}</div>
              <div className={styles.buttons}>
                <Button value={t('shade.cheating')!} color="black" />
                <Button value={t('shade.inactive')!} />
              </div>
            </div>
          )}
          {isShowDispute && (
            <div className={styles.appeal}>
              <div className={styles.madeAppeal}>{`\${disputeAppealPlayer} ${t(
                'shade.madeAppeal',
              )}`}</div>
              <div className={styles.notice}>{t('shade.notice')}</div>
            </div>
          )}
          {finishedGameState && (
            <>
              <div className={styles.win}>
                {makeFinishedGameDescription(finishedGameState)}
                <div className={styles.small}>
                  {makeFinishedGameReasonDescription(finishedGameState)}
                </div>
              </div>
            </>
          )}
          {/* {finishedGameState && (
            <div className={styles.link}>
              <div className={styles.badges}>
                <div className={styles.text}>Issue your ZK Badge</div>
                {makeBadges()}
              </div>
            </div>
          )} */}
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.room}>Game Id: {gameId ? gameId : 'n/a'}</div>
        <div className={styles.message}></div>
        <div className={styles.prize}></div>
      </div>
      <div className={styles.gameBoardContainer}>{children}</div>
    </div>
  );
};
