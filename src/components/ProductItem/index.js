import React from 'react';
import Price from '../Price';
import PropTypes from 'prop-types';
import './index.scss';
const ProductList = (props) => {
//   const imgHead = "//img12.360buyimg.com/cms/s350x350_";
  const imgHead = "";
  const item  = props.item;
  return (
    <div className='product-item' key={item.skuId}>
        <div className='product-img'>
        <img alt="商品图片" src={`${imgHead}${item.imgUrl}`}/>
        </div>
        <div className="product-info">
        <div className={`product-name ${props.lineType === 'one' ? 'one' : 'two'}`}>{item.productName}</div>
        {props.children ? props.children : (
            <>
            <div>
                <Price value={item[props.firstPrice]} size='big' valueStyle={{color:'#F2270C'}}/>
            </div>
            <div>
                <Price value={item[props.secondPrice]} lineThrough={true}/>
            </div>
            </>
        )}
        </div>
    </div>
  )
}
/**
 * item 商品信息
 * lineType 行类型 one 一行 two 两行
 */
ProductList.propTypes = {
    item: PropTypes.object.isRequired
}
ProductList.defaultProps={
    lineType: 'two',
    firstPrice:'jdPrice',
    secondPrice: 'originalPrice'
}
export default ProductList;