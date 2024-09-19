import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

const ExpenditurePieChart = ({ data, categories }) => {
  useEffect(() => {
    const chart = am4core.create('expenditurePieChart', am4charts.PieChart);

    const categoryData = categories.map((category) => ({
      category,
      value: data.filter((entry) => entry.category === category && entry.type === 'expenditure')
                 .reduce((sum, entry) => sum + entry.amount, 0)
    }));

    chart.data = categoryData;

    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'category';

    return () => {
      chart.dispose();
    };
  }, [data, categories]);

  return <div id="expenditurePieChart" style={{ width: '100%', height: '400px' }}></div>;
};

export default ExpenditurePieChart;
