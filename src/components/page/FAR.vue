<template>
	<div>
		<div class='container filter'>
			<el-form :inline="true" :rules="rules">
				<el-form-item label="时间" prop="createTime" class="create-time-item">
					<el-date-picker v-model="createTime" value-format="yyyy-MM-dd hh:mm:ss" type="datetimerange"
						range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-select v-model="options.value" placeholder="请选择地区">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<el-button type="success">清空</el-button>
				<el-button type="primary">确定</el-button>
			</el-form>
		</div>

		<div class='container chart'>
			<div class='button-div'>
				<el-row>
					<el-button @click="refreshChart('light')">小雨0~1.5mm</el-button>
					<el-button @click="refreshChart('middle')">中雨1.6~9.9mm</el-button>
					<el-button @click="refreshChart('heavy')">大雨10~19.9mm</el-button>
					<el-button @click="refreshChart('torrential')">暴雨20~39.9mm</el-button>
					<el-button @click="refreshChart('downpour')">大暴雨40~100mm</el-button>
				</el-row>
			</div>

			<!-- 存放图表的锚点 -->
			<div id='figure'></div>
		</div>

		<div class='container table'>
			<h3>降水预报分级检验空报率表</h3>

			<el-table :data="tableData"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                style='width: 90%; margin: auto'
                border>
				<el-table-column v-for='(item, index) in tableHeader'
                         :prop="item"
                         :label="item"
                         :index="index"
                         min-width='150'>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
import * as echarts from 'echarts'

let myChart

