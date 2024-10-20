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
import { BaseUser } from './baseUser';
import { RoleManagement } from './roleManagement';
import { WalletAccount } from './walletAccount';


export interface MiPayAgent { 
    id?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    userType?: MiPayAgent.UserTypeEnum;
    userCategoryType?: MiPayAgent.UserCategoryTypeEnum;
    active?: boolean;
    role?: MiRole;
    roleData?: RoleManagement;
    username?: string;
    password?: string;
    gender?: MiPayAgent.GenderEnum;
    familyId?: number;
    agentType?: MiPayAgent.AgentTypeEnum;
    parent?: BaseUser;
    children?: Array<BaseUser>;
    accountKycLevel?: MiPayAgent.AccountKycLevelEnum;
    accountType?: MiPayAgent.AccountTypeEnum;
    walletAccount?: WalletAccount;
}
export namespace MiPayAgent {
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
    export type GenderEnum = 'MALE' | 'FEMALE' | 'OTHERS' | 'DEFAULT';
    export const GenderEnum = {
        Male: 'MALE' as GenderEnum,
        Female: 'FEMALE' as GenderEnum,
        Others: 'OTHERS' as GenderEnum,
        Default: 'DEFAULT' as GenderEnum
    };
    export type AgentTypeEnum = 'SUPER_AGENT' | 'MERCHANT' | 'AGENT' | 'SUBAGENT' | 'SUB_MERCHANT' | 'HAND_SELLER' | 'USER_SUPER_AGENT' | 'USER_MERCHANT' | 'USER_AGENT' | 'USER_SUBAGENT' | 'USER_SUB_MERCHANT' | 'USER_HAND_SELLER';
    export const AgentTypeEnum = {
        SuperAgent: 'SUPER_AGENT' as AgentTypeEnum,
        Merchant: 'MERCHANT' as AgentTypeEnum,
        Agent: 'AGENT' as AgentTypeEnum,
        Subagent: 'SUBAGENT' as AgentTypeEnum,
        SubMerchant: 'SUB_MERCHANT' as AgentTypeEnum,
        HandSeller: 'HAND_SELLER' as AgentTypeEnum,
        UserSuperAgent: 'USER_SUPER_AGENT' as AgentTypeEnum,
        UserMerchant: 'USER_MERCHANT' as AgentTypeEnum,
        UserAgent: 'USER_AGENT' as AgentTypeEnum,
        UserSubagent: 'USER_SUBAGENT' as AgentTypeEnum,
        UserSubMerchant: 'USER_SUB_MERCHANT' as AgentTypeEnum,
        UserHandSeller: 'USER_HAND_SELLER' as AgentTypeEnum
    };
    export type AccountKycLevelEnum = 'NONE' | 'BASIC' | 'FULL';
    export const AccountKycLevelEnum = {
        None: 'NONE' as AccountKycLevelEnum,
        Basic: 'BASIC' as AccountKycLevelEnum,
        Full: 'FULL' as AccountKycLevelEnum
    };
    export type AccountTypeEnum = 'AGENT' | 'USSD_AGENT' | 'MM_STAFF' | 'MICRO_MERCHANT' | 'MERCHANT';
    export const AccountTypeEnum = {
        Agent: 'AGENT' as AccountTypeEnum,
        UssdAgent: 'USSD_AGENT' as AccountTypeEnum,
        MmStaff: 'MM_STAFF' as AccountTypeEnum,
        MicroMerchant: 'MICRO_MERCHANT' as AccountTypeEnum,
        Merchant: 'MERCHANT' as AccountTypeEnum
    };
}


