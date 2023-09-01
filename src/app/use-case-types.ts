export type UseCaseOptions<IN, ERR, OUT, EVENT, EXC_FIELDS extends string[]> = {
  in: IN,
  err: ERR,
  OUT: OUT,
  event: EVENT,
  excludeFields: EXC_FIELDS,
}
