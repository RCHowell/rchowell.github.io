const Moment = require('moment');
const Handlebars = require('handlebars');

const base = 'https://api.github.com/graphql';
const owner = 'rchowell';
const repo = `${owner}.github.io`;

// https://developer.github.com/v4/
const query = {
  query: `{
    repository(name: "${repo}", owner: "${owner}") {
      url
      issues(orderBy: {field: CREATED_AT, direction: DESC}, first: 20) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          title
          authorAssociation
          createdAt
          url
          number
          labels(first: 3) {
            nodes {
              name
              color
              url
            }
          }
        }
      }
    }
    user(login: "${owner}") {
      avatarUrl
      bio
      location
      name
      url
      pinnedItems(first: 6) {
        nodes {
          ... on Repository {
            name
            createdAt
            url
            description
            languages(first: 3, orderBy: {direction: DESC, field: SIZE}) {
              nodes {
                name
                color
              }
            }
            stargazers {
              totalCount
            }
          }
          ... on Gist {
            createdAt
            url
            description
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  }`,
};

const options = {
  method: 'POST',
  headers: {
    'Authorization': 'bearer GITHUB_TOKEN_RO',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(query),
};

window.onload = async () => {
  const container = document.getElementById('main');
  const mainTemplateSource = document.getElementById('main-template').innerHTML;
  const template = Handlebars.compile(mainTemplateSource);
  const res = await fetch(new Request(base, options));
  const json = await res.json();
  const posts = json.data.repository.issues.nodes
    .filter((n) => n.authorAssociation === 'OWNER')
    .map((p) => {
      p.createdAt = Moment(p.createdAt).format('MMM Do YYYY');
      return p;
    });
  json.data.posts = posts;
  container.innerHTML = template(json.data);
};