export default {
  name: 'FarCharts',
  data() {
    var createTimeCheck = (rule, value, callback) => {
      if (value === '') {
        callback() // 回调函数
      } else {
        let createTimeStart = this.createTime ? this.createTime[0] :
          '' // 从数组中取出开始时间   取出结果：'2020-10-28 16:01:15'
        let createTimeEnd = this.createTime ? this.createTime[1] : '' // 取出结束时间
        let sTime = (((createTimeStart.split(' '))[1]).split(':')).join(
          '') // 从 '2020-10-28 16:01:15' 取出时间 结果：‘160115'
        let sDate = (((createTimeStart.split(' '))[0]).split('-')).join('') // 取出开始日期 结果：‘20201028'
        let endTime = (((createTimeEnd.split(' '))[1]).split(':')).join('') // 取出结束时间
        let endDate = (((createTimeEnd.split(' '))[0]).split('-')).join('') // 取出结束日期
        if (parseInt(endDate) > parseInt(sDate)) { // 如果结束日期大于开始日期  不用判断时间
          callback()
        } else {
          if (parseInt(endTime) <= parseInt(sTime)) { // 如果结束日期不大于开始日期  判断结束时间是否大于开始时间
            callback(new Error('结束日期必须大于开始日期'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      number: 0,
      options: [{
        value: '选项1',
        label: '陕西市'
      }, {
        value: '选项2',
        label: '汉中市'
      }],
      obj: {
        lightRain: {
          xAxisData: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 120],
          ySeries: [0.2602, 0.3633, 0.4324, 0.4762, 0.5151, 0.5471, 0.5739, 0.593, 0.6118, 0.6272,
            0.6449, 0.6605, 0.6741, 0.6846, 0.6937, 0.705, 0.7134, 0.7213, 0.7324, 0.7396
          ]
        },
        middleRain: {
          xAxisData: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 120],
          ySeries: [0.1621, 0.2273, 0.285, 0.3224, 0.3593, 0.3862, 0.4111, 0.4344, 0.4525, 0.4721,
            0.4895, 0.5045, 0.5237, 0.5358, 0.5493, 0.5606, 0.5715, 0.5856, 0.5981, 0.6091
          ]
        },
        heavyRain: {
          xAxisData: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 120],
          ySeries: [0.5056, 0.6635, 0.7213, 0.7671, 0.7944, 0.8043, 0.8115, 0.8268, 0.8461, 0.8536,
            0.8586, 0.8724, 0.8808, 0.8877, 0.8911, 0.9019, 0.9175, 0.9361, 0.9527, 0.9537
          ]
        },
        torrentialRain: {
          xAxisData: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 120],
          ySeries: [0.4738, 0.6503, 0.7188, 0.7657, 0.7926, 0.8084, 0.8319, 0.8603, 0.8752, 0.8929,
            0.9172, 0.9335, 0.9502, 0.9542, 0.9542, 0.9644, 0.9783, 0.9872, 0.9897, 0.9891
          ]
        },
        downpourRain: {
          xAxisData: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 120],
          ySeries: [0.4419, 0.62, 0.7228, 0.784, 0.8168, 0.8862, 0.9266, 0.9381, 0.9485, 0.9591,
            0.9541, 0.9692, 0.9687, 0.9682, 0.9881, 0.9763, 0.991, 0.9675, 0.9775, 0.9627
          ]
        }
      },
      tableHeader: ['title', '6', '12', '18', '24', '30', '36'],
      tableData: [{
        'title': '小雨',
        '6': '0.2602',
        '12': '0.3633',
        '18': '0.4324',
        '24': '0.4762',
        '30': '0.5151',
        '36': '0.5471'
      }, {
        'title': '中雨',
        '6': '0.1621',
        '12': '0.2273',
        '18': '0.285',
        '24': '0.3224',
        '30': '0.3593',
        '36': '0.3862'
      }, {
        'title': '大雨',
        '6': '0.5056',
        '12': '0.6635',
        '18': '0.7213',
        '24': '0.7671',
        '30': '0.7944',
        '36': '0.8043'
      }],
      createTime: '', // 表单 时间 双向绑定值
      rules: { // 调用createTimeCheck 验证
        createTime: [{
          validator: createTimeCheck,
          trigger: 'blur'
        }]
      }

    }
  },
  methods: {
    refreshChart(type) {
      // 解决ECharts实例重复加载的问题
      if (myChart !== null && myChart !== '' && myChart !== undefined) {
        myChart.dispose()
      }

      // 基于准备好的dom，初始化echarts实例
      myChart = echarts.init(document.getElementById('figure'))

      let obj = this.obj, rainObj = {}

      if (type === 'light') {
        rainObj = obj.lightRain
      } else if (type === 'middle') {
        rainObj = obj.middleRain
      } else if (type === 'heavy') {
        rainObj = obj.heavyRain
      } else if (type === 'torrential') {
        rainObj = obj.torrentialRain
      } else {
        rainObj = obj.downpourRain
      }

      // 配置图表
      let option = this.optionData(rainObj)
      // 绘制图表
      myChart.setOption(option)
    },
    optionData(rainObj) {
      return {
        title: {
          text: '降水预报分级检验空报率',
          textAlign: 'center',
          left: '50%'
        },
        tooltip: {},
        toolbox: {
          show: true,
          feature: {
            magicType: {
              type: ['line', 'bar']
            }
          },
          right: '10%',
          top: 15
        },
        legend: {
          data: ['降水分钟检验'],
          left: '10%',
          top: 20,
          padding: [0, 0, 0, 35]
        },
        xAxis: {
          name: '时效',
          data: rainObj.xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          name: '空报率',
          nameGap: 25,
          min: 0,
          max: 1.2,
        },
        series: [{
          name: '降水分钟检验',
          type: 'bar',
          data: rainObj.ySeries,
          barWidth: '40%'
        }]
      }
    }
  },
  mounted() {
    this.refreshChart('light')
  }
};
</script>

<style scoped>
.filter {
  height: 30px;
}

.chart {
  margin-top: 10px;
}

.table {
  margin-top: 10px;
}

.button-div {
  text-align: center;
}

div h3 {
  margin-bottom: 10px;
  text-align: center;
  color: #464646;
}

#figure {
  height: 400px;
  margin-top: 15px;
}
</style>
