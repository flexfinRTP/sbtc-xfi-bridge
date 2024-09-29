import '../globals.css';
import { Connect } from '@stacks/connect-react';
import { AppConfig, UserSession } from '@stacks/connect';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    const session = new UserSession({ appConfig });
    setUserSession(session);
  }, []);

  if (!userSession) {
    return null; // or a loading spinner
  }

  const appConfig = {
    appName: 'XFI-sBTC Bridge',
    appIconUrl: '/logo.png', // Make sure this file exists in your public folder
    network: process.env.NEXT_PUBLIC_NETWORK || 'testnet', // Use an environment variable to set the network
  };

  return (
    <Connect authOptions={{ appDetails: { name: 'XFI-sBTC Bridge', icon: '/logo.png' }, userSession }}>
      <Component {...pageProps} />
    </Connect>
  );
}

export default MyApp;