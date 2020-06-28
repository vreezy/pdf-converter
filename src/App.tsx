import React from 'react';
import { useState } from 'react';

import './App.css';

import { Service, IPDFResponse, IPDFRequest } from './service';
import readFileAsync from './readFileAsync';
import * as base64Arraybuffer from 'base64-arraybuffer';
import { getGUID } from "@pnp/common";

import { 
   PrimaryButton
} from '@fluentui/react';

function App() {
   const [loading, setLoading] = useState<boolean>(false);
   const [pdfResponse, setPdfResponse] = useState<IPDFResponse>({
      status: "failed",
      base64Content: ""
   });
   
   const onFileChange = async (event: any) => {
      setLoading(true);
      try {
         // get filedata
         const file: File = event.target.files[0];
         // read file
         const arrayBuffer: ArrayBuffer = await readFileAsync(file);
         // convert arrayBufer to base64string
         const base64 = base64Arraybuffer.encode(arrayBuffer);
         // original filename not relevant. flow can't handle random strings, so we push a random string from frontend
         const pdfRequest: IPDFRequest = {
            filename: getGUID() + ".docx", 
            base64Content: base64
         };
         // convert
         console.log("Request: ", pdfRequest);
         console.log("base64string length: ", pdfRequest.base64Content.length);
         console.time('PDF-Convert');
         const pdfResponse: IPDFResponse = await Service.convertToPDF(pdfRequest);
         console.timeEnd('PDF-Convert');
         console.log("Response:" , pdfResponse);
         // return
         setPdfResponse(pdfResponse);
      }
      catch(e) {
         console.log(e);
         setPdfResponse({
            status: "failed",
            base64Content: ""
         });
      }
      setLoading(false);
   }

   if (loading) {
      return (
         <div className="App">
            <p>Loading, Please wait...</p>
         </div>
      )
   }

   return (
      <div className="App">
         <h1>PDF-Konverter</h1>

         <div>
            <p>Bitte eine ".docx" Datei auswählen (diese wird sofort hochgeladen!)</p>
            <input type="file" title="Please select a .docx file" onChange={onFileChange} /> <br/>
            <br />
            
            <PrimaryButton disabled={pdfResponse.status !== "success"} text="Download" href={'data:application/octet-stream;base64,' + pdfResponse.base64Content} download="download.pdf"/>
            <br />
            <br />

            <object type="application/pdf" data={'data:application/pdf;base64,' + pdfResponse.base64Content} className={pdfResponse.status !== "success" ? "hidden" : "object"}>PDF OUTPU</object>

            <br />
         </div>
      </div>
   );
}

export default App;
