import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TimelineData } from '../models/timeline-data.model';

@Injectable({ providedIn: 'root' })
export class UtilService {
  constructor(private datePipe: DatePipe) {}

  // Generate array of date strings to display on chart's X axis
  timelineOnChart(data: TimelineData[]): string[] {
    const timelineArr = [];
    for (const item of data) {
      timelineArr.unshift(this.datePipe.transform(item.updated_at)); // Reversed so that it's from oldest to newest
    }
    return timelineArr;
  }

  // Generate an array from values of specified property on timeline data
  // Primarily for cases like active, deaths and recovered
  caseArrayTimeline(property: string, data: TimelineData[]) {
    const caseArray = [];
    for (const item of data) {
      caseArray.unshift(item[property]); // Reversed, from oldest to newest needed
    }
    return caseArray;
  }

  // Generates list of dates (visual month+year and values in numbers) that can be picked on the chart to display data for that date
  generateDateOptions(data: TimelineData[]) {
    const dateList: { monthAndYear: string; date: string }[] = [];
    let previousDate = '';
    for (const item of data) {
      const date = this.datePipe.transform(item.updated_at).split(' ');
      const monthAndYear = date[0] + ' ' + date[2];
      const dateValue = item.date.split('-')[1] + '-' + item.date.split('-')[0];
      if (previousDate !== monthAndYear) {
        dateList.push({ monthAndYear: monthAndYear, date: dateValue });
        previousDate = monthAndYear;
      }
    }
    return dateList;
  }

  // This is what I have to do to work around this STUPID, DUMBFOUNDED, ABSOULUTELIY ATROCIUS, INCONSSISTENT API
  // Takes in numbers and returns whichever is not zero. IF THEY ARE ALL GOD DAMN ZERO THEN IT RETURNS ZERO.
  avoidZero(...args: number[]) {
    let nonZeroVal = 0;
    for (const value of args) {
      if (value !== 0) {
nonZeroVal = value;
}
    }
    return nonZeroVal;
  }
}
