const name = "FeedFlow"
const version = '1.0.0'
import FeedFlow from './components/FeedFlow'
import ReactDom from 'react-dom'

import '../src/styles/normalize.scss';
import '../src/utils/rem.js';

const getVersion = () => {
    return version
}

const sniff = {
    name,
    version,
}

const Feeds = {
    getVersion,
    sniff,
    FeedFlow,
}

Feeds.init = (options) => {
    // 配置项处理
    if (!options.container) {
        throw (new Error('init 方法的参数是一个对象，对象必须包含container做键值！！！'))
    }
    ReactDom.render(
        <FeedFlow
            {...options}
        />,
        options.container,
        () => { }
    )
}

export default Feeds
