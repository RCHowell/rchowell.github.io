const base = 'https://api.github.com/graphql';
const owner = 'rchowell';
const repo = `${owner}.github.io`;
const ro = process.env.GITHUB_TOKEN_RO;


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
    'Authorization': `bearer ${ro}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(query),
};

const test = '{"data":{"repository":{"issues":{"pageInfo":{"endCursor":"Y3Vyc29yOnYyOpK5MjAyMC0wMi0wOFQxNDo1NzoyMS0wODowMM4hgNIj","hasNextPage":false},"nodes":[{"title":"SAC 843rd","authorAssociation":"OWNER","createdAt":"2020-02-08T19:30:17Z","url":"https://github.com/RCHowell/rchowell.github.io/issues/1","labels":{"nodes":[{"name":"Plan R","color":"c41600"},{"name":"SAC-843","color":"011c5b"}]}},{"title":"Second for testing","authorAssociation":"OWNER","createdAt":"2020-02-08T22:57:21Z","url":"https://github.com/RCHowell/rchowell.github.io/issues/2","labels":{"nodes":[]}}]}},"user":{"avatarUrl":"https://avatars0.githubusercontent.com/u/5731503?v=4","bio":"Former math student. Current software engineer.","location":"Seattle, WA","name":"R. Conner Howell","url":"https://github.com/RCHowell","pinnedItems":{"nodes":[{"name":"Huffy","createdAt":"2019-02-04T20:18:12Z","url":"https://github.com/RCHowell/Huffy","description":"Using Huffman encoding to compress text files implemented  in Elixir/Erlang","languages":{"nodes":[{"name":"Elixir","color":"#6e4a7e"}]},"stargazers":{"totalCount":0}},{"name":"flutter_plot","createdAt":"2018-03-22T22:40:23Z","url":"https://github.com/RCHowell/flutter_plot","description":"A pretty plotting package for Flutter apps","languages":{"nodes":[{"name":"Dart","color":"#00B4AB"}]},"stargazers":{"totalCount":26}},{"name":"Redpoint","createdAt":"2019-10-14T01:50:39Z","url":"https://github.com/RCHowell/Redpoint","description":"Red River Gorge Climbing Guidebook","languages":{"nodes":[{"name":"Dart","color":"#00B4AB"}]},"stargazers":{"totalCount":0}},{"name":"synesthesia","createdAt":"2016-11-19T06:03:03Z","url":"https://github.com/RCHowell/synesthesia","description":"Synthesizing Music and Video","languages":{"nodes":[{"name":"C++","color":"#f34b7d"}]},"stargazers":{"totalCount":0}},{"name":"Wonkavision","createdAt":"2019-12-07T19:26:20Z","url":"https://github.com/RCHowell/Wonkavision","description":"Where is the chocolate?","languages":{"nodes":[{"name":"Python","color":"#3572A5"}]},"stargazers":{"totalCount":3}},{"createdAt":"2019-02-25T18:11:35Z","url":"https://gist.github.com/a1e85000d06cb82b80edc062426a333a","description":"Computing the Homology of a Simplicial Complex","stargazers":{"totalCount":0}}]}},"posts":[{"title":"SAC 843rd","authorAssociation":"OWNER","createdAt":"2020-02-08T19:30:17Z","url":"https://github.com/RCHowell/rchowell.github.io/issues/1","labels":{"nodes":[{"name":"Plan R","color":"c41600"},{"name":"SAC-843","color":"011c5b"}]}},{"title":"Second for testing","authorAssociation":"OWNER","createdAt":"2020-02-08T22:57:21Z","url":"https://github.com/RCHowell/rchowell.github.io/issues/2","labels":{"nodes":[]}}]}}';

const populate = async () => {
  const container = document.getElementById('main');
  const mainTemplateSource = document.getElementById('main-template').innerHTML;
  const template = Handlebars.compile(mainTemplateSource);
  const res = await fetch(new Request(base, options));
  const json = await res.json();
  // const json = JSON.parse(test);
  console.log(json);
  const posts = json.data.repository.issues.nodes
    .filter((n) => n.authorAssociation === 'OWNER')
    .map((p) => {
      p.createdAt = moment(p.createdAt).format('MMM Do YYYY');
      return p;
    });
  json.data.posts = posts;
  container.innerHTML = template(json.data);
  console.log(json);
};
