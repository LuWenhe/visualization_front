<template>
    <div>
        <div id='filter' class='container'>
            放置筛选按钮
        </div>

        <div class='container'>
            <div class='button-div'>
                <el-row>
                    <el-button @click='button1'>按钮1</el-button>
                    <el-button>按钮2</el-button>
                    <el-button>按钮3</el-button>
                    <el-button>按钮4</el-button>
                    <el-button>按钮5</el-button>
                </el-row>
            </div>

            <div id='figure'></div>
        </div>

        <div id='table' class='container'>
            放置表格
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
    name: 'TestCharts',
    data() {
        return {

        }
    },
    methods: {
        myChart() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('figure'));
            // 配置图表
            let option = {
                tooltip: {},
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [
                    {
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }
                ]
            }
            // 绘制图表
            myChart.setOption(option);
        },
        button1() {

        }
    },
    mounted() {
        this.myChart()
    }
};
</script>

<style scoped>
#filter {
    height: 200px;
}

#figure {
    height: 400px;
    margin-top: 10px;
}

#table {
    height: 400px;
    margin-top: 10px;
}
</style>