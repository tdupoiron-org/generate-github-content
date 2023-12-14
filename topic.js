const { Octokit } = require("@octokit/core");
const { paginateGraphql } = require("@octokit/plugin-paginate-graphql");

const MyOctokit = Octokit.plugin(paginateGraphql);

const octokit = new MyOctokit({
  auth: process.env.GITHUB_TOKEN,
  baseUrl: "https://ghes.dupoiron.com/api"
})

async function repositoriesByTopic(topic, pageSize = 100) {

  console.log(`Searching repositories from topic: ${topic}`);

  let query = `
    query ($cursor: String) {
      topic(name: "${topic}") {
        id
        name
        repositories(first: ${pageSize}, after: $cursor, orderBy: {field: NAME, direction: ASC}){
          nodes{
            id
            name
            url
          }    
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  let response = await octokit.graphql.paginate(query);
  console.log(response.topic.repositories.nodes.length);

}

async function repositoriesBySearch(topic, pageSize = 100) {

  console.log(`Searching repositories from search: ${topic}`);

    let query = `
      query paginate($cursor: String){
        search(query: "topic:${topic}", type: REPOSITORY, first: ${pageSize}, after: $cursor){
          nodes{
            ... on Repository {
              id
              name
              url
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

  let response = await octokit.graphql.paginate(query);
  console.log(response.search.nodes.length);

}

async function main() {
  
  const keyword = 'test';
  const pageSize = 97;

  console.log(`Searching repositories from topic: ${keyword} with page size: ${pageSize}`);

  await repositoriesBySearch(keyword, pageSize);
  await repositoriesByTopic(keyword, pageSize);

}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
main();