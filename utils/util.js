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

var filterDistance = function(val){

    return val < 1000 ? val+'m' : (val/1000).toFixed(1) + 'km'

}
module.exports = {
  formatTime: formatTime,
  filterDistance:filterDistance
}
