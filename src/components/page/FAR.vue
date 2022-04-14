<template>
    <div>
        <div id='filter' class='container'>
            陕西省综合时次分钟降水预报分级检测空报率
            <el-row>
                <el-button @click="change(0)" :class="{ newStyle:0===number}"">小雨0~1.5mm</el-button>
                <el-button @click="change(1)" :class="{ newStyle:1===number}">中雨1.6~9.9mm</el-button>
                <el-button @click="change(2)" :class="{ newStyle:2===number}">大雨10~19.9mm</el-button>
                <el-button @click="change(3)" :class="{ newStyle:3===number}">暴雨20~39.9mm</el-button>
                <el-button @click="change(4)" :class="{ newStyle:4===number}">大暴雨40~100mm</el-button>
            </el-row>
        </div>

        <div class='container'>
            <div v-show="0===number" id='figure'></div>
            <div v-show="1===number" id='middle'><p>中雨1.6~9.9mm</p></div>
            <div v-show="2===number" id='middle'><p>大雨10~19.9mm</p></div>
            <div v-show="3===number" id='middle'><p>暴雨20~39.9mm</p></div>
            <div v-show="4===number" id='middle'><p>大暴雨40~100mm</p></div>
        </div>

        <div>
            <div v-show="0===number" id='table' class='container'>
                <h3 style='margin-bottom: 10px; text-align: center'>降水预报分级检验空报率表</h3>
                <el-table
                    :data="tableData"
                    :header-cell-style="{'text-align':'center'}"
                    :cell-style="{'text-align':'center'}"
                    border
                    style='width: 90%; margin: auto'>
                    <el-table-column v-for='(item, index) in tableHeader'
                        :prop="item"
                        :label="item"
                        :index="index"
                        min-width='150'>
                    </el-table-column>
                </el-table>
            </div>
        </div> 
        <div v-show="1===number" id='middle'><p>中雨1.6~9.9mm</p></div>
        <div v-show="2===number" id='middle'><p>大雨10~19.9mm</p></div>
        <div v-show="3===number" id='middle'><p>暴雨20~39.9mm</p></div>
        <div v-show="4===number" id='middle'><p>大暴雨40~100mm</p></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
    name: 'TestCharts',
    data() {
        return {
            number: 0,
            obj: {
                'lightRain': []
            },
            xAxisData: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 120],
            ySeries: [0.2602, 0.3633, 0.4324, 0.4762, 0.5151, 0.5471, 0.5739, 0.593, 0.6118, 0.6272,
                0.6449, 0.6605, 0.6741, 0.6846, 0.6937, 0.705, 0.7134, 0.7213, 0.7324, 0.7396],
            tableHeader: ['title', '6', '12', '18', '24', '30', '36'],
            tableData: [{
                'title': '小雨',
                '6': '0.2602',
                '12': '0.3633',
                '18': '0.4324',
                '24': '0.4762',
                '30': '0.5151',
                '36': '0.5471'
            },{
                'title': '中雨',
                '6': '0.1621',
                '12': '0.2273',
                '18': '0.285',
                '24': '0.3224',
                '30': '0.3593',
                '36': '0.3862'
            }]
        }
    },
    created() {

    },
    methods: {
        change(index) {
            this.number = index; //重要处
        },
        myChart() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('figure'));
            // 配置图表
            let option = {
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
                    padding:[0, 0, 0, 35]
                },
                xAxis: {
                    name: '时效',
                    data: this.xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis: {
                    name: '空报率',
                    nameGap: 25,
                    min: 0,
                    max: 1,
                },
                series: [
                    {
                        name: '降水分钟检验',
                        type: 'bar',
                        data: this.ySeries,
                        barWidth: '40%'
                    }
                ]
            }
            // 绘制图表
            myChart.setOption(option);
        }
    },
    mounted() {
        this.myChart()
    }
};
</script>

<style scoped>
#filter {
    height: 30px;
}

#figure {
    height: 400px;
    margin-top: 10px;
}

#table {
    height: 400px;
    margin-top: 10px;
}

#text {
    margin-top: 1px;
}
</style>