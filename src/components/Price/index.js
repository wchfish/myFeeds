import React, {useState,useEffect} from 'react';
// import PropTypes from 'prop-types';
import './index.scss';
const Price = (props) => {
    const [priceState,setPriceState] = useState({priceBig:'',priceSmall:''});
    useEffect(() => {
        function formatPrice() {
            if (priceString.indexOf('.') > 0) {
                let numArray = priceString.split('.');
                setPriceState({priceBig:formatThousands(numArray[0]),priceSmall:props.decimalDigits === 0 ? null : formatDecimal(numArray[1])})
            } else {
                setPriceState({priceBig:formatThousands(props.value),priceSmall:props.decimalDigits === 0 ? null : formatDecimal(0)})
            }
        }
        //格式化小数部分
        function formatDecimal(decimalNum) {
            const result = `0.${decimalNum.toString()}`;
            const resultFixed = (result / 1).toFixed(props.decimalDigits);
            return resultFixed.toString().substring(2, resultFixed.length);
        }
        //千分位显示
        function formatThousands(num) {
            if (props.thousands) {
                return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            } else {
                return num;
            }
        }
        const priceString = props.value.toString();
        formatPrice();
    },[props]);
    return (
        <div className={`price ${props.lineThrough ? 'line-through' : ''} ${props.size ? props.size : ''}`} style={props.valueStyle}>
            {props.prefix && (<span className="price-symbol">￥</span>)}
            <span className="price-front">{priceState.priceBig}</span>
            {props.decimalDigits > 0 && (
                <>
                <span className="price-point">.</span>
                <span className="price-behind">{ priceState.priceSmall }</span>
                </>
            )}
        </div>
    )
}
/**
 * value 价格 string|number
 * prefix 前缀 是否加上羊角符前缀 boolean
 * decimalDigits 小数位位数 number
 * thousands 是否按照千分号形式显示 boolean
 * lineThrough 是否有划线 boolean
 * size 设置价格字体大小 default|big|small|small-big-small 默认default string
 * valueStyle 样式 CSSProperties
 */
Price.defaultProps={
    value:0,
    prefix: true,
    decimalDigits: 2,
    thousands: false,
    lineThrough: false,
    size: 'default',
}
export default Price;
