import { Route, Get, Path, Request } from "tsoa";

@Route("hello")
export class HelloRoute {
  @Get("{name}")
  public async sayHello(
    @Path() name: string,
    @Request() _request: unknown
  ): Promise<string> {
    return `Hello ${name}`;
  }
}