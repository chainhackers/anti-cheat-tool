import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Layout } from 'components';
import { WalletContextProvider } from 'contexts';
import 'styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <Layout>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />;
      </Layout>
    </WalletContextProvider>
  );
}
