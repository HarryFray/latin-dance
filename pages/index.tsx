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
  padding: 40px;
`;

const Home = ({ posts }: Posts): JSX.Element => {
  console.log(posts);
  return (
    <>
      <Head>
        <title>Latin Dance</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StyledApp className={cx(styles.main, inter.className)}>
        <h1 className="text-6xl text-blue-600 md:text-blue-600">Latin Dance</h1>
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
