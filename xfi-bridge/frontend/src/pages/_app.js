import '../globals.css';
import { Connect } from '@stacks/connect-react';
import { AppConfig, UserSession } from '@stacks/connect';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const [userSession, setUserSession] = useState();

  useEffect(() => {
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    setUserSession(new UserSession({ appConfig }));
  }, []);

  if (!userSession) {
    return null;
  }

  const appConfig = {
    appName: 'XFI-sBTC Bridge',
    appIconUrl: '/logo.png', // Make sure this file exists in your public folder
    network: process.env.NEXT_PUBLIC_NETWORK || 'testnet', // Use an environment variable to set the network
    userSession
  };

  return (
    <Connect authOptions={appConfig}>
      <Component {...pageProps} />
    </Connect>
  );
}

export default MyApp;