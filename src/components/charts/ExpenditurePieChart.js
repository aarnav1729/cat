import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

const ExpenditurePieChart = ({ data, customCategories }) => {
  useEffect(() => {
    const chart = am4core.create('expenditurePieChart', am4charts.PieChart);
    chart.data = customCategories.map((category) => ({
      category,
      value: data[category] || 0
    }));

    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'category';

    return () => {
      chart.dispose();
    };
  }, [data, customCategories]);

  return <div id="expenditurePieChart" style={{ width: '100%', height: '400px' }}></div>;
};

export default ExpenditurePieChart;