import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import WebApp from "@twa-dev/sdk";
import { fromNano } from "ton-core";


function App() {
  const { counter_value, 
          balance, 
          owner_address, 
          contract_address, 
          sendIncrement,
          sendDeposit,
          sendWithdrawalRequest,
        } = useMainContract();
  const { connected } = useTonConnect()
  const showAlert = () => {
    WebApp.showAlert("Hey there!");
  };
  const applyTwaColorScheme = () => {
    const colorScheme = WebApp.colorScheme; // Gets the current color scheme

    if (colorScheme === 'dark') {
      document.body.style.backgroundColor = '#000000'; // Set to dark background
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.style.backgroundColor = '#fff25'; // Set to light background
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };
  applyTwaColorScheme();
  
  // const display_balance = balance ? (balance / 1000000000).toFixed(9) : "Loading..."
  return (
    <div>
      <div className="container">
        <TonConnectButton />
      </div>
      <div>
        
        <div className='Card'>
          <b>{WebApp.platform}</b>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address}</div>
          {/* <b>Our contract Balance</b>
          <div className='Hint'>{contract_balance ?? "Loading..."}</div> */}
        </div>

        <div className='Card'>
          <b>mini app init data:</b>
          <div>{WebApp.initData}</div>
        </div>

        <div className='Card'>
          <b>Owner Address</b>
          <div>{owner_address}</div>
        </div>

        <div className='Card'>
          <b>Contract balance</b>
          <div>{balance ? fromNano(balance) : "Loading..."}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
        <a
          onClick={() => {
            showAlert();
            WebApp.sendData(JSON.stringify({ type: 'balance', value: balance }));
          }}
        >
          Show Alert
        </a>

        <br />

        {connected && (
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment by 2
          </a>
        )}

        <br />

        {connected && (
          <a
            onClick={() => {
              sendDeposit();
            }}
          >
            Request deposit of 0.01 TON
          </a>
        )}

        <br />

        {connected && (
          <a
            onClick={() => {
              sendWithdrawalRequest();
            }}
          >
            Request 0.02 TON withdrawal
          </a>
        )}
      </div>
    </div>
  );
}

export default App;