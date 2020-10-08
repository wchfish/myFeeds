/**
 * 组件功能
 * 1. 封装信息流的数据请求
 * 2. 封装信息流的卡片样式及组装
 * 3. 封装埋点及上报功能
 * 4. 封装交互功能
 */

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { requestFeed } from '../../api'
import Feed from '../Feed'
import ProductItem from '../ProductItem'
import NewChannelCardOneColumn from '../Cards/NewChannel/oneColumn'

import './index.scss'

let isLoading = false
const imgPrefix = '//img12.360buyimg.com/vvipservice/'

const FeedFlow = (props) => {
  const {
    appid,
    businessId,
    // layoutType,
    sign,
    firstFeed,
    firstFeedSkuId,
    riskInformation,
    pageSize,
    param,
    scrollContainerId,
    contentContainerId,
    renderItem,
    useRealHeight,
    setItemHeight,
  } = props

  // 推荐商品的状态
  const [hasMore, setHasMore] = useState(true)
  const [productList, setProductList] = useState([])
  const [mark, setMark] = useState('')
  const [pageNum, setPageNum] = useState(0)
  const [layoutType, setLayoutType] = useState(2)

  // 构造dataSource
  const dataSource = productList.map(item => ({
    item,
    // 实际使用skuId
    key: item.index,
  }))

  // 特定业务场景对应的信息流元素渲染方式
  const businessToCardMap = {
    1000001205142150: defaultRenderItem,
  }

  function defaultRenderItem(item) {
    const {
      feedId,
      feedType,
      feedDataDetail,
    } = item
    const {
      skuId,
      title,
      imageUrl,
      flash,
      price,
      op,
      pp,
    } = feedDataDetail
    const currency = '￥'

    if (layoutType === 1) {
      // 根据feedType，区分渲染方式
      if (feedType == '0') {
        const {
          skuId,
          title,
          imageUrl,
          flash,
          price,
          op,
          pp,
        } = feedDataDetail
        return (
          <div
            onClick={() => {
              jumpHref.goProductDetail(skuId)
            }}
          >
            <NewChannelCardOneColumn
              skuId={skuId}
              imageUrl={`https:${imgPrefix}${imageUrl}`}
              title={title}
              price={price}
              op={op}
              currency={currency}
            />
          </div>
        )
      } else {
        return null
      }
    } else if (layoutType === 2) {
      // 根据feedType，区分渲染方式
      if (feedType == '0') {
        
        const data = {
          skuId,
          imgUrl: `https:${imgPrefix}${imageUrl}`,
          productName: title,
        }
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
                  price ? (
                    <div className="promotion-price">
                      <div className="amount">
                        {currency}
                        {price}
                      </div>
                    </div>
                  )
                    : null
                }
                {
                  op
                    ? (
                      <div className="origin-price">
                        {currency}
                        {op}
                      </div>
                    )
                    : null
                }
              </div>
            </ProductItem>
          </div>
        )
      } else {
        return null
      }
    }
  }

  function defaultSetItemHeight(item) {
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
  function getProducts(nextPageNum, nextMark) {
    if (!appid || !businessId) return
    const params = {
      businessId,
      // layoutType,
      sign,
      pageSize,
      pageNum: nextPageNum,
      mark: nextMark,
    }
    return requestFeed(appid, params)
      .then(res => {
        const { code, bizContent } = res
        if (code === 0 && bizContent) {
          const { feedData, mark: newMark, hasNext, layoutType = 2 } = bizContent
          const curProductList = [].concat(productList).concat(feedData)
          let newHasMore
          if (hasNext) {
            newHasMore = true
          } else {
            newHasMore = false
          }
          setHasMore(newHasMore)
          setProductList(curProductList)
          setMark(newMark)
          setPageNum(pageNum + 1)
          // setLayoutType(1)
          setLayoutType(layoutType)
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
      getProducts(1, '')
    },
    []
  )

  // 滚动监听
  useEffect(
    () => {
      // 确定滚动容器和内容容器
      const contentContainer = contentContainerId
        ? document.querySelector(`#${contentContainerId}`)
        : document.body.firstElementChild

      let scrollContainer
      let scrollContainerHeight
      if (scrollContainerId) {
        scrollContainer = document.querySelector(`#${scrollContainerId}`)
        scrollContainerHeight = scrollContainer.clientHeight
      } else {
        scrollContainer = document.documentElement
        scrollContainerHeight = document.documentElement.clientHeight
      }

      function scrollHandler(e) {
        const scrollTop = contentContainerId
          ? contentContainer.scrollTop
          : (document.documentElement.scrollTop || document.body.scrollTop)
        const contentHeight = contentContainer.scrollHeight
        console.log(contentHeight - scrollTop - scrollContainerHeight - scrollContainerHeight / 2)
        if (
          (contentHeight - scrollTop - scrollContainerHeight < scrollContainerHeight / 2)
          && !isLoading
          && hasMore
        ) {
          isLoading = true
          getProducts(pageNum + 1, mark)
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
    [hasMore, pageNum, mark, productList, pageSize],
  )

  return (
    productList
      ? (
        <div className="feed-flow-container">
          <Feed
            extraClass="product-feed"
            contentExtraClass="feed-content"
            layoutType={layoutType}
            dataSource={dataSource}
            // useRealHeight
            useRealHeight={useRealHeight}
            setItemHeight={setItemHeight || defaultSetItemHeight}
            renderItem={renderItem || businessToCardMap[businessId] || defaultRenderItem}
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

FeedFlow.PropTypes = {
  // 应用的appId
  appid: PropTypes.string.isRequired,
  // 业务场景id
  businessId: PropTypes.string.isRequired,
  // 布局类型
  // layoutType: PropTypes.string,
  // 签名
  sign: PropTypes.string,
  // 首焦模块
  firstFeed: PropTypes.string,
  // 针对商品流信息需要首
  firstFeedSkuId: PropTypes.string,
  riskInformation: PropTypes.object,
  // 每页显示信息流条数
  pageSize: PropTypes.number,
  // 商品池分页标记
  mark: PropTypes.string,
  // 额外参数
  param: PropTypes.string,
  // 滚动容器的dom元素id
  scrollContainerId: PropTypes.string,
  // 内容容器的dom元素id
  contentContainerId: PropTypes.string,
  // 数据项的渲染方法,自动接收两个参数：item和index;item的作用参考dataSource的说明
  renderItem: PropTypes.func.isRequired,
  // 是否基于实际渲染的高度计算瀑布流布局，
  // 值为false,使用setItemHeight方法计算高度；值为true, setItemHeight无效
  useRealHeight: PropTypes.bool,
  // 计算卡片高度的方法
  setItemHeight: PropTypes.func,
}

FeedFlow.defaultProps = {
  pageSize: 20,
  mark: '',
  scrollContainerId: '',
  contentContainerId: '',
  renderItem: null,
  useRealHeight: false,
  setItemHeight: null,
}

export default FeedFlow
