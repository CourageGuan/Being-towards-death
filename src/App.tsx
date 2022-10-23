import './App.css';
import DocumentTitle from 'react-document-title';
import dateFormat from "dateformat";
import { useEffect, useState } from 'react';

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
const passedDays = totalDays - leftDays;

function App() {
  const title = (year + 1) + " Countdown";

  return (
    <DocumentTitle title={title}>
      <div className="App">
        <CountdownClock />
        <div className="grid grid-cols-12 gap-4">
          <div className="col-start-2 col-end-9">
            <YearlyChart />
          </div>
          <div className="col-start-9 col-end-11">
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

  useEffect(() => {
    const interval = setInterval(() => {
      setLeft(leftOfYear(year, mode));
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-6xl font-bold">{left}</div>
      <div className="text-2xl">{mode} countdown to {year + 1}</div>
    </div>
  );
}

function Day(props: { isPassed: boolean, isToday?: boolean }) {
  const char = props.isPassed ? "🌟" : "🌍";
  return <span className={props.isToday === true ? 'animate-pulse' : ''} >{char}</span>
}

function YearlyChart() {
  const dayOfmonths = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeapYear(today.getFullYear())) {
    dayOfmonths[2] = 29;
  }
  const month = today.getMonth();
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
      <h3>{dateFormat(today, "yyyy-mm-dd")}</h3>
      {/* TODO: refactor to progress bar */}
      <div className="flex flex-col items-center justify-center">
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
