import axios from "axios";
import { DestoryAuth, admins, originAPi } from "../lib/store";

const useSalesReport = () => {
  return {
    salesReportData: async ({ yearFor ,dateFilter}) => {
      let salesRepId = JSON.parse(localStorage.getItem("Api Data")).data.Sales_Rep__c;
      let reportUrl = originAPi+"/9kJs2I6Bn/i0IT68Q8&0";
      if (admins.includes(salesRepId)) {
        reportUrl = originAPi+"/report/4i1cKeDt9"
      }
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await axios.post(
        reportUrl,
        {
          salesRepId: salesRepId,
          yearFor: yearFor,
          dateFilter,
        },{headers: {
          'Timezone': timezone,
      },}
      );
      // const response = await axios.post("https://dev.beautyfashionsales.com/report/4i1cKeDt9");
      if (admins.includes(salesRepId)) {
        response.data.ownerPermission = true;
      }
      if (response.status == 300) {
        DestoryAuth();
      } else {
        return response;
      }
    },
  };
};

export default useSalesReport;
