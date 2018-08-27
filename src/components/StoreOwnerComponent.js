import React from 'react'

export const StoreOwnerComponent = (props) => {
  const storeInstances = props.storeInstances
  let storeItems = <p> No stores available </p>;
  if (storeInstances) {
     storeItems = storeInstances.map( (store, i) =>
      <li key={i}>
        <button className="pure-button-primary" >
          {props.storeNameList[i]}
        </button>
      </li>
    )
  }

  return(
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
        <h1>Welcome to the MarketPlace Store Owner!</h1>
        <p> Your address is {props.account} </p>
        <h3>You can add stores by typing the name in the box!</h3>
          <p>
            <input
              onChange={props.handleChange}
              value={props.text}
              placeholder="Store Name"
              />
          </p>
          <button className="pure-button-primary" onClick={props.handleCreateStore}>
            Add Store
          </button>
          <br />
          <br />
          <ul>
            { storeItems }
          </ul>
        </div>
      </div>
    </main>
  );
};
