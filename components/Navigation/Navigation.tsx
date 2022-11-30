import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { INavigationProps } from './NavigationProps';
import styles from './Navigation.module.scss';
export const Navigation: React.FC<INavigationProps> = () => {
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);

  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      {isShowMenu && (
        <div className={styles.navigation__menu}>
          <div
            className={styles.navigation__close_button}
            onClick={() => setIsShowMenu(false)}
          >
            <svg className={styles.navigation__icon}>
              <use xlinkHref="/logos/sprite.svg#icon-close"></use>
            </svg>
          </div>
          <ul className={styles.navigation__list_sm}>
            <li className={styles.navigation__list_item}>
              <Link href="/games" className={styles.navigation__link}>
                {t('navigation.gameDemo')}
              </Link>
            </li>
            <li className={styles.navigation__list_item}>
              <Link
                href="https://github.com/ChainHackers/GameJutsu#readme"
                target="_blank"
                rel="noreferrer"
                className={styles.navigation__link}
              >
                {t('navigation.documents')}
              </Link>
            </li>
            <li className={styles.navigation__list_item}>
              <Link href="/team" className={styles.navigation__link}>
                {t('navigation.team')}
              </Link>
            </li>
            <li className={styles.navigation__list_item}>
              <Link
                href="https://discord.gg/a5E9vWbp9R"
                target="_blank"
                rel="noreferrer"
                className={styles.navigation__link}
              >
                <svg className={styles.navigation__icon}>
                  <use xlinkHref="/logos/sprite.svg#icon-discord"></use>
                </svg>
              </Link>
            </li>
            <li className={styles.navigation__list_item}>
              <Link
                href="https://github.com/chainHackers"
                target="_blank"
                rel="noreferrer"
                className={styles.navigation__link}
              >
                <svg className={styles.navigation__icon}>
                  <use xlinkHref="/logos/sprite.svg#icon-github"></use>
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      )}
      <nav className={styles.navigation}>
        <div className={styles.navigation__menu_button} onClick={() => setIsShowMenu(true)}>
          <svg className={styles.navigation__icon}>
            <use xlinkHref="/logos/sprite.svg#icon-menu-bars"></use>
          </svg>
        </div>

        <ul className={styles.navigation__list}>
          <li className={styles.navigation__list_item}>
            <Link href="/games" className={styles.navigation__link}>
              {t('navigation.gameDemo')}
            </Link>
          </li>
          <li className={styles.navigation__list_item}>
            <Link
              href="https://github.com/ChainHackers/GameJutsu#readme"
              target="_blank"
              rel="noreferrer"
              className={styles.navigation__link}
            >
              {t('navigation.documents')}
            </Link>
          </li>
          <li className={styles.navigation__list_item}>
            <Link href="/team" className={styles.navigation__link}>
              {t('navigation.team')}
            </Link>
          </li>
          <li className={styles.navigation__list_item}>
            <Link
              href="https://discord.gg/a5E9vWbp9R"
              target="_blank"
              rel="noreferrer"
              className={styles.navigation__link}
            >
              <svg className={styles.navigation__icon}>
                <use xlinkHref="/logos/sprite.svg#icon-discord"></use>
              </svg>
            </Link>
          </li>
          <li className={styles.navigation__list_item}>
            <Link
              href="https://github.com/chainHackers"
              target="_blank"
              rel="noreferrer"
              className={styles.navigation__link}
            >
              <svg className={styles.navigation__icon}>
                <use xlinkHref="/logos/sprite.svg#icon-github"></use>
              </svg>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
