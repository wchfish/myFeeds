import { productMockData } from './mock'
const requestFeed = (params) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(productMockData)
    }, 300)
  })
}

export {
  requestFeed,
}
