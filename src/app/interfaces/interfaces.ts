export interface loginReq {
    username: string,
    password: string,
    type: string
}
export interface emailVerificationReq {
    email: string,
    otp: null,
}
export interface otpVerificationReq {
    email: string,
    otp: number,
}
export interface addCustomerReq {
     firstName :  string ,
   lastName :  string ,
   fathersName :  string ,
   tazkiraNumber :  string ,
   phone :  string ,
   gender : number,
   dob :  any ,
   country : number,
   nationality :  number,
   language :  number,
   info :  string ,
   email :  string ,
   password :  string ,
   fcmToken :  string ,
   batchId :  number,
   active :  boolean,
   pep :  boolean,
   province :  string ,
   occupation :  string ,
   monthlyIncome :  string ,
   nextKin :  string ,
   address : {
     countryId :  number,
     province :  string ,
     district :  string ,
     village :  string ,
     streetNo :  string ,
     houseOrFlatOrBuilding :  string ,
     postalCode :  string 
  },
   bulkFlag :  boolean

}

export interface findFeesAndCommissionFPWReq {
    walletNo : string,
    transactionAmount: number,
    serviceName: string,
    userType: string,
    loginId: number
      
}

export interface FormControlConfig{
    id : string,
    name: string,
    label : string,
    type: 'text' | 'email' | 'password' | 'dropdown' | 'radio',
    placeholder ?: string,
    validation ?: ValidationRules,
    icon ?: string,
    errortext ?: ErrorMessages,
    options?: { key: string, value: string }[]; // for dropdown and radio buttons

}

export interface ValidationRules{
    required?: boolean; // Whether the field is required
    minLength?: number; // Minimum length of the field value
    maxLength?: number; // Maximum length of the field value
    pattern?: string | RegExp; // Regular expression pattern for validation
    // Add more validation rules as needed
}

export interface ErrorMessages {
    required?: string; // Error message for required validation
    minLength?: string; // Error message for minLength validation
    maxLength?: string; // Error message for maxLength validation
    pattern?: string; // Error message for pattern validation
    // Add more error messages as needed
  }
