import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    const now = moment();
    const publicationDate = moment(value);
    const diff = now.diff(publicationDate);
    const duration = moment.duration(diff);

    if (duration.asMinutes() < 60) {
      return `${Math.floor(duration.asMinutes())} minutes ago`;
    } else if (duration.asHours() < 24) {
      return `${Math.floor(duration.asHours())} hours ago`;
    } else if (duration.asDays() < 30) {
      return `${Math.floor(duration.asDays())} days ago`;
    } else {
      return `${Math.floor(duration.asMonths())} months ago`;
    }
  }

}
