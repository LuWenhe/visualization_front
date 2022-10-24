import { request } from './request'

export function getCovidData() {
	return request({
		url: '/data'
	})
}

/* 获得实况数据 */
export function getLiveData(date, tag) {
  return request({
    url: '/condition',
    params: {
      date: date,
      tag: tag
    }
  })
}

/* 获得24小时数据 */
export function getTwentyFourHourData(date, tag) {
  return request({
    url: '/hourly',
    params: {
      date: date,
      tag: tag
    }
  })
}

/* 获得15天预报数据 */
export function getFifteenDayData(date, tag) {
  return request({
    url: '/daily',
    params: {
      date: date,
      tag: tag
    }
  })
}
