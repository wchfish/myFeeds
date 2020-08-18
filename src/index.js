const name = "myFeeds"
const version = '0.0.1'
import Message from './components/Message'
import ReactDom from 'react-dom'

const getVersion = () => {
    return version
}

const sniff = {
    name,
    version,
}

const MyFeed = {
    getVersion,
    sniff,
    Message
}

MyFeed.init = (options) => {
    const { container, title, content } = options
    // 配置项处理
    if (!container) {
        throw(new Error('init 方法的参数是一个对象，对象必须包含container做键值！！！'))
    }
    ReactDom.render(
        <Message title={title} content={content} />,
        options.container,
        () => {
            console.log('===================== feed render ====================')
        }
    )
}

export default MyFeed
