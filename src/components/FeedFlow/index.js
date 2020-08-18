/**
 * 组件功能
 * 1. 封装信息流的数据请求
 * 2. 封装信息流的卡片样式及组装
 * 3. 封装埋点及上报功能
 * 4. 封装交互功能
 */

import React, { useState, useEffect } from 'react'

import { requestFeed } from '../../api'
import Feed from '../Feed'
import ProductItem from '../ProductItem'

import './index.scss'

const elemRoot = document.querySelector('#root')
const viewPortHeight = document.documentElement.clientHeight

const FeedFlow = (props) => {
  // 推荐商品的状态
  const [pageSize] = useState(20)
  const [mark, setMark] = useState('')
  const [hasNext, setHasNext] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [productList, setProductList] = useState([])

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
      imgUrl: `https:${imagePath}`,
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
            {/* <img
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
            /> */}
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

  // 获取商品
  function getProducts(nextMark) {
    const params = {
      mark: nextMark,
      pageSize,
    }
    return requestFeed(params)
      .then(res => {
        // res = productMockData
        console.log(res)
        const { data, success } = res
        if (success && data) {
          const { productList: newProductList = [], hasNext: newHasNext, mark: newMark } = data
          const curProductList = [].concat(productList).concat(newProductList)
          let newHasMore
          if (newHasNext && curProductList.length < maxProductCount) {
            newHasMore = true
          } else {
            newHasMore = false
          }
          setHasMore(newHasMore)
          setProductList(curProductList)
          setHasNext(newHasNext)
          setMark(newMark)
        } else {
          // 获取商品失败的异常处理

        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 初始数据加载
  useEffect(
    () => {
      getProducts('')
    },
    []
  )

  // 滚动监听
  useEffect(
    () => {
      function scrollHandler(e) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        const contentHeight = elemRoot.scrollHeight
        if (
          (contentHeight - scrollTop - viewPortHeight < viewPortHeight / 2)
          && !isLoading
          && hasMore
        ) {
          isLoading = true
          getProducts(mark)
            .then(res => {
              isLoading = false
            })
            .catch(err => {
              isLoading = false
            })
        }
      }
      document.addEventListener('scroll', scrollHandler)
      return function cleanup() {
        document.removeEventListener('scroll', scrollHandler)
      }
    },
    [hasMore, mark, productList, pageSize],
  )

  return (
    productList
      ? (
        <div className="feed-flow-container">
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
                  {/* <img alt="没有更多啦~" className="no-more-img" src={noMoreImg} /> */}
                </div>
              )
              : null
          }
        </div>
      )
      : null
  )
}

export default FeedFlow
