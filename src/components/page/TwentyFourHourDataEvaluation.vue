<template>
  <div>
    <div class='container filter'>
      <el-form ref='form' :inline='true'>
        <el-form-item label='时间'>
          <el-col :span='25'>
            <el-date-picker type='date' placeholder='选择日期' value-format='yyyy-MM-dd' v-model='date' style='width: 100%;'></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label='选择区域'>
          <el-select v-model='tag'>
            <el-option label='国内' :value='1'></el-option>
            <el-option label='国外' :value='0'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='onSubmit'>确定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class='container chart'>
      <div class='div-button'>
        <el-row>
          <el-button v-for='(item, index) in typeArray'
                     :index='index'
                     @click='refreshChart(item)'
                     :autofocus='item === type'>
            {{item}}
          </el-button>
        </el-row>
      </div>

      <!-- 存放图表的锚点 -->
      <div id='figure'></div>
    </div>

    <div class='container table'>
      <h3>实时温度准确率（{{this.date}}）</h3>

      <el-table :data="tableData.data"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                style='width: 100%; margin: auto'
                border>
        <el-table-column label='预报时间' prop='date' width='165'></el-table-column>
        <!-- 遍历第一行标题 -->
        <el-table-column v-for='(item, index) in tableData.tableHeaderTop'
                         :label='item'
                         :index='index'>
          <!-- 遍历第二行标题 -->
          <el-table-column v-for='(item2, index2) in tableData.tableHeader[item]'
                           :label='item2'
                           :prop='item2'
                           :index='index2'
                           :width='120'>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getTwentyFourHourData } from '@/network/evaluate';

let myChart

export default {
  name: 'TwentyFourHourDataEvaluation',
  data() {
    return {
      TwentyFourData: {},
      date: '2022-09-16',
      tag: 1,
      lineChartData: {},
      tableData: {},
      type: 'rain',
      typeArray: [],
      timeInterval: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00',
                     '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
                     '20:00', '21:00', '22:00', '23:00', '24:00', '1:00',
                     '2:00', '3:00', '4:00', '5:00', '6:00', '7:00'],
      legendData: []
    }
  },
  methods: {
    onSubmit() {
      this.getTwentyFourHourData(this.date, this.tag)

      setTimeout(() => {
        this.getLineChartData()
        this.getTableData()
        this.refreshChart('rain')
      }, 500)
    },
    // 更新折线图
    refreshChart(type) {
      if (myChart != null && myChart !== '' && myChart !== undefined) {
        // 销毁ECharts
        myChart.dispose()
      }

      myChart = echarts.init(document.getElementById('figure'))

      let dataObj = []

      if (type === 'rain') {
        dataObj = this.lineChartData.rain
      } else if (type === 'temp') {
        dataObj = this.lineChartData.temp
      } else if (type === 'wind') {
        dataObj = this.lineChartData.wind
      }

      let option = this.optionData(dataObj);
      myChart.setOption(option)
    },
    optionData(dataObj) {
      return {
        title: {
          text: '24小时预报数据数据（' + this.date + '）',
          textAlign: 'center',
          left: '50%',
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.legendData,
          top: 20,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {},
            magicType: {
              type: ['line', 'bar']
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dataObj.xAxis
        },
        yAxis: {
          name: '温度准确率',
          type: 'value',
          min: 0,
          max: 1.5
        },
        series: dataObj.series
      }
    },
    getTwentyFourHourData(data, tag) {
      getTwentyFourHourData(data, tag).then(res => {
        if (res !== null) {
          this.TwentyFourData = res
        }
      }).catch(err => {
        return err
      })
    },
    // 对折线图的数据进行处理
    getLineChartData() {
      let lineChartData = {}, legendData = [], typeArray = []
      let isFlag = false

      let data = this.TwentyFourData

      // MJ、MJCN-01、MJCN-02...
      for (let prodName in data) {
        // {rain: {}, temp: {}, wind: {}}
        let prodData = data[prodName]

        legendData.push(prodName)

        // rain、temp、wind
        for (let type in prodData) {
          let seriesObj = {}

          seriesObj.name = prodName
          seriesObj.type = 'line'
          seriesObj.data = prodData[type]

          if (!isFlag) {
            typeArray.push(type)

            let typeSeriesArray = []
            typeSeriesArray.push(seriesObj)
            lineChartData[type] = {}
            lineChartData[type].series = typeSeriesArray
            lineChartData[type].xAxis = this.timeInterval
            lineChartData[type].legendData = legendData
          } else {
            lineChartData[type].series.push(seriesObj)
          }
        }

        isFlag = true
      }

      this.typeArray = typeArray
      this.lineChartData = lineChartData
    },
    getTableData() {
      let table = {}
      let tableHeaderTop = []
      let tableHeader = {}
      let data = []
      let isFlag = false

      // MJ、MJCN-01、MJCN-02
      for (let prodName in this.TwentyFourData) {

        tableHeaderTop.push(prodName)
        let headerArray = []

        // {rain: {}, temp: {}, wind: {}}
        let prodData = this.TwentyFourData[prodName]

        for (let type in prodData) {
          let header = prodName.toLowerCase().replace('-', '') + '_' + type
          headerArray.push(header)

          let valueArray = prodData[type]

          for (let i = 0; i < valueArray.length; i++) {
            if (!isFlag) {
              let obj = {}
              obj[header] = valueArray[i]
              obj['date'] = this.timeInterval[i]
              data.push(obj)
            } else {
              data[i][header] = valueArray[i]
            }
          }

          isFlag = true
        }

        tableHeader[prodName] = headerArray

        table.tableHeaderTop = tableHeaderTop
        table.tableHeader = tableHeader
        table.data = data

        this.tableData = table
      }
    }
  },
  mounted() {
    // 通过接口获取实况数据
    this.getTwentyFourHourData('2022-09-21', this.tag)

    setTimeout(() => {
      // 对数据进行处理得到折线图和表格的数据
      this.getLineChartData()
      this.getTableData()
      // 根据种类刷新折线图和图表
      this.refreshChart(this.type)
    }, 500)
  }
}
</script>

<style scoped>
.filter {
  height: 30px;
}

.chart {
  margin-top: 10px;
}

#figure {
  height: 450px;
  margin-top: 10px;
}

.div-button {
  text-align: center;
}

.table {
  margin-top: 10px;
}

div h3 {
  margin-bottom: 10px;
  text-align: center;
  color: #464646;
}
</style>
