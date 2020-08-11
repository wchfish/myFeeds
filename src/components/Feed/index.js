/**
 * 瀑布流组件
 * TODO: 内置加载更多功能接口
 */
import React, {
	useEffect,
	useState,
	useRef
} from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { logDOM } from '@testing-library/react'

const Feed = props => {
	let {
		extraClass,
		contentExtraClass,
		dataSource,
		useRealHeight,
		setItemHeight,
		renderItem,
		// useLoadMore,
		// onLoad,
		// renderLoadMore,
	} = props

	const wrapperClass = `feed-wrapper ${extraClass}`
	const contentClass = `content ${contentExtraClass} `

	// 构造新的数据结构，在dataSource基础上增加字段
	let _wrapDataSource = dataSource.map((dataItem, index) => {
		return {
			...dataItem,
			// 数据项在原序列中的索引值
			index: index,
			// 在feed流中的列索引值
			column: 0,
			// 卡片高度
			height: useRealHeight ? 0 : setItemHeight(dataItem.item),
		}
	})

	// 组件容器的ref
	const wrapperRef = useRef(null)
	// 不可见view的ref
	const invisibleRef = useRef(null)
	// 组件内容容器的ref
	const contentRef = useRef(null)

	// 列的高度
	// const [columnsHeight, setColumnsHeight] = useState([])

	// foo
	const [feedShow, setFeedShow] = useState(false)

	// wrapperDataSource
	const [ wrapperDataSource, setWrapperDataSource ] = useState(_wrapDataSource)

	// 触发计算元素高度的effect
	const [feedRender, setFeedRender] = useState(false)

	/**
	 * 卡片排列方法
	 * 根据A/B两列当前的高度，以及卡片的高度，计算卡片所属的列是哪个
	 * 规则：
	 *  1. 两列长度相同时，放在左侧一列；
	 *  2. 两列高度不同时，放在短的一列；
	 */
	function _layout() {
		let AColumnHeight = 0
		let BColumnHeight = 0
		wrapperDataSource.forEach(item => {
			if (AColumnHeight > BColumnHeight) {
				item.column = 1
				BColumnHeight += item.height
			} else {
				item.column = 0
				AColumnHeight += item.height
			}
		})
		return wrapperDataSource
	}

	/**
	 * wrapperDataSource数据的生成逻辑
	*/
	useEffect(
		() => {
			setWrapperDataSource(_wrapDataSource)
			setFeedRender(true)
		},
		[dataSource]
	)

	/**
	 * 列高度及卡片位置计算
	 */
	useEffect(
		() => {
			if (useRealHeight && feedRender) {
				if (wrapperDataSource.length > 0) {
					const elems = invisibleRef.current.querySelectorAll('.invisible-item-wrapper')
					// 考虑数据分页加载的情况
					elems.forEach((elem, index) => {
						const height = elem.getBoundingClientRect().height
						wrapperDataSource[index].height = height
					})
					// 计算列的布局
					_layout()
					if (elems.length > 0) {
						const newWrapperDataSource = [].concat(wrapperDataSource)
						setWrapperDataSource(newWrapperDataSource)
						setFeedShow(true)
					}
				}
				setFeedRender(false)
			} else {
				setFeedShow(true)
				setFeedRender(false)
			}
		},
		// [dataSource, feedShow, wrapperDataSource]
		[feedRender]
	)

	/**
	 * 基于浏览器自带的滚动事件处理
	 */
	/* const [hasMore, setHasMore] = useState(true)
	useEffect(() => {
		if (
			useLoadMore
			&& onLoad
			&& wrapperRef.current
			&& contentRef.current
		) {
			// 执行加载更多时，容器距离底部的高度
			let loadHeight = 50
			let wrapperHeight = wrapperRef.current.getBoundingClientRect().height
			let contentHeight = contentRef.current.getBoundingClientRect().height
			let isLoading = false

			function onscroll(e) {
				let scrollTop = e.target.scrollTop
				let bottomHeight = contentHeight - scrollTop - wrapperHeight

				if (
					hasMore
					&& !isLoading
					&& bottomHeight <= loadHeight
				) {
					isLoading = true

					// 执行加载的方法
					onLoad((_hasMore = true) => {
						isLoading = false
						setHasMore(_hasMore)
					})
				}
			}

			wrapperRef.current.addEventListener('scroll', onscroll)
			return () => {
				wrapperRef.current.removeEventListener('scroll', onscroll)
			}
		}
	}) */

	return (
		<div className={wrapperClass} ref={wrapperRef}>
			{/* 隐藏view */}
			<div
				className="invisible-view-wrapper"
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					zIndex: -10,
					visibility: 'hidden',
					height: '50px',
					overflow: 'hidden',
				}}
			>
				<div
					className="invisible-view"
					ref={invisibleRef}
				>
					{
						_wrapDataSource.map((item, index) => {
							return (
								<div
									key={index}
									className="invisible-item-wrapper"
									style={{
										marginBottom: '10px',
									}}
								>
									{renderItem(item.item, item.index)}
								</div>
							)
						})
					}
				</div>
			</div>
			{/* 瀑布流内容容器 */}
			{
				feedShow ?
					<div className={contentClass} ref={contentRef}>
						<div className="column-container">
							<div className="column column-0">
								{
									wrapperDataSource
										.filter(item => item.column === 0)
										.map((item, index) => {
											return (
												<div
													key={item.key}
													className="item-wrapper"
													style={{
														marginBottom: '10px',
													}}
												>
													{renderItem(item.item, item.index)}
												</div>
											)
										})
								}
							</div>
							<div className="column column-1">
								{
									wrapperDataSource
										.filter(item => item.column === 1)
										.map(item => {
											return (
												<div
													key={item.key}
													className="item-wrapper"
													style={{
														marginBottom: '10px',
													}}
												>
													{renderItem(item.item, item.index)}
												</div>
											)
										})
								}
							</div>
						</div>
						{/* 需要完善 */}
						{/* 加载更多 */}
						{/* {
							useLoadMore && hasMore ?
								(
									renderLoadMore ?
										renderLoadMore() :
										<div className="load-more">加载更多</div>
								) :
								null
						} */}
					</div> :
					null
			}
		</div>
	)
}

// props类型声明
Feed.propTypes = {
	// 组件容器的附加样式
	extraClass: PropTypes.string,
	// 内容容器的附加样式
	contentExtraClass: PropTypes.string,
	// feed流数据[{ item, key },...],
	// 每个数据项必须包含item和key两个字段，其中item作为参数传入到renderItem方法中。
	dataSource: PropTypes.array.isRequired,
	// 数据项的渲染方法,自动接收两个参数：item和index;item的作用参考dataSource的说明
	renderItem: PropTypes.func.isRequired,
	// 是否基于实际渲染的高度计算瀑布流布局，
	// 值为false,使用setItemHeight方法计算高度；值为true, setItemHeight无效
	useRealHeight: PropTypes.bool,
	// 计算卡片高度的方法
	setItemHeight: PropTypes.func,
	// // 是否启用加载更多
	// useLoadMore: PropTypes.bool,
	// // 加载更多执行的方法: (stopLoading) => { stopLoading(bool)}
	// onLoad: PropTypes.func,
	// // 自定义的加载更多提示
	// renderLoadMore: PropTypes.func,
}

// props默认值
Feed.defaultProps = {
	extraClass: '',
	contentExtraClass: '',
	dataSource: [],
	useRealHeight: false,
	setItemHeight: null,
	renderItem: null,
	// useLoadMore: false,
	// onLoad: null,
	// renderLoadMore: null,
}

export default Feed
