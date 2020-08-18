import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'

import Feed from '@src/components/Feed'
import ProductItem from '@src/components/ProductItem'
import { headImg5, shopCartImg, noMoreImg } from '@src/utils/imgHelper'
import jumpHref from '@src/utils/jumpHref'
import { addCart } from '@src/utils/shopCartHelper'
import Title from '../Title'

import './index.scss'

const imgPrefix = '//img12.360buyimg.com/vvipservice/'

const RecommendProduct = (props) => {
  const { productList, hasMore } = props
  const dataSource = productList.map(item => ({
    item,
    // 实际使用skuId
    key: item.index,
  }))

  function renderItem(item) {
    const {
      skuId,
      imagePath,
      title,
      promotionPrice,
      productTag,
      jdPrice,
    } = item
    const data = {
      skuId,
      imgUrl: `https:${imgPrefix}${imagePath}`,
      productName: title,
    }
    const currency = '￥'
    return (
      <div
        onClick={() => {
          jumpHref.goProductDetail(skuId)
        }}
      >
        <ProductItem
          item={data}
          lineType="two"
        >
          <div className="bottom-area">
            {
              promotionPrice ? (
                <div className="promotion-price">
                  <div className="amount">
                    {currency}
                    {promotionPrice}
                  </div>
                  <div className="tag">{productTag}</div>
                </div>
              )
                : null
            }
            <div className="origin-price">
              {currency}
              {jdPrice}
            </div>
            <img
              alt="加购"
              className="shopping-cart"
              src={shopCartImg}
              onClick={(e) => {
                e.stopPropagation()
                addCart({
                  skuId,
                  // skuId: '100004016505',
                  sucFun: (res) => {
                    console.log(res)
                    console.log('加购成功')
                  },
                  failFun: () => {
                    console.log('加购失败')
                  },
                })
              }}
            />
          </div>
        </ProductItem>
      </div>
    )
  }

  function setItemHeight(item) {
    const { title, jdPrice, promotionPrice } = item
    let totalHeight = 0
    totalHeight += 11 + 328
    totalHeight += title ? 17 + 56 : 0
    totalHeight += promotionPrice ? 10 + 35 : 0
    totalHeight += jdPrice ? 2 + 33 : 0
    totalHeight += 25
    return totalHeight
  }

  return (
    <div className="recommend-product-container">
      <Title headImg={headImg5} title="为你推荐" />
      <Feed
        extraClass="product-feed"
        contentExtraClass="feed-content"
        dataSource={dataSource}
        // useRealHeight
        useRealHeight={false}
        setItemHeight={setItemHeight}
        renderItem={renderItem}
        useLoadMore
        onLoad={(stopLoading) => {
          setTimeout(() => {
            stopLoading()
          }, 2000)
        }}
      />
      {
        !hasMore
          ? (
            <div className="no-more-wrapper">
              <img alt="没有更多啦~" className="no-more-img" src={noMoreImg} />
            </div>
          )
          : null
      }
    </div>
  )
}

export default withRouter(RecommendProduct)
