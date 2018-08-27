import React from 'react'

export const ShopperComponent = (props) => {
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

  return (
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
        <h1>Welcome to the MarketPlace Shopper!</h1>
        <p> Your address is {props.account} </p>
        <h3>Checkout the stores we have!</h3>
          <ul>
            { storeItems }
          </ul>
        </div>
      </div>
    </main>
  )
}
