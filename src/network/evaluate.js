import { request } from './request'

export function getCovidData() {
	return request({
		url: '/data'
	})
}

/* 获得实况降雨数据 */
export function getLiveData(date, tag) {
  return request({
    url: '/condition',
    params: {
      date: date,
      tag: tag
    }
  })
}
