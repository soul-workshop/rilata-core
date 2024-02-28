export interface Controller {
  execute(req: Request): Promise<Response>

  getUrl(): string
}
