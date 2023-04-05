import Head from "next/head";
import { GraphQLClient, gql } from "graphql-request";
import { Inter } from "next/font/google";
import cx from "classnames";
import styled from "styled-components";

import styles from "dance/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

const graphcms = new GraphQLClient(
  process?.env?.REACT_APP_HYGRAPH_ENDPOINT ?? ""
);

// TODO: GENERATE TYPES FROM GRAPHQL SCHEMA
type Post = {
  id: string;
  title: string;
  coverPhoto: {
    id: string;
    url: string;
  };
  content: {
    html: string;
  };
  author: {
    name: string;
  };
};

type Posts = {
  posts: Post[] | [];
};

const QUERY = gql`
  {
    posts {
      id
      title
      coverPhoto {
        id
        url
      }
      content {
        html
      }
      author {
        name
      }
    }
  }
`;

const StyledApp = styled.main`
  .navigation {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #f5f5f5;
    padding: 12px 24px;
    width: 100%;

    .link {
      margin-left: 24px;

      :hover {
        cursor: pointer;
      }
    }
  }

  .heading {
    width: 100%;
    text-align: center;
    padding: 24px;
  }

  .content {
    display: flex;
    align-items: start;
    justify-content: center;
    height: 100vh;
    width: 100vw;

    .chat,
    .blog {
      width: 50%;
      height: 100%;
      padding: 24px;
      background-color: #f5f5f5;
      margin: 12px;
      border-radius: 4px;

      .title {
        font-size: 24px;
        width: 100%;
        text-align: center;
        padding: 24px;
      }
    }

    .blog {
      .posts {
        display: flex;
        flex-direction: column;

        .post {
          display: flex;
          justify-content: space-between;
          padding: 12px 24px;
          border: 1px solid #000;
          margin-bottom: 12px;
          border-radius: 4px;

          :hover {
            cursor: pointer;
            border: 1px solid #f5f5f5;
          }

          img {
            width: 80px;
            height: 80px;
            border-radius: 4px;
          }
        }
      }
    }

    .chat {
    }
  }
`;

const Home = ({ posts }: Posts): JSX.Element => {
  return (
    <>
      <Head>
        <title>Latin Dance</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StyledApp className={cx(styles.main, inter.className)}>
        <nav className="navigation">
          <div className="link">Blog</div>
          <div className="link">Chat</div>
        </nav>
        <h1 className="heading">Latin Dance</h1>
        <div className="content">
          <div className="blog">
            <h2 className="title">Blog</h2>
            <div className="posts">
              {posts.map((post) => {
                return (
                  <div key={post.id} className="post">
                    <div>
                      <h3 className="post_title">{post.title}</h3>
                      <div className="post_author">{`- ${post.author.name}`}</div>
                    </div>
                    <img alt={post.title} src={post.coverPhoto.url} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="chat">
            <h2 className="title">Chat</h2>
          </div>
        </div>
      </StyledApp>
    </>
  );
};

export async function getStaticProps() {
  try {
    const { posts }: Posts = await graphcms.request(QUERY);

    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        posts: [],
      },
    };
  }
}

export default Home;
