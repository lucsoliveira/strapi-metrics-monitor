import axios from "axios";
import { Table } from "console-table-printer";

//@ts-ignore
const projectName = process.argv[2] || "N/A";
//@ts-ignore
const urlMetrics = process.argv[3];
//@ts-ignore
const secondsUpdate = process.argv[4] || 2000;

const convertBytesToMB = (value: number) => {
  return (value / (1024 * 1024)).toFixed(2) + " MB";
};

function getMetrics(url: string) {
  const result = axios
    .get(url)
    .then((res) => {
      const { data } = res;
      const lines = data.split("\n");

      let strapi_process_resident_memory_bytes = 0;
      let strapi_process_virtual_memory_bytes = 0;
      let strapi_nodejs_external_memory_bytes = 0;
      let strapi_nodejs_heap_size_total_bytes = 0;
      let strapi_nodejs_heap_size_used_bytes = 0;

      for (const item of lines) {
        const objAux = item.split(" ");

        if (objAux[0] === "strapi_process_resident_memory_bytes") {
          strapi_process_resident_memory_bytes = Number(objAux[1]);
        }

        if (objAux[0] === "strapi_process_virtual_memory_bytes") {
          strapi_process_virtual_memory_bytes = Number(objAux[1]);
        }

        if (objAux[0] === "strapi_nodejs_heap_size_total_bytes") {
          strapi_nodejs_heap_size_total_bytes = Number(objAux[1]);
        }

        if (objAux[0] === "strapi_nodejs_external_memory_bytes") {
          strapi_nodejs_external_memory_bytes = Number(objAux[1]);
        }

        if (objAux[0] === "strapi_nodejs_heap_size_used_bytes") {
          strapi_nodejs_heap_size_used_bytes = Number(objAux[1]);
        }
      }

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
      p.addRows([
        {
          index: 4,
          text: "strapi_nodejs_heap_size_total_bytes",
          value: convertBytesToMB(strapi_nodejs_heap_size_total_bytes),
        },
      ]);
      p.addRows([
        {
          index: 5,
          text: "strapi_nodejs_heap_size_used_bytes",
          value: convertBytesToMB(strapi_nodejs_heap_size_used_bytes),
        },
      ]);

      p.printTable();
    })
    .catch((error) => {
      console.error(
        "\nError while fetching data from strapi server. Is it up?"
      );
    });
}

setInterval(() => {
  console.clear();
  console.log(`Project: ${projectName}`);
  console.log(`------ Memory ------`);
  getMetrics(urlMetrics);
}, secondsUpdate);
