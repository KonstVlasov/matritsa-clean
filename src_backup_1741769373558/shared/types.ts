export type Status = 'initial' | 'fetching' | 'success' | 'failure';

export interface RemoteDataState<TData, TError = string> {
  data: TData | null;
  error: TError | null;
  status: Status;
  // fetchCount?: number;
  // lastFetchTime?: number;
}
