/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { MiRole } from './miRole';
import { Department } from './department';
import { Branch } from './branch';
import { RoleManagement } from './roleManagement';


export interface BackOffice { 
    id?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    userType?: BackOffice.UserTypeEnum;
    userCategoryType?: BackOffice.UserCategoryTypeEnum;
    active?: boolean;
    role?: MiRole;
    roleData?: RoleManagement;
    username?: string;
    password?: string;
    branch?: Branch;
    department?: Department;
}
export namespace BackOffice {
    export type UserTypeEnum = 'CUSTOMER' | 'AGENT' | 'CORPORATE' | 'BO' | 'USER_CORPORATE';
    export const UserTypeEnum = {
        Customer: 'CUSTOMER' as UserTypeEnum,
        Agent: 'AGENT' as UserTypeEnum,
        Corporate: 'CORPORATE' as UserTypeEnum,
        Bo: 'BO' as UserTypeEnum,
        UserCorporate: 'USER_CORPORATE' as UserTypeEnum
    };
    export type UserCategoryTypeEnum = 'MAKER' | 'CHECKER';
    export const UserCategoryTypeEnum = {
        Maker: 'MAKER' as UserCategoryTypeEnum,
        Checker: 'CHECKER' as UserCategoryTypeEnum
    };
}


