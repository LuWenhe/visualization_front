<template>
  <div>
    <div class='container filter'>
      <el-form ref='form' :inline='true'>
        <el-form-item label="时间">
          <el-col :span="25">
            <el-date-picker type="date" placeholder="选择日期" value-format='yyyy-MM-dd' v-model="date" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='onSubmit'>确定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class='container chart'>
      <div class='div-button'>
        <el-row>
          <el-button @click="refreshChart('rain')">雨量</el-button>
          <el-button @click="refreshChart('temp')">温度</el-button>
          <el-button @click="refreshChart('wind')">风级</el-button>
        </el-row>
      </div>

      <!-- 存放图表的锚点 -->
      <div id='figure'></div>
    </div>

    <div class='container table'>
      <h3>实时温度准确率（{{this.date}}）</h3>

      <el-table :data="table.tableData"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                style='width: 100%; margin: auto'
                border>
        <el-table-column label='预报时间' prop='date' width='165'></el-table-column>
        <!-- 遍历第一行标题 -->
        <el-table-column v-for='(item, index) in table.tableHeaderTop'
                         :label='item'
                         :index='index'>
          <!-- 遍历第二行标题 -->
          <el-table-column v-for='(item2, index2) in table.tableHeader[item]'
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
import * as echarts from 'echarts';
import { getLiveData } from '@/network/evaluate';

let myChart

export default {
  name: 'LiveData',
  data() {
    return {
      liveData: {},
      date: '2022-09-16',
      tag: 1,
      lineChartData: {},
      table: {},
      timeInterval: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00',
                    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
                    '20:00', '21:00', '22:00', '23:00', '24:00', '1:00',
                    '2:00', '3:00', '4:00', '5:00', '6:00', '7:00']
    }
  },
  methods: {
    onSubmit() {
      this.getLiveData(this.date, this.tag)

      setTimeout(() => {
        this.getLineChartData()
        this.getTableData()
        this.refreshChart('rain')
      }, 300)
    },
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
          text: '国内实况数据（' + this.date + '）',
          textAlign: 'center',
          left: '50%',
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['MJ', 'MJCN-01', 'MJCN-02', 'MJCN-04', 'MJGL-02', 'MJGL-04'],
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
          type: 'value'
        },
        series: dataObj.series
      }
    },
    getLiveData(data, tag) {
      getLiveData(data, tag).then(res => {
        if (res !== null) {
          this.liveData = res
        }
      }).catch(err => {
        return err
      })
    },
    getLineChartData() {
      let lineChartData = {}
      let rainObj = {}, tempObj = {}, windObj = {}
      let rainSeriesArray = [], tempSeriesArray = [], windSeriesArray = []
      let legendData = []

      let data = this.liveData

      // MJ、MJCN-01、MJCN-02...
      for (let prodName in data) {
        // {rain: {}, temp: {}, wind: {}}
        let prodData = data[prodName]

        legendData.push(prodName)

        for (let type in prodData) {
          let seriesObj = {}

          seriesObj.name = prodName
          seriesObj.type = 'line'
          seriesObj.data = prodData[type]

          if (type === 'rain') {
            rainSeriesArray.push(seriesObj)
          } else if (type === 'temp') {
            tempSeriesArray.push(seriesObj)
          } else {
            windSeriesArray.push(seriesObj)
          }
        }
      }

      let timeInterval = this.timeInterval

      rainObj.xAxis = timeInterval
      rainObj.legendData = legendData
      rainObj.series = rainSeriesArray

      tempObj.xAxis = timeInterval
      tempObj.series = tempSeriesArray
      tempObj.legendData = legendData

      windObj.xAxis = timeInterval
      windObj.series = windSeriesArray
      windObj.legendData = legendData

      lineChartData.rain = rainObj
      lineChartData.temp = tempObj
      lineChartData.wind = windObj

      this.lineChartData = lineChartData
    },
    getTableData() {
      let table = {}
      let tableHeaderTop = []
      let tableHeader = {}
      let tableData = []
      let isFlag = false

      let data = this.liveData

      // MJ、MJCN-01、MJCN-02
      for (let prodName in data) {

        tableHeaderTop.push(prodName)
        let headerArray = []

        // {rain: {}, temp: {}, wind: {}}
        let prodData = data[prodName]

        for (let type in prodData) {
          let header = prodName.toLowerCase().replace('-', '') + '_' + type
          headerArray.push(header)

          let valueArray = prodData[type]

          for (let i = 0; i < valueArray.length; i++) {
            if (!isFlag) {
              let obj = {}
              obj[header] = valueArray[i]
              obj['date'] = this.timeInterval[i]
              tableData.push(obj)
            } else {
              tableData[i][header] = valueArray[i]
            }
          }

          isFlag = true
        }

        tableHeader[prodName] = headerArray

        table.tableHeaderTop = tableHeaderTop
        table.tableHeader = tableHeader
        table.tableData = tableData

        this.table = table
      }

      console.log(table)
    }
  },
  mounted() {
    this.getLiveData('2022-09-21', 1)

    setTimeout(() => {
      this.getLineChartData()
      this.getTableData()
      this.refreshChart('rain')
    }, 300)
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
