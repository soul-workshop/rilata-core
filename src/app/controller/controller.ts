export interface Controller {
  execute(req: Request): Promise<Response>

  getUrls(): string[]
}
