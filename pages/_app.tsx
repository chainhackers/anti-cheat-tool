import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Layout } from 'components';
import { WalletContextProvider } from 'contexts';
import 'i18n';
import 'styles/globals.scss';

// import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
// import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
// import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

// import { WalletContextProvider } from 'contexts/WalltetContext';
import { XmtpContextProvider } from 'contexts/XmtpContext';
import XmtpProvider from '../contexts/XmtpProvider';

// const { chains, provider } = configureChains(
//   [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
//   [publicProvider()],
// );

// const { connectors } = getDefaultWallets({
//   appName: 'My RainbowKit App',
//   chains,
// });

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
// });

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.polygon,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [chain.goerli] : []),
  ],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'GameJutsu App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <XmtpContextProvider>
          <WalletContextProvider>
            <XmtpProvider>
              <Layout>
                <Head>
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <Component {...pageProps} />
              </Layout>
            </XmtpProvider>
          </WalletContextProvider>
        </XmtpContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
