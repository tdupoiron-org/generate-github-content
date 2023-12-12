const Chance = require('chance');
const chance = new Chance();
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  baseUrl: "https://ghes.dupoiron.com/api/v3"
})

// Generate a function to generate x random names
function generateNames(x) {
  var names = [];
  for (var i = 0; i < x; i++) {
    
    names.push(chance.name());
    // remove spaces and add ramdom uuid
    names[i] = names[i].replace(/\s/g, '') + '_' + chance.guid();
  }
  return names;
}

async function createRepository(domain, org, repo) {

  // Create repository
  await octokit.request('POST /orgs/{org}/repos', {
    org: `${org}`,
    name: `${repo}`,
    }).then(({ data, headers, status }) => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });

    // Add topics
    await octokit.request('PUT /repos/{owner}/{repo}/topics', {
      owner: `${org}`,
      repo: `${repo}`,
      names: [
        'test'
      ]
    }).then(({ data, headers, status }) => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });

  }

  async function main() {
    let names = generateNames(1000);
    console.log(names);

    names.forEach(async function(name) {
      await createRepository('ghes.dupoiron.com', 'tdupoiron-org', name);
    });

  }

  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

  main();