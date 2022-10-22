import React from 'react';
import logo from './logo.svg';
import './App.css';
import DocumentTitle from 'react-document-title';

const leftDaysOfYear = (year: number) => {
  const today = new Date();
  let endYear = new Date(year, 11, 31, 23, 59, 59);
  let msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((endYear.getTime() - today.getTime()) / msPerDay);
};

function App() {
  const d = new Date();
  const year = d.getFullYear();
  const leftDays = leftDaysOfYear(year);

  return (
    <DocumentTitle title={leftDays + "Days Left of" + year.toString() }>
      <div className="App">
        <h1>{leftDays} days left of {year}</h1>
      </div>
    </DocumentTitle>
  );
}

export default App;
