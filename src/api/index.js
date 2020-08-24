import { http } from '../utils/request'
import { productMockData, feedDataMock } from './mock'

const baseUrl = '//beta-api.m.jd.com'
const functionId = 'feedFlowIndex'

const requestFeedMock = (params) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(feedDataMock)
    }, 300)
  })
}

const requestFeed = (appid, params) => {
  const defaultParams = {
    pageSize: 20,
  }
  params = {
    ...defaultParams,
    ...params,
  }

  // 首页不需要传mark参数
  if (params.mark === '' || params.mark === null || params.mark === undefined) {
    delete params.mark
  }

  return http.oGet(baseUrl, {
    appid,
    functionId,
    body: {
      ...params,
    }
  })
}

export {
  requestFeedMock,
  requestFeed,
}
