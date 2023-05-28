export as namespace reducers;

export interface ReduxState {
  loading: number;
  modal: 'hide' | 'close' | 'open';
}
