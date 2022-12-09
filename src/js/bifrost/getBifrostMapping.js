import inquirer from "inquirer";
import http from "http";

const urlEnv = {
  uat: `192.168.19.132`,
  dev: `192.168.19.131`,
};

function doRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      res.setEncoding("utf8");
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        resolve(JSON.parse(responseBody));
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

async function getMapping() {
  const options = {
    host: `${urlEnv.uat}`,
    port: 8080,
    path: "/bifrost/api/mapping",
    method: "GET",
  };

  return await doRequest(options, "");
}

function findMapping(parsed, mappingName) {
  const regex = /[\W_-\s]/;
  const maps = mappingName.split(regex);
  console.log({ maps });

  return parsed.filter((p) => {
    const sourceMaps = p.name.split(regex);
    console.log({ sourceMaps });

    return sourceMaps.includes(maps);
  });
}

async function askForParams() {
  return await inquirer
    .prompt([
      {
        type: "input",
        name: "mappingName",
        message: "Search for mapping: ",
      },
    ])
    .then((responses) => {
      return responses;
    });
}

async function main() {
  const response = await getMapping();
  const { mappingName } = await askForParams();
  const result = findMapping(response, mappingName);

  console.log({ result });
}

main();
