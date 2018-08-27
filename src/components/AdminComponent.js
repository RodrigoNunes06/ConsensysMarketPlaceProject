import React from 'react'

export const AdminComponent = (props) => {
  return(
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
        <h1>Welcome to the MarketPlace Admin!</h1>
          <p> Your address is {props.account} </p>
          <p>
            <input
              onChange={props.handleChange}
              placeholder="Address"
              />
          </p>
          <button className="pure-button-primary" onClick={props.handleAddStoreOwner}>
            Add Store Owner
          </button>
        </div>
      </div>
    </main>
  );
};
