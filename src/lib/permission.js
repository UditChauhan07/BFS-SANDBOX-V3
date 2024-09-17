
import { GetAuthData } from "./store";


export const permissionsArray = [
    {
        userType: 'superadmin',
        allows: ["00530000005AdvsAAC", "0051O00000CvAVTQA3"],
        permissions: {
            modules: {
                godLevel: false,
                order: {
                    view: true,
                    create: true
                },
                emailBlast: {
                    view: true,
                    create: true,
                },
                myRetailers: {
                    view: true,
                    create: true
                },
                newArrivals: {
                    view: true,
                    create: true
                },
                brands: {
                    view: true,
                    create: true
                },
                dashboard: {
                    view: true
                },
                topProducts: {
                    view: true,
                    create: true
                },
                marketingCalender: {
                    view: true,
                    create: true
                },
                educationCenter: {
                    view: true,
                    create: true
                },
                customerSupport: {
                    view: true,
                    create: true,
                },

                reports: {
                    hasAccess: true,
                    salesReport: {
                        view: true,
                        admins: true
                    },
                    newnessReport: {
                        view: true,
                        admins: true
                    },
                    comparisonReport: {
                        view: true,
                        admins: true
                    },
                    yearlyComparisonReport: {
                        view: true,
                        admins: true
                    }, targetReport: {
                        view: true,
                        admins: true
                    }, contactDetailedReport: {
                        view: true,
                        admins: true
                    }

                },

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

            }
        }
    },
    {
        userType: 'saleRep',
        allows: [""],
        permissions: {
            modules: {
                godLevel: false,
                order: {
                    view: true,
                    create: true
                },
                emailBlast: {
                    view: true,
                    create: true,

                },
                myRetailers: {
                    view: true,
                    create: true
                },
                newArrivals: {
                    view: true,
                    create: true
                },
                brands: {
                    view: true,
                    create: true
                },
                dashboard: {
                    view: true
                },
                topProducts: {
                    view: true,
                    create: true
                },
                marketingCalender: {
                    view: true,
                    create: true
                },
                educationCenter: {
                    view: true,
                    create: true
                },
                customerSupport: {
                    view: true,
                    create: true,
                },

                reports: {
                    hasAccess: true,
                    salesReport: {
                        view: true,
                        admins: true
                    },
                    newnessReport: {
                        view: true,
                        admins: true
                    },
                    comparisonReport: {
                        view: true,
                        admins: true
                    },
                    yearlyComparisonReport: {
                        view: true,
                        admins: true
                    }, targetReport: {
                        view: true,
                        admins: true
                    }
                    , contactDetailedReport: {
                        view: true,
                        admins: true
                    }


                },

                TopNav: {
                    hasAccess: true,
                    childModules: {
                        order_Status: true,
                        customer_service: false,
                        how_To_Guide: true,
                        emailBlast: true,
                        accountTier: true,
                        auditReport: true,
                        myOrders: true
                    },
                },

            }
        }
    },
    {
        userType: 'custom 1',
        allows: ["0053b00000C75e8AAB", "0053b00000DgGqOAAV", ""],
        permissions: {
            modules: {
                godLevel: false,
                order: {
                    view: false,
                    create: false
                },
                emailBlast: {
                    view: false,
                    create: false,

                },
                myRetailers: {
                    view: false,
                    create: false
                },
                newArrivals: {
                    view: false,
                    create: false
                },
                brands: {
                    view: false,
                    create: false
                },
                dashboard: {
                    view: true
                },
                topProducts: {
                    view: false,
                    create: false
                },
                marketingCalender: {
                    view: true,
                    create: false
                },
                educationCenter: {
                    view: false,
                    create: false
                },
                customerSupport: {
                    view: false,
                    create: false,
                },

                reports: {
                    hasAccess: false,
                    salesReport: {
                        view: true,
                        admins: true
                    },
                    newnessReport: {
                        view: false,
                        admins: true
                    },
                    comparisonReport: {
                        view: false,
                        admins: true
                    },
                    yearlyComparisonReport: {
                        view: false,
                        admins: true
                    }, targetReport: {
                        view: false,
                        admins: true
                    }, contactDetailedReport: {
                        view: false,
                        admins: true
                    }

                },

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

            }
        }
    },
    {
        userType: 'custom 2',
        allows: ["0053b00000DgEVEAA3"],
        permissions: {
            modules: {
                godLevel: true,
                order: {
                    view: true,
                    create: true
                },
                emailBlast: {
                    view: true,
                    create: true,
                },
                myRetailers: {
                    view: true,
                    create: true
                },
                newArrivals: {
                    view: true,
                    create: true
                },
                brands: {
                    view: true,
                    create: true
                },
                dashboard: {
                    view: true
                },
                topProducts: {
                    view: true,
                    create: true
                },
                marketingCalender: {
                    view: true,
                    create: true
                },
                educationCenter: {
                    view: true,
                    create: true
                },
                customerSupport: {
                    view: true,
                    create: true,
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
                    }
                },
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

            }
        }
    }
];
let temp = {
    userType: 'custom 1',
    allows: ["0053b00000C75e8AAB", "0053b00000DgGqOAAV"],
    permissions: {
        modules: {
            order: {
                view: false,
                create: false
            },
            emailBlast: {
                view: false,
                create: false,
            },
            filter: {
                view: false
            },
            myRetailers: {
                view: false,
                create: false
            },
            newArrivals: {
                view: false,
                create: false
            },
            brands: {
                view: false,
                create: false
            },
            dashboard: {
                view: true
            },
            topProducts: {
                view: false,
                create: false
            },
            marketingCalender: {
                view: true,
                create: false
            },
            educationCenter: {
                view: false,
                create: false
            },
            customerSupport: {
                view: false,
                create: {
                    order_Status: false,
                    customer_service: false,
                    how_To_Guide: false,
                    emailBlast: false,
                    accountTier: false,
                    auditReport: true,
                },
            },
            reports: {
                hasAccess: false,
                salesReport: {
                    view: true,
                    admins: true
                },
                newnessReport: {
                    view: false,
                    admins: true
                },
                comparisonReport: {
                    view: false,
                    admins: true
                },
                yearlyComparisonReport: {
                    view: false,
                    admins: true
                },
                targetReport: {
                    view: false,
                    admins: true
                },
                contactDetailedReport: {
                    view: false,
                    admins: true
                }
            }
        }
    }
}

// Get permissions based on logged in user
export async function getPermissions() {
    const authData = await GetAuthData();

    if (!authData) {
        console.log("No auth data found, or session expired.");
        return null;
    }

    const salesRepId = authData.Sales_Rep__c;
    let userType = 'saleRep';

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