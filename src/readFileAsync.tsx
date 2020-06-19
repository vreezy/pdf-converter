export const readFileAsync = (file: File): Promise<ArrayBuffer>  => {
   return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
         resolve(reader.result as ArrayBuffer);
      };

      reader.onerror = reject;

      reader.readAsArrayBuffer(file);
   });
}

export default readFileAsync;