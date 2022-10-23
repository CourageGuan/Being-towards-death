// TODO: add UT for last few days
import './App.css';
import DocumentTitle from 'react-document-title';
import dateFormat from "dateformat";
import { useEffect, useState } from 'react';
import { dotMatrix } from './Const';
import React from 'react';

type CountdownMode = "Days" | "Hours" | "Minutes" | "Seconds"

const leftOfYear = (year: number, mode: CountdownMode = "Days") => {
  const time = new Date();
  let endYear = new Date(year, 11, 31, 23, 59, 59);

  switch (mode) {
    case "Days":
      return Math.round(
        (endYear.getTime() - time.getTime()) / 1000 / 60 / 60 / 24
      );
    case "Hours":
      return Math.round((endYear.getTime() - time.getTime()) / 1000 / 60 / 60);
    case "Minutes":
      return Math.round((endYear.getTime() - time.getTime()) / 1000 / 60);
    case "Seconds":
      return Math.round((endYear.getTime() - time.getTime()) / 1000);
    default:
      return 0;
  }
}

const today = new Date();
const year = today.getFullYear();
const totalDays = isLeapYear(year) ? 366 : 365;
const leftDays = leftOfYear(year);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const passedDays = totalDays - leftDays;

function App() {
  const title = year + 1 + " Countdown";

  return (
    <DocumentTitle title={title}>
      <div className="App">
        <CountdownClock />
        <div className="grid grid-cols-12 gap-4 m-4">
          <div className="col-start-2 col-end-8">
            <YearlyChart />
          </div>
          <div className="col-start-8 col-end-11">
            <Summary />
          </div>
        </div>
      </div>
    </DocumentTitle>
  );
}

function CountdownClock(
   props: { mode?: CountdownMode }
) {
  const mode = props.mode || "Seconds";
  const [ left, setLeft ] = useState(leftOfYear(year, mode));
  const canvasRef = React.createRef<HTMLCanvasElement>();

  useEffect(() => {
    const interval = setInterval(() => {
      setLeft(leftOfYear(year, mode));
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  const canvasHeight = 100, canvasWidth = 600;
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.height = canvasHeight; // reset height to redraw
      let context = canvasRef.current.getContext('2d')
      if (context) {
        renderDigit(context, left, canvasHeight);
      }
    }
  }, [canvasRef, left]);

  return (
    <div className="flex flex-col items-center justify-center m-20">
      <canvas ref={canvasRef} height={canvasHeight} width={canvasWidth} /> 
      <div className="text-3xl">{mode} countdown to {year + 1}</div>
    </div>
  );
}

function renderDigit(cxt: CanvasRenderingContext2D, num: number, height = 100) {
  const digits = [];
  if (num === 0) digits.push(0);
  console.log(num)
  while (num > 0) {
    digits.push(num % 10);
    num = Math.floor(num / 10);
    console.log(num)
  }
  const R = height / 20 - 1;

  digits.reverse().forEach((digit, index) => {
    for (let i = 0; i < dotMatrix[digit].length; i++) {
      for (let j = 0; j < dotMatrix[digit][i].length; j++) {
        if (dotMatrix[digit][i][j] === 1) {
          cxt.beginPath();
          cxt.arc(
            14 * (R + 2) * index + j * 2 * (R + 1) + (R + 1),
            i * 2 * (R + 1) + (R + 1),
            R,
            0,
            2 * Math.PI
          );
          cxt.closePath();
          cxt.fill();
        }
      }
    }
  });
}

function Day(props: { isPassed: boolean, isToday?: boolean }) {
  const char = props.isPassed ? "🌟" : "🌍";
  return <span className={props.isToday === true ? 'animate-pulse' : ''} >{char}</span>
}

function YearlyChart() {
  const today = new Date();
  const dayOfmonths = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeapYear(today.getFullYear())) {
    dayOfmonths[2] = 29;
  }
  const month = today.getMonth() + 1;
  const day = today.getDate();

  let isPassed = false;
  let chart = [];
  for (let i = 1; i <= 12; i++) {
    let chartRow = [];
    for (let j = 1; j <= dayOfmonths[i]; j++) {
      if (i < month || (i === month && j < day)) {
        isPassed = true;
      } else {
        isPassed = false;
      }
      chartRow.push(<Day isPassed={isPassed} isToday={i === month && j === day} />);
    }
    chart.push(chartRow);
  }

  const elements = chart.map((row) => (
    <div className="flex flex-wrap">{row}</div>
  ));
  return <div className='justify-center'>{elements}</div>;
}

function Summary() {
  return (
    <div>
      {/* TODO: refactor to progress bar */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl">{dateFormat(today, "yyyy-mm-dd")}</div>
        <div className="text-6xl font-bold">{leftDays}</div>
        <div className="text-2xl">Days Left</div>
      </div>
    </div>
  );
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export default App;
