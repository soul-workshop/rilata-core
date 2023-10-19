export type ResultDTO<FAIL, SUCCESS> = {
  success: false,
  payload: FAIL,
} | {
  success: true,
  payload: SUCCESS,
};
