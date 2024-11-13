
const validateVendorType = (value:string) => {
   if(value == "" || value.trim() === ""){
     return false;
   }

   return true;
}

export  default validateVendorType;