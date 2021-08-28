import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const errorMsg = exception instanceof HttpException ? exception.getResponse() : 'Internal server error!';
    const status =  exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =typeof errorMsg === 'object' &&errorMsg !== null && errorMsg.hasOwnProperty('message')? errorMsg['message'] : errorMsg;
    
    if (typeof message !== 'string' && message?.length) {
      message = message[0];
    }
	// console.log('typeof message === ', typeof message);
	// console.log(' message === ', message);
	// console.log(' status === ', status);

    const error = {
      statusCode: status || 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message || 'Internal Server Error',
    };

	console.log('error: ', error);
	

    const msg = `"path: ${error.path}" "status: ${error.statusCode}" "error: ${error.message}"`;
    Logger.error(msg);

    response.status(status).json(error);
  }
}
