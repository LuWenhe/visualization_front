function times() {
  let dateArray = []

  for (let i = 0; i < 15; i++) {
    // 把返回的日期赋值给对象
    let date = getDate(i)
    dateArray.push(date)
  }

  console.log(dateArray)
}

function getDate(n) {
  let ss = 24 * 60 * 60 * 1000; //一天的毫秒数86400
  let timestamp = new Date().getTime(); //获取当前时间戳
  let date1 = new Date(ss * n + timestamp) //加上n天的国际标准日期

  let month=date1.getMonth() + 1;
  let dat=date1.getDate();
  let m = month > 9 ? month : '0' + month;
  let d = dat > 9 ? dat : '0' + dat;
  return m + '.' + d; //拼接成我们需要的格式返回
}

times()
