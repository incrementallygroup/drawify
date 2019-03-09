import { IRecordPoint, IPoint, Action, BoardState } from '../interfaces';
import RecordLog from './RecordLog';
import Timer from './Timer';

export class RecordController {
  private recordLog: RecordLog;
  private timer: Timer;

  constructor() {
    this.recordLog = new RecordLog();
    this.timer = new Timer();
  }

  public start() {
    this.timer.start();
  }

  public pause() {
    this.timer.pause();
  }

  public stop() {
    this.timer.stop();
  }

  public printLog() {
    this.recordLog.print();
  }

  public event(point: IPoint, action: Action, boardState: BoardState) {
    switch (action) {
      case Action.POINTER_DOWN:
        this.newObject(point, action, boardState);
        break;
      case Action.POINTER_MOVE:
        this.addPoint(point);
        break;
      default:
        break;
    }
  }

  private newObject(point: IPoint, action: Action, boardState: BoardState) {
    const time = this.timer.getTime();
    this.recordLog.newObject(
      { time, ...point},
      action,
      boardState,
      time,
    );
  }

  private addPoint(point: IPoint) {
    const time = this.timer.getTime();
    this.recordLog.addPoint({time, ...point});
  }

  // private onPointerDown(e: TouchEvent | MouseEvent) {

  //   this.log.addObject()
  // }

  // private createPoint(e: TouchEvent | MouseEvent): IPoint {
  //   return {
  //     time: this.log.getStartTime,
  //     e.
  //   }
  // }

  // private newObject(startPoint: {type: string, x: number, y: number}) {
  //   const startTime = new Date().getTime();

  //   this.log.objects.push({
  //     startTime,
  //     numPoints: 1,
  //     points: [{
  //         point: {type: startPoint.type, x: startPoint.x, y: startPoint.y},
  //         stringPoint: startPoint.type + startPoint.x + ' ' + startPoint.y,
  //         numPoints: 1,
  //         time: startTime,
  //     }],
  //   });
  // }

  // private addPoint() {
  //   this.log.objects.points[].push({
  //   })
  // }
}
