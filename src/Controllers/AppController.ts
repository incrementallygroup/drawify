import { PlayBaseController } from './PlayBaseController';
import { RecordController } from './RecordController';
import { EventListenerController } from './EventListenerController';
import { IUserAction, UserActionType, AppStates } from '../Interfaces/AppInterfaces';
import AppState from '../State/AppState';
import { Targets, IAction } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';
import Timer from '../Timer/Timer';
import { BoardController } from './BoardController';

@singleton()
export class AppController {

  constructor(
    private board: BoardController,
    private player: PlayBaseController,
    private recorder: RecordController,
    private eventListeners: EventListenerController,
    private state: AppState,
    private dispatcher: Dispatcher,
    private timer: Timer,
    private svg: HTMLElement
  ) {
    let viewBox = { x: 0, y: 0, width: 1200, height: 800 };
    const viewboxElem = this.svg.getAttributeNS(null, 'viewBox');
    if (viewboxElem !== null) {
      const arr = viewboxElem.split(' ').map(Number);
      viewBox = { x: arr[0], y: arr[1], width: arr[2], height: arr[3] };
    } else {
      throw new Error('The SVG element requires the view box attribute to be set.');
    }

    // These are missing timestamps?
    this.dispatcher.onAction(this.actionHandler.bind(this));
    this.eventListeners.addEventListeners();
    this.player.dispatchUserAction = this.dispatchUserAction.bind(this);

    const initialState: IAction[] = [{ target: Targets.VIEW_BOX, options: viewBox }];
    initialState.forEach(event => {
      this.dispatcher.dispatchAction(event);
    });
  }

  public dispatchUserAction(action: IUserAction): void {
    console.log('USER ACTION: ' + action.action);
    switch (action.action) {
      case UserActionType.START:
        this.timer.start();
        this.player.play();
        this.state.state = AppStates.START;
        break;
      case UserActionType.PAUSE:
        this.timer.pause();
        this.player.pause();
        this.state.state = AppStates.PAUSE;
        break;
      case UserActionType.STOP:
        this.timer.pause();
        this.player.pause();
        this.state.state = AppStates.PAUSE;
        if (this.timer.atEnd()) {
          this.dispatcher.dispatchAction({ target: Targets.END });
        }
        this.player.setEventLog(this.recorder.getEventLog());
        break;
      case UserActionType.REVERSE:
        this.timer.reverse();
        this.state.state = AppStates.REVERSE;
        break;
      case UserActionType.RESTART:
        this.dispatchUserAction({ action: UserActionType.STOP })
        this.timer.restart();
        this.player.restart();
        this.player.predraw();
        break;
      default:
        break;
    }
  }

  public actionHandler(action: IAction): void {
    switch (action.target) {
      case Targets.END:
        this.dispatchUserAction({ action: UserActionType.PAUSE });
        break;
      default:
        break;
    }
  }
}
