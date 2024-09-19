
import { GetAuthData } from "./store";

export const permissionsArray = [
  {
    userType: "superadmin",
    allows: ["00530000005AdvsAAC", "0051O00000CvAVTQA3" , "0053b00000DgEVEAA3" ],
    permissions: {
      modules: {
        godLevel: true,
        store : {
          view : true 
        } ,
        products : {
            view : true  
        },
        order: {
          view: true,
          create: true,
        },
        emailBlast: {
          view: true,
          create: true,
        },
        myRetailers: {
          view: true,
          create: true,
        },
        newArrivals: {
          view: true,
          create: true,
        },
        brands: {
          view: true,
          create: true,
        },
        dashboard: {
          view: true,
        },
        topProducts: {
          view: true,
          create: true,
        },
        marketingCalender: {
          view: true,
          create: true,
        },
        educationCenter: {
          view: true,
          create: true,
        },
        customerSupport: {
          view: true,
          create: true,
          childModules: {
            order_Status: {
              view: true,
            },
            customer_service: {
              view: true,
            },
            how_To_Guide: {
              view: true,
            },
            brandManagementApproval : {
              view : true 
            }
          },
        },
        reports: {
          hasAccess: true,
          salesReport: {
            view: true,
          },
          newnessReport: {
            view: true,
          },
          comparisonReport: {
            view: true,
          },
          yearlyComparisonReport: {
            view: true,
          },
          targetReport: {
            view: true,
          },
          contactDetailedReport: {
            view: true,
          },
          accountTier: {
            view: true,
          },
          auditReport: {
            view: true,
          },
        },
      },
    },
  },
  {
    userType: "saleRep",
    allows: [""],
    permissions: {
      modules: {
        godLevel: false,
        store : {
          view : true 
        } ,
        products : {
            view : true  
        },

       
        
        order: {
          view: false,
          create: true,
        },
        emailBlast: {
          view: true,
          create: true,
        },
        myRetailers: {
          view: true,
          create: true,
        },
        newArrivals: {
          view: true,
          create: true,
        },
        brands: {
          view: true,
          create: true,
        },
        dashboard: {
          view: true,
        },
        topProducts: {
          view: true,
          create: true,
        },
        marketingCalender: {
          view: true,
          create: true,
        },
        educationCenter: {
          view: true,
          create: true,
        },
        customerSupport: {
          view: true,
          create: true,
          childModules: {
            order_Status: {
              view: true,
            },
            customer_service: {
              view: true,
            },
            how_To_Guide: {
              view: true,
            }
            ,
            brandManagementApproval : {
              view : true 
            }
          },
        },
        reports: {
          hasAccess: true,
          salesReport: {
            view: true,
          },
          newnessReport: {
            view: true,
          },
          comparisonReport: {
            view: true,
          },
          yearlyComparisonReport: {
            view: true,
          },
          targetReport: {
            view: true,
          },
          contactDetailedReport: {
            view: true,
          },
          accountTier: {
            view: true,
          },
          auditReport: {
            view: true,
          },
        },
      },
    },
  },
  {
    userType: "Report Manager",
    allows: ["0053b00000C75e8AAB", "0053b00000DgGqOAAV"  , ""],
    permissions: {
      modules: {
        godLevel: true,
        store : {
          view : false 
        } ,
        products : {
            view : false  
        },
        order: {
          view: false,
          create: false,
        },
        emailBlast: {
          view: false,
          create: false,
        },
        myRetailers: {
          view: false,
          create: false,
        },
        newArrivals: {
          view: false,
          create: false,
        },
        brands: {
          view: false,
          create: false,
        },
        dashboard: {
          view: true,
        },
        topProducts: {
          view: false,
          create: false,
        },
        marketingCalender: {
          view: true,
          create: false,
        },
        educationCenter: {
          view: false,
          create: false,
        },
        customerSupport: {
          view: false,
          create: false,
          childModules: {
            order_Status: {
              view: false,
            },
            customer_service: {
              view: false,
            },
            how_To_Guide: {
              view: true,
            },
            
            brandManagementApproval : {
              view : false 
            }
          },
        },
        reports: {
          hasAccess: true,
          salesReport: {
            view: true,
          },
          newnessReport: {
            view: false,
          },
          comparisonReport: {
            view: false,
          },
          yearlyComparisonReport: {
            view: false,
          },
          targetReport: {
            view: false,
          },
          contactDetailedReport: {
            view: false,
          },
          accountTier: {
            view: false,
          },
          auditReport: {
            view: true,
          },
        },
      },
    },
  },    
  // {
  //   userType: "custom 2",
  //   allows: ["0053b00000DgEVEAA3"],
  //   permissions: {
  //     modules: {
  //       godLevel: true,
  //       store : {
  //         view : true ,
  //         download : false
          
  //       } ,
  //       products : {
  //           view : true  
  //       },
  //       order: {
  //         view: true ,
  //         create: true,
  //       },
  //       emailBlast: {
  //         view: false,
  //         create: true,
  //       },
  //       myRetailers: {
  //         view: true,
  //         create: true,
  //       },
  //       newArrivals: {
  //         view: true,
  //         create: true,
  //       },
  //       brands: {
  //         view: true,
  //         create: true,
  //       },
  //       dashboard: {
  //         view: true,
  //       },
  //       topProducts: {
  //         view: true,
  //         create: true,
  //       },
  //       marketingCalender: {
  //         view: true,
  //         create: true,
  //       },
  //       educationCenter: {
  //         view: true,
  //         create: true,
  //       },
  //       customerSupport: {
  //         view: true,
  //         create: true,
  //         childModules: {
  //           order_Status: {
  //             view: true  ,
  //           },
  //           customer_service: {
  //             view: true  ,
  //           },
  //           how_To_Guide: {
  //             view: true,
  //           },
  //           brandManagementApproval : {
  //             view : true 
  //           }
  //         },
  //       },
  //       reports: {
  //         hasAccess: true,
  //         salesReport: {
  //           view: false,
  //         },
  //         newnessReport: {
  //           view: true,
  //         },
  //         comparisonReport: {
  //           view: true,
  //         },
  //         yearlyComparisonReport: {
  //           view: true,
  //         },
  //         targetReport: {
  //           view: true,
  //         },
  //         contactDetailedReport: {
  //           view: true,
  //         },
  //         accountTier: {
  //           view: true ,
  //         },
  //         auditReport: {
  //           view: true,
  //         },
  //       },
  //     },
  //   },
  // },
];
let temp = {
  userType: "custom 1",
  allows: ["0053b00000C75e8AAB", "0053b00000DgGqOAAV"],
  permissions: {
    modules: {
      godLevel: true,
      store : {
        view : true 
      } ,
      products : {
          view : true  
      },
      order: {
        view: false,
        create: true,
      },
      emailBlast: {
        view: true,
        create: true,
      },
      myRetailers: {
        view: true,
        create: true,
      },
      newArrivals: {
        view: true,
        create: true,
      },
      brands: {
        view: true,
        create: true,
      },
      dashboard: {
        view: true,
      },
      topProducts: {
        view: true,
        create: true,
      },
      marketingCalender: {
        view: true,
        create: true,
      },
      educationCenter: {
        view: true,
        create: true,
      },
      customerSupport: {
        view: true,
        create: true,
        childModules: {
          order_Status: {
            view: true,
          },
          customer_service: {
            view: true,
          },
          how_To_Guide: {
            view: true,
          },
          brandManagementApproval : {
            view : true 
          }
        },
      },
      reports: {
        hasAccess: true,
        salesReport: {
          view: true,
        },
        newnessReport: {
          view: true,
        },
        comparisonReport: {
          view: true,
        },
        yearlyComparisonReport: {
          view: true,
        },
        targetReport: {
          view: true,
        },
        contactDetailedReport: {
          view: true,
        },
        accountTier: {
          view: true,
        },
        auditReport: {
          view: false,
        },
      },
    },
  },
};

// Get permissions based on logged in user
export async function getPermissions() {
  const authData = await GetAuthData();

  if (!authData) {
    console.log("No auth data found, or session expired.");
    return null;
  }

  const salesRepId = authData.Sales_Rep__c;
  let userType = "saleRep";

  for (const permission of permissionsArray) {
    if (permission.allows.includes(salesRepId)) {
      userType = permission.userType;
      break;
    }
  }

  const userPermissions = permissionsArray.find((p) => p.userType === userType);

  if (!userPermissions) {
    console.log("Permissions not found for the user type.");
    return null;
  }

  return userPermissions.permissions;
}
