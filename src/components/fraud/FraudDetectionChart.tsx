"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useFraudChartData } from "../../../hooks/useFraudLogs";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function FraudDetectionChart() {
  const { chartData, loading, error } = useFraudChartData();

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#000000"], // Black line color as shown in the image
    chart: {
      fontFamily: "Inter, sans-serif",
      height: 300,
      type: "line",
      toolbar: {
        show: false,
      },
      background: "transparent",
      sparkline: {
        enabled: false,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      width: 2,
      lineCap: "round",
    },
    fill: {
      type: "solid",
      opacity: 0.1,
    },
    markers: {
      size: 4,
      strokeColors: "#000000",
      strokeWidth: 2,
      fillOpacity: 1,
      hover: {
        size: 6,
      },
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      borderColor: "#e5e7eb",
      strokeDashArray: 0,
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "MMM",
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.categories.length > 0 ? chartData.categories : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      axisBorder: {
        show: true,
        color: "#e5e7eb",
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6B7280",
        },
      },
    },
    yaxis: {
      min: 0,
      max: Math.max(5, Math.max(...chartData.series[0]?.data || [0]) + 1),
      tickAmount: 5,
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6B7280",
        },
        formatter: (value: number) => value.toString(),
      },
      title: {
        text: "",
      },
    },
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detections Per Month
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fraud detection activity over the current year
          </p>
        </div>
        
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="text-red-600 dark:text-red-400">
          Error loading chart data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detections Per Month
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Fraud detection activity over the current year
        </p>
      </div>
      
      <div className="w-full">
        <ReactApexChart
          options={options}
          series={chartData.series}
          type="line"
          height={300}
        />
      </div>
    </div>
  );
} 