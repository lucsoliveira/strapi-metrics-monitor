const axios = require("axios");
const { Table } = require("console-table-printer");

const projectName = process.argv[2];
const urlMetrics = process.argv[3];

const convertBytesToMB = (value) => {
  return (value / (1024 * 1024)).toFixed(2) + " MB";
};

function getMetrics(url) {
  const result = axios.get(url).then((res) => {
    const { data } = res;
    const lines = data.split("\n");

    const aux = [];

    let strapi_process_resident_memory_bytes;
    let strapi_process_virtual_memory_bytes;
    let strapi_nodejs_external_memory_bytes;
    for (const item of lines) {
      const objAux = item.split(" ");

      if (objAux[0] === "strapi_process_resident_memory_bytes") {
        strapi_process_resident_memory_bytes = Number(objAux[1]);
      }

      if (objAux[0] === "strapi_process_virtual_memory_bytes") {
        strapi_process_virtual_memory_bytes = Number(objAux[1]);
      }

      if (objAux[0] === "strapi_nodejs_external_memory_bytes") {
        strapi_nodejs_external_memory_bytes = Number(objAux[1]);
      }
    }

    const finalObj = {
      strapiProcessResidentMemory: convertBytesToMB(
        strapi_process_resident_memory_bytes
      ),
      strapiProcessVirtualMemoryBytes: convertBytesToMB(
        strapi_process_virtual_memory_bytes
      ),
      strapiNodejsExternalMemoryBytes: convertBytesToMB(
        strapi_nodejs_external_memory_bytes
      ),
    };

    const p = new Table();

    p.addRow({
      index: 1,
      text: "strapi_process_resident_memory_bytes",
      value: convertBytesToMB(strapi_process_resident_memory_bytes),
    });
    p.addRow({
      index: 2,
      text: "strapi_process_virtual_memory_bytes",
      value: convertBytesToMB(strapi_process_virtual_memory_bytes),
    });
    p.addRows([
      {
        index: 3,
        text: "strapi_nodejs_external_memory_bytes",
        value: convertBytesToMB(strapi_nodejs_external_memory_bytes),
      },
    ]);

    p.printTable();
  });
}

setInterval(() => {
  console.clear();
  console.log(`Project: ${projectName}`);
  console.log(`------ Memory ------`);
  getMetrics(urlMetrics);
}, 2000);
