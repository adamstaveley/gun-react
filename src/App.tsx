import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import { AddData } from './components/AddData';
import { CreateUser } from './components/CreateUser';
import { GetData } from './components/GetData';
import { LoginUser } from './components/LoginUser';
import { MagicLinkAuth } from './components/MagicLinkAuth';
import { ResetPw } from './components/ResetPw';
import { UseGunType } from './hooks/useGUN';

export type AppProps = {
  gun: UseGunType;
}

function App({ gun }: AppProps) {
  const [userCreated, setUserCreated] = React.useState(false);
  const [userCreatedError, setUserCreatedError] = React.useState<string | undefined>();

  const [userLoggedIn, setUserLoggedIn] = React.useState(false);
  const [userLoggedInText, setUserLoggedInText] = React.useState<string | undefined>();

  const [userPwChanged, setUserPwChanged] = React.useState(false);
  const [userPwChangedError, setUserPwChangedError] = React.useState<string | undefined>();

  const [userData, setUserData] = React.useState<string | undefined>();
  const [addDataResult, setAddDataResult] = React.useState<string | undefined>();

  return (
    <div className="App">
      <Router>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <Link to="/play">Play with GUN</Link>
          <Link to="/login">Magic Link Auth</Link>
        </div>
        <Switch>
          <Route path="/play">
            <div>
              <div>
                <CreateUser
                  gun={gun}
                  onSubmit={() => {
                    setUserCreated(false);
                    setUserCreatedError(undefined);
                  }}
                  onCreated={(result) => result ? setUserCreatedError(result) : setUserCreated(true)} />
                {userCreatedError && <p style={{ color: 'red' }}>{userCreatedError}</p>}
                {userCreated && <p style={{ color: 'green' }}>User created!</p>}
              </div>
              <div>
                <LoginUser
                  gun={gun}
                  onSubmit={() => {
                    setUserLoggedIn(false);
                    setUserLoggedInText(undefined);
                  }}
                  onLogin={(ok, result) => {
                    setUserLoggedIn(ok)
                    setUserLoggedInText(result)
                  }}
                />
                {userLoggedIn && <p style={{ color: 'green' }}>User logged in!</p>}
                {userLoggedInText && <p style={{ color: userLoggedIn ? 'green' : 'red' }}>{userLoggedInText}</p>}
              </div>
              <div>
                <ResetPw
                  gun={gun}
                  onSubmit={() => {
                    setUserPwChanged(false);
                    setUserPwChangedError(undefined);
                  }}
                  onChange={(ok, result) => {
                    setUserPwChanged(ok)
                    setUserPwChangedError(result)
                  }}
                />
                {userPwChanged && <p style={{ color: 'green' }}>Password changed!</p>}
                {userPwChangedError && <p style={{ color: 'red' }}>{userPwChangedError}</p>}
              </div>
              {userLoggedIn && (
                <div style={{ backgroundColor: 'lavender', padding: 0, margin: 20 }}>
                  <div>
                    <GetData
                      gun={gun}
                      onSubmit={() => setUserData(undefined)}
                      onDone={(data) => setUserData(data)}
                    />
                    {userData && <p>{userData}</p>}
                  </div>
                  <div>
                    <AddData
                      gun={gun}
                      onSubmit={() => setAddDataResult(undefined)}
                      onDone={(data) => setAddDataResult(data)}
                    />
                    {addDataResult && <p>{addDataResult}</p>}
                  </div>
                </div>
              )}
            </div>
          </Route>
          <Route path="/login">
            <div>
              <MagicLinkAuth gun={gun} />
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
