import React from 'react'

import './index.scss'

const NewChannelCard = (props) => {
  const {
    skuId,
    imageUrl,
    title,
    price,
    op,
    currency,
  } = props

  return (
    <div className="feed-card new-channel-card">
      <div className="img-wrapper">
        <img src={imageUrl} alt="" />
      </div>
      <div className="main-info">
        <div className="title">{title}</div>
        {
          price
            ? (
              <div className="price">{`${currency}${price}`}</div>
            )
            : null
        }
        {
          op
            ? (
              <div className="op">{`${currency}${op}`}</div>
            )
            : null
        }
      </div>
    </div>
  )
}

export default NewChannelCard
