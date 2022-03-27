import React from 'react';
import Stack from '@mui/material/Stack';
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
    isPlaying: true,
    size: 100,
    strokeWidth: 6,
};
  
const renderTime = (dimension, time) => {
return (
    <div className="time-wrapper">
    <div className="time">{time}</div>
    <div>{dimension}</div>
    </div>
);
};
  
const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

const TimerComponent = ({ duration }) => {
  const days = Math.ceil(duration / daySeconds);
  const daysDuration = days * daySeconds;

  return (
    <Stack
      sx={{
        'position': 'relative',
        'alignItems': 'center',
        'justifyContent': 'center',
      }} 
      direction={"row"} 
      spacing={2}
    >
      <CountdownCircleTimer
        {...timerProps}
        colors="#7E2E84"
        duration={daysDuration}
        initialRemainingTime={duration}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("days", getTimeDays(daysDuration - elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors="#D14081"
        duration={daySeconds}
        initialRemainingTime={duration % daySeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: duration - totalElapsedTime > hourSeconds
        })}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("hours", getTimeHours(daySeconds - elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors="#EF798A"
        duration={hourSeconds}
        initialRemainingTime={duration % hourSeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: duration - totalElapsedTime > minuteSeconds
        })}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("minutes", getTimeMinutes(hourSeconds - elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors="#218380"
        duration={minuteSeconds}
        initialRemainingTime={duration % minuteSeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: duration - totalElapsedTime > 0
        })}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("seconds", getTimeSeconds(elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer>
    </Stack>
  );
}

export default TimerComponent;