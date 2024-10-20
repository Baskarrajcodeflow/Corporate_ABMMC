export * from './serviceController.service';
import { ServiceControllerService } from './serviceController.service';
export * from './serviceRouter.service';
import { ServiceRouterService } from './serviceRouter.service';
export * from './uploadContoller.service';
import { UploadContollerService } from './uploadContoller.service';
export const APIS = [ServiceControllerService, ServiceRouterService, UploadContollerService];
