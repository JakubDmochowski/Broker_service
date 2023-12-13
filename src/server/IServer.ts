export interface IServer {
  readonly port: number,
  readonly hostname: string,
  run(callback : () => void) : void
}
