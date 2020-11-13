export class DateHelper {
  static DayNowToHours() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours * 60 + minutes;
  }

  static TodayAsInt() {
    return new Date().getDay();
  }
}
