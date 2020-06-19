export interface IPDFRequest {
   filename: string;
   base64Content: string;
}

export interface IPDFResponse {
   status: "success" | "failed";
   base64Content: string;
}

export class Service {
   public static async convertToPDF(request: IPDFRequest): Promise<IPDFResponse> {
      try {
         // after git clone change url!
         const url = "https://prod.westeurope.logic.azure.com:443/workflows/...";
         const options: RequestInit = {
               headers: {
                  "Content-Type": "application/json"
               },
               method: "POST",
               body: JSON.stringify(request)
         };

         const response = await fetch(url, options);
      
         if (response.status !== 200) {
               return {
                  status: "failed",
                  base64Content: ""
               };
         }
         else {
               const json = await response.json();
               return json;
         }
      }
      catch(e) {
         console.log(e);
         return {
               status: "failed",
               base64Content: ""
         };
      }
   }
}
