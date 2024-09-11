
import { GetAuthData } from "./store";


export const permissionsArray = [
    {
        userType: 'superadmin',
        allows: ["00530000005AdvsAAC", "0053b00000DgEVEAA3", "0051O00000CvAVTQA3"],
        permissions: {
            modules: {
              orderCreate :  {
                          view : true , 
                          create : true
                },  
                emailBlast : {
                       view : true  , 
                       create : true , 
                       
                }  , 
                filter : {
                    view : true
                } ,
                TopNav: {
                    hasAccess: true,
                    childModules: {
                        order_Status: true,
                        customer_service: true ,
                        how_To_Guide: true,
                        emailBlast: true,
                        accountTier: true,
                        auditReport: true,
                        myOrders: true
                    },
                },
                LogoNav: {
                    hasAccess: true,
                    childModules: {
                        myRetailers: true,
                        newArrivals: true,
                        brands: true,
                        dashboard: true,
                        
                    }
                },
                Header: {
                    hasAccess: true,
                    childModules: {
                        topProducts: true,
                        marketingCalender: true,
                        educationCenter: true,
                        customerSupport: true,
                        reports: true ,
                        salesReport : true  , 
                        newnessReport : true , 
                        comparisonReport: true , 
                        yearlyComparisonReport : true,
                        targetReport : true
                    },
                customer : {
                    hasAccess : true , 
                    childModules : {
                        charges : true, 
                        productMissing : true , 
                        productOverage : false , 
                        productDamage : false , 
                        updateAccountInfo : true 
                    },
                    Charges:true

                }
                }
            }
        }
    },
    {
        userType: 'salesRep',
        allows: [""], 
        permissions: {
            modules: {
                orderCreate :  {
                    view : true , 
                    create : false
          },  
          emailBlast : {
                 view : true  , 
                 create : false , 
                 
          }  , 
          filter : {
            view : false
        } ,
                TopNav: {
                    hasAccess: true,
                    childModules: {
                        order_Status: true,
                        customer_service: true,
                        how_To_Guide: true,
                        emailBlast: true,
                        accountTier: true,
                        auditReport: true,
                        myOrders: true
                    },
                },
                LogoNav: {
                    hasAccess: true,
                    childModules: {
                        myRetailers: true,
                        newArrivals: true,
                        brands: true,
                        dashboard: true,
                       
                    }
                },
                Header: {
                    hasAccess: true,
                    childModules: {
                        topProducts: true,
                        marketingCalender: true,
                        educationCenter: true,
                        customerSupport: true,
                        reports: true , 
                        salesReport : true  , 
                        newnessReport : true , 
                        comparisonReport: true , 
                        yearlyComparisonReport : true , 
                        targetReport : true
                    }
                }
            }
        }
    },
    {
        userType: 'custom 1',
        allows : ["0053b00000C75e8AAB " , "0053b00000DgGqOAAV"] ,
        permissions: {
            orderCreate :  {
                view : false , 
                create : false
      },  
      emailBlast : {
             view : false  , 
             create : false , 
             
      }  , 
      filter : {
        view : false
    } ,
        
            modules: {
                TopNav: {
                    hasAccess: true,
                    childModules: {
                        order_Status: false,
                        customer_service: false,
                        how_To_Guide: false,
                        emailBlast: false,
                        accountTier: false,
                        auditReport: true,
                        myOrders: false
                    },
                },
                LogoNav: {
                    hasAccess: true,
                    childModules: {
                        myRetailers: false,
                        newArrivals: false,
                        brands: false,
                        dashboard: true,
                       
                    }
                },
                Header: {
                    hasAccess: true,
                    childModules: {
                        topProducts: false,
                        marketingCalender: true,
                        educationCenter: false,
                        customerSupport: false,
                        reports:  true ,
                        salesReport : true  , 
                        newnessReport : false , 
                        comparisonReport: false , 
                        yearlyComparisonReport : false
                    }
                }
            }
        }
    }
];

// Get permissions based on logged in user
export async function getPermissions() {
    const authData = await GetAuthData();
    
    if (!authData) {
        console.log("No auth data found, or session expired.");
        return null;
    }

    const salesRepId = authData.Sales_Rep__c;
    let userType = 'user'; 

    for (const permission of permissionsArray) {
        if (permission.allows.includes(salesRepId)) {
            userType = permission.userType;
            break;
        }
    }

    const userPermissions = permissionsArray.find(p => p.userType === userType);

    if (!userPermissions) {
        console.log("Permissions not found for the user type.");
        return null;
    }

    return userPermissions.permissions;
}