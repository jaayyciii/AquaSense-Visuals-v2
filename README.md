# NPM Installations Required:

React Router DOM: react-router-dom
React Router DOM TS: @types/react-router-dom
Firebase RTDB: firebase
Chart.js: chart.js
React Gauge Chart: react-gauge-chart
React Gauge Chart TS: @types/react-gauge-chart
Prop Types Lodash: prop-types lodash
Bootstrap: bootstrap@5.3.3

Bootstrap setup, import at App.tsx:

- import "bootstrap/dist/css/bootstrap.min.css";
- import "bootstrap-icons/font/bootstrap-icons.css";

# Accessory NPMs

Bootstrap Icons: bootstrap-icons
MUI Calendar: @mui/x-date-pickers
Leaflet: leaflet

dependencies:

- @mui/material @emotion/react @emotion/styled;
- @mui/styled-engine-sc styled-components

Date Library: dayjs

# Environment Variables, .env

vite-env.ts:
/// <reference types="vite/client" />

tsconfig.app.json:
/_ Vite _/
"types": ["vite/client"]

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
