const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var startX
var startY
function _touchstart(e, items) {
  //开始触摸时 重置所有删除
  items.forEach(function (v, i) {
    if (v.isTouchMove) //只操作为true的
      v.isTouchMove = false;
  })
  
  startX = e.changedTouches[0].clientX
  startY = e.changedTouches[0].clientY
  
  return items
}

function _touchmove(e, items){
  var index = e.currentTarget.dataset.index; //当前索引
  var touchMoveX = e.changedTouches[0].clientX; //滑动变化坐标
  var touchMoveY = e.changedTouches[0].clientY; //滑动变化坐标
  //获取滑动角度
  var _X = touchMoveX-startX;
  var _Y = touchMoveY-startY;
  var angle = 360 * Math.atan(_Y / _X) / (2 * Math.PI);

  items.forEach(function (v, i) {
    v.isTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if (i == index) {
      if (touchMoveX > startX) //右滑
        v.isTouchMove = false
      else //左滑
        v.isTouchMove = true
    }
  })

  return items
}


module.exports = {
  formatTime: formatTime,
  touchStart:_touchstart,
  touchMove:_touchmove
}
