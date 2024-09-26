import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BridgePage from './pages/bridge';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Switch>
            <Route exact path="/" component={BridgePage} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;