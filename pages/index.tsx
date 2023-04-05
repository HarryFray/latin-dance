import Head from "next/head";
import { GraphQLClient, gql } from "graphql-request";
import { Inter } from "next/font/google";
import styles from "dance/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

const graphcms = new GraphQLClient(
  process?.env?.REACT_APP_HYGRAPH_ENDPOINT ?? ""
);

type Post = {
  id: string;
  title: string;
};

type Posts = {
  posts: Post[] | [];
};

const QUERY = gql`
  {
    posts {
      id
      title
    }
  }
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
      <main className={styles.main}>
        <h1 className={inter.className}>Latin Dance</h1>
      </main>
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
